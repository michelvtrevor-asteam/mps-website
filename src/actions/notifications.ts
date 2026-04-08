"use server";

import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { createAndSendNotification } from "@/lib/notifications/notificationService";
import { revalidatePath } from "next/cache";

export async function sendAnnouncement(fd: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const title = String(fd.get("title") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();
  const audience = (fd.get("audience") as string) ?? "ALL_PARENTS";
  const programId = String(fd.get("programId") ?? "").trim() || null;
  if (!title || !message) throw new Error("Title and message required");

  await createAndSendNotification({
    type: "GENERAL_ANNOUNCEMENT",
    title,
    message,
    audience: audience as "ALL_PARENTS" | "PROGRAM_PARENTS" | "STUDENT_PARENT",
    programId: programId || undefined,
    createdById: adminId,
  });
  revalidatePath("/admin/notifications");
}
