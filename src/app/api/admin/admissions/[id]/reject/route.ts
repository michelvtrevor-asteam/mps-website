import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  notes: z.string().max(500).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const application = await prisma.admissionApplication.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (application.status === "APPROVED") {
    return NextResponse.json({ error: "Already approved." }, { status: 400 });
  }

  await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedById: auth.id,
      decisionNotes: parsed.data.notes,
    },
  });

  return NextResponse.json({ ok: true });
}

