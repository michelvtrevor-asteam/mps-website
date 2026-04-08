"use server";

import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { createPasswordSetupToken } from "@/lib/auth/userTokens";
import { sendEmail } from "@/lib/email/sendEmail";
import { env } from "@/env";

export async function approveAdmission(id: string) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const application = await prisma.admissionApplication.findUnique({
    where: { id },
  });
  if (!application) throw new Error("Not found");
  if (application.status === "APPROVED" && application.approvedStudentId)
    return;

  const parentEmail = application.email.toLowerCase();

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
    update: {
      name: application.parentName,
      phone: application.phoneNumber,
    },
    create: {
      userId: user.id,
      name: application.parentName,
      phone: application.phoneNumber,
    },
  });

  const student = await prisma.student.create({
    data: {
      fullName: application.studentName,
      dateOfBirth: application.dateOfBirth,
      age: application.age,
      address: application.address,
      programId: application.programId,
      parentProfileId: parentProfile.id,
      admissionDate: new Date(),
    },
  });

  await prisma.admissionApplication.update({
    where: { id: application.id },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
      reviewedById: adminId,
      approvedStudentId: student.id,
    },
  });

  const token = await createPasswordSetupToken(user.id);
  const setupUrl = `${env.NEXTAUTH_URL}/set-password?token=${token}`;

  await sendEmail({
    to: parentEmail,
    subject: "Maanvi’s Preschool - Parent Portal Access",
    text: `Your admission has been approved.\n\nSet your password using this link (valid for 48 hours):\n${setupUrl}\n\nAfter setting the password, you can log in at:\n${env.NEXTAUTH_URL}/login\n`,
  });

  revalidatePath("/admin/admissions");
}

export async function rejectAdmission(id: string, notes: string) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedById: adminId,
      decisionNotes: notes || undefined,
    },
  });
  revalidatePath("/admin/admissions");
}
