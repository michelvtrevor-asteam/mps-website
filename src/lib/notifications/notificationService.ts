import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/sendEmail";
import { sendWhatsAppMessage } from "./whatsapp";
import {
  NotificationType,
  NotificationAudience,
  NotificationChannel,
  DeliveryStatus,
} from "@prisma/client";

export async function createAndSendNotification(input: {
  type: NotificationType;
  title: string;
  message: string;
  audience: NotificationAudience;
  programId?: string | null;
  studentId?: string | null;
  createdById?: string | null;
}) {
  const notification = await prisma.notification.create({
    data: {
      type: input.type,
      status: "SENT",
      audience: input.audience,
      title: input.title,
      message: input.message,
      programId: input.programId,
      studentId: input.studentId,
      sentAt: new Date(),
      createdById: input.createdById,
    },
  });

  const recipients = await resolveRecipients(input);
  for (const r of recipients) {
    await sendNotificationToRecipient(notification.id, r.email, r.phone, input.message, input.title);
  }
  return notification;
}

async function resolveRecipients(input: {
  audience: NotificationAudience;
  programId?: string | null;
  studentId?: string | null;
}) {
  if (input.audience === "ALL_PARENTS") {
    const parents = await prisma.parentProfile.findMany({
      include: { user: true },
    });
    return parents.map((p) => ({ email: p.user.email, phone: p.phone ?? "" }));
  }
  if (input.audience === "PROGRAM_PARENTS" && input.programId) {
    const students = await prisma.student.findMany({
      where: { programId: input.programId },
      include: { parentProfile: { include: { user: true } } },
    });
    const seen = new Set<string>();
    return students
      .filter((s) => !seen.has(s.parentProfile.user.email))
      .map((s) => {
        seen.add(s.parentProfile.user.email);
        return { email: s.parentProfile.user.email, phone: s.parentProfile.phone ?? "" };
      });
  }
  if (input.audience === "STUDENT_PARENT" && input.studentId) {
    const student = await prisma.student.findUnique({
      where: { id: input.studentId },
      include: { parentProfile: { include: { user: true } } },
    });
    if (!student) return [];
    return [{ email: student.parentProfile.user.email, phone: student.parentProfile.phone ?? "" }];
  }
  return [];
}

async function sendNotificationToRecipient(
  notificationId: string,
  email: string,
  phone: string,
  message: string,
  title: string
) {
  try {
    await sendEmail({ to: email, subject: title, text: message });
    await prisma.notificationDeliveryLog.create({
      data: {
        notificationId,
        channel: NotificationChannel.EMAIL,
        status: DeliveryStatus.SENT,
        toAddress: email,
      },
    });
  } catch (e) {
    await prisma.notificationDeliveryLog.create({
      data: {
        notificationId,
        channel: NotificationChannel.EMAIL,
        status: DeliveryStatus.FAILED,
        toAddress: email,
        error: String(e),
      },
    });
  }

  if (phone) {
    const ok = await sendWhatsAppMessage({ to: phone, body: `${title}\n\n${message}` });
    await prisma.notificationDeliveryLog.create({
      data: {
        notificationId,
        channel: NotificationChannel.WHATSAPP,
        status: ok ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
        toAddress: phone,
      },
    });
  }
}
