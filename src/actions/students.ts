"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auditLog } from "@/lib/audit";
import { createPasswordSetupToken } from "@/lib/auth/userTokens";
import { sendEmail } from "@/lib/email/sendEmail";
import { env } from "@/env";

export async function createStudent(formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const fullName = String(formData.get("fullName") ?? "").trim();
  const dobStr = String(formData.get("dateOfBirth") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);
  const address = String(formData.get("address") ?? "").trim();
  const programId = String(formData.get("programId") ?? "").trim();

  const parentName = String(formData.get("parentName") ?? "").trim();
  const parentEmail = String(formData.get("parentEmail") ?? "")
    .trim()
    .toLowerCase();
  const parentPhone = String(formData.get("parentPhone") ?? "").trim();
  const sendInvite = String(formData.get("sendInvite") ?? "") === "on";

  if (!fullName || !dobStr || !address || !programId || !parentName || !parentEmail) {
    throw new Error("Missing required fields.");
  }

  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) throw new Error("Invalid DOB.");

  const user = await prisma.user.upsert({
    where: { email: parentEmail },
    update: { role: UserRole.PARENT },
    create: {
      email: parentEmail,
      passwordHash: "TEMP",
      role: UserRole.PARENT,
    },
  });

  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: user.id },
    update: { name: parentName, phone: parentPhone || undefined },
    create: { userId: user.id, name: parentName, phone: parentPhone || undefined },
  });

  const student = await prisma.student.create({
    data: {
      fullName,
      dateOfBirth: dob,
      age,
      address,
      programId,
      parentProfileId: parentProfile.id,
      admissionDate: new Date(),
    },
  });

  await auditLog({
    actorId: adminId,
    action: "student.create",
    entityType: "Student",
    entityId: student.id,
    metadata: { programId, parentEmail },
  });

  if (sendInvite) {
    const token = await createPasswordSetupToken(user.id);
    const setupUrl = `${env.NEXTAUTH_URL}/set-password?token=${token}`;
    await sendEmail({
      to: parentEmail,
      subject: "Maanvi’s Preschool - Parent Portal Access",
      text: `A student profile has been created for ${fullName}.\n\nSet your password using this link (valid for 48 hours):\n${setupUrl}\n\nLogin:\n${env.NEXTAUTH_URL}/login\n`,
    });
  }

  revalidatePath("/admin/students");
  redirect("/admin/students");
}

export async function updateStudent(
  studentId: string,
  formData: FormData,
) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const fullName = String(formData.get("fullName") ?? "").trim();
  const dobStr = String(formData.get("dateOfBirth") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);
  const address = String(formData.get("address") ?? "").trim();
  const programId = String(formData.get("programId") ?? "").trim();
  const parentProfileId = String(formData.get("parentProfileId") ?? "").trim();

  if (!fullName || !dobStr || !address || !programId || !parentProfileId) {
    throw new Error("Missing required fields.");
  }
  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) throw new Error("Invalid DOB.");

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: { fullName, dateOfBirth: dob, age, address, programId, parentProfileId },
  });

  await auditLog({
    actorId: adminId,
    action: "student.update",
    entityType: "Student",
    entityId: updated.id,
    metadata: { programId },
  });

  revalidatePath("/admin/students");
  redirect("/admin/students");
}

export async function archiveStudent(studentId: string) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const updated = await prisma.student.update({
    where: { id: studentId },
    data: { isArchived: true, archivedAt: new Date() },
  });

  await auditLog({
    actorId: adminId,
    action: "student.archive",
    entityType: "Student",
    entityId: updated.id,
  });

  revalidatePath("/admin/students");
  redirect("/admin/students");
}
