"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auditLog } from "@/lib/audit";

export async function createParent(formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    throw new Error("Name, Email, and Password are required.");
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole.PARENT,
      parentProfile: {
        create: {
          name,
          phone: phone || undefined,
        },
      },
    },
    include: { parentProfile: true },
  });

  await auditLog({
    actorId: auth.id,
    action: "parent.create",
    entityType: "User",
    entityId: user.id,
    metadata: { name, email },
  });

  revalidatePath("/admin/parents");
  return { success: true };
}

export async function resetParentPassword(userId: string, formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const newPassword = String(formData.get("password") ?? "");
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await auditLog({
    actorId: auth.id,
    action: "parent.password_reset",
    entityType: "User",
    entityId: userId,
  });

  return { success: true };
}

export async function updateParent(userId: string, formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const studentIdsInput = String(formData.get("studentIds") ?? ""); // Comma separated IDs
  const studentIds = studentIdsInput ? studentIdsInput.split(",").filter(Boolean) : [];

  if (!name || !email) {
    throw new Error("Name and Email are required.");
  }

  // Check if email changed and is already taken
  const existing = await prisma.user.findFirst({ 
    where: { 
      email,
      id: { not: userId }
    } 
  });
  if (existing) {
    throw new Error("This email is already taken by another user.");
  }

  await prisma.$transaction(async (tx) => {
    // 1. Update User email
    await tx.user.update({
      where: { id: userId },
      data: { email },
    });

    // 2. Update ParentProfile
    const profile = await tx.parentProfile.update({
      where: { userId },
      data: { name, phone },
    });

    // 3. Update Student Links
    // First, unlink all currently linked students for this parent
    await tx.student.updateMany({
      where: { parentProfileId: profile.id },
      data: { parentProfileId: null as any }
    });

    // Then, link the new set of students
    if (studentIds.length > 0) {
      await tx.student.updateMany({
        where: { id: { in: studentIds } },
        data: { parentProfileId: profile.id }
      });
    }
  });

  await auditLog({
    actorId: auth.id,
    action: "parent.update",
    entityType: "User",
    entityId: userId,
    metadata: { name, email },
  });

  revalidatePath("/admin/parents");
  return { success: true };
}

export async function deleteParent(userId: string) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  // Check for linked students
  const profile = await prisma.parentProfile.findUnique({
    where: { userId },
    include: { _count: { select: { students: true } } },
  });

  if (profile && profile._count.students > 0) {
    throw new Error("Cannot delete parent with linked students. Unlink them first.");
  }

  await prisma.user.delete({ where: { id: userId } });

  await auditLog({
    actorId: auth.id,
    action: "parent.delete",
    entityType: "User",
    entityId: userId,
  });

  revalidatePath("/admin/parents");
  return { success: true };
}
