"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auditLog } from "@/lib/audit";

export async function createTerm(fd: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const name = String(fd.get("name") ?? "").trim();
  if (!name) throw new Error("Name required");

  const term = await prisma.examTerm.create({ data: { name } });
  await auditLog({
    actorId: adminId,
    action: "term.create",
    entityType: "ExamTerm",
    entityId: term.id,
    metadata: { name },
  });
  revalidatePath("/admin/results");
}

export async function togglePublish(termId: string) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const term = await prisma.examTerm.findUnique({ where: { id: termId } });
  if (!term) throw new Error("Not found");
  const next = !term.isPublished;
  await prisma.examTerm.update({
    where: { id: termId },
    data: { isPublished: next, publishedAt: next ? new Date() : null },
  });
  await auditLog({
    actorId: adminId,
    action: next ? "term.publish" : "term.unpublish",
    entityType: "ExamTerm",
    entityId: termId,
  });
  revalidatePath("/admin/results");
}

export async function saveResults(termId: string, fd: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const students = await prisma.student.findMany({
    where: { isArchived: false },
    select: { id: true },
  });

  const ops: Promise<any>[] = [];
  for (const s of students) {
    const grade = String(fd.get(`grade_${s.id}`) ?? "").trim();
    const scoreRaw = String(fd.get(`score_${s.id}`) ?? "").trim();
    const remarks = String(fd.get(`remarks_${s.id}`) ?? "").trim();
    const score = scoreRaw.length ? Number(scoreRaw) : null;
    if (scoreRaw.length && !Number.isFinite(score as number)) continue;

    // Only upsert if any value exists.
    if (!grade && (score === null || score === undefined) && !remarks) continue;

    ops.push(
      prisma.result.upsert({
        where: { termId_studentId: { termId, studentId: s.id } },
        update: { grade: grade || null, score, remarks: remarks || null },
        create: {
          termId,
          studentId: s.id,
          grade: grade || null,
          score,
          remarks: remarks || null,
        },
      }),
    );
  }

  await Promise.all(ops);

  await auditLog({
    actorId: adminId,
    action: "results.save",
    entityType: "ExamTerm",
    entityId: termId,
  });

  revalidatePath(`/admin/results/${termId}`);
}
