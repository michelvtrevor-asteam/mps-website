import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { AttendanceForm } from "./AttendanceForm";

function toDayStartUTC(dateStr: string) {
  // dateStr: YYYY-MM-DD
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export default async function StaffAttendancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.STAFF]);
  if (!auth) {
    return (
      <div className="p-8">
        <p className="text-sm text-zinc-600">Unauthorized.</p>
      </div>
    );
  }

  const params = await searchParams;
  const programs = await prisma.program.findMany({ orderBy: { name: "asc" } });
  const programId =
    typeof params?.programId === "string"
      ? params.programId
      : programs[0]?.id;
  const today = new Date().toISOString().slice(0, 10);
  const dateStr =
    typeof params?.date === "string" ? params.date : today;

  const date = toDayStartUTC(dateStr);
  const students =
    programId
      ? await prisma.student.findMany({
          where: { programId, isArchived: false },
          orderBy: { fullName: "asc" },
        })
      : [];

  const existing = programId
    ? await prisma.attendance.findMany({
        where: {
          date,
          studentId: { in: students.map((s) => s.id) },
        },
      })
    : [];

  const existingByStudent = Object.fromEntries(
    existing.map((a) => [a.studentId, a.status])
  );

  return (
    <div className="p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="mt-1 text-sm text-zinc-600">Mark daily attendance.</p>
        </div>
        <Link
          href="/staff"
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Back
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <form action="/staff/attendance" method="GET">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-800">Program</label>
              <select
                name="programId"
                defaultValue={programId}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800">Date</label>
              <input
                name="date"
                type="date"
                defaultValue={dateStr}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              type="submit"
            >
              Load
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-zinc-200 pt-6">
          <AttendanceForm
            students={students}
            existingByStudent={existingByStudent}
            programId={programId || ""}
            dateStr={dateStr}
          />
        </div>
      </div>
    </div>
  );
}


