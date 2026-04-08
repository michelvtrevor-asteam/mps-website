"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { AttendanceStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email/sendEmail";

function toDayStartUTC(dateStr: string) {
  // dateStr: YYYY-MM-DD
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function saveAttendance(formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.STAFF]);
  if (!auth) throw new Error("Unauthorized");

  const markerId = auth.id;
  const programId = String(formData.get("programId") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  const date = toDayStartUTC(dateStr);

  const students = await prisma.student.findMany({
    where: { programId, isArchived: false },
    include: { parentProfile: { include: { user: true } } },
    orderBy: { fullName: "asc" },
  });

  const updates: Promise<any>[] = [];
  const absences: { studentName: string; email: string; dateStr: string }[] = [];

  for (const s of students) {
    const raw = String(formData.get(`att_${s.id}`) ?? "");
    const status =
      raw === "PRESENT" ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT;

    updates.push(
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: s.id, date } },
        update: { status, markedById: markerId },
        create: { studentId: s.id, date, status, markedById: markerId },
      }),
    );

    const parentEmail = s.parentProfile?.user?.email;
    if (status === AttendanceStatus.ABSENT && parentEmail) {
      absences.push({
        studentName: s.fullName,
        email: parentEmail,
        dateStr,
      });
    }
  }

  await Promise.all(updates);

  for (const a of absences) {
    await sendEmail({
      to: a.email,
      subject: "Maanvi’s Preschool - Absence Alert",
      text: `Attendance update: ${a.studentName} is marked ABSENT on ${a.dateStr}.\n\nIf this is incorrect, please contact the school.\n`,
    });
  }

  revalidatePath("/staff/attendance");
}
