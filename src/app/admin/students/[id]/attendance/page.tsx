import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

export default async function StudentAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.STAFF]);
  if (!auth) {
    return (
      <div className="p-8">
        <p className="text-sm text-zinc-600">Unauthorized.</p>
      </div>
    );
  }

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { program: true },
  });
  if (!student) {
    return (
      <div className="p-8">
        <p className="text-sm text-zinc-600">Student not found.</p>
      </div>
    );
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);
  const records = await prisma.attendance.findMany({
    where: { studentId: student.id, date: { gte: since } },
    orderBy: { date: "desc" },
  });

  const present = records.filter((r) => r.status === "PRESENT").length;
  const total = records.length;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Attendance history</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {student.fullName} • {student.program.name}
          </p>
        </div>
        <Link
          href={`/admin/students/${student.id}/edit`}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Back
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-xs text-zinc-600">Last 60 days</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900">
            {percent}%
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Present {present} / {total}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
          <div className="col-span-4">Date</div>
          <div className="col-span-4">Status</div>
          <div className="col-span-4">Remark</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {records.map((r) => (
            <div key={r.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
              <div className="col-span-4">{r.date.toISOString().slice(0, 10)}</div>
              <div className="col-span-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    r.status === "PRESENT"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="col-span-4 text-zinc-600">{r.remark ?? "-"}</div>
            </div>
          ))}

          {records.length === 0 ? (
            <div className="px-4 py-10 text-sm text-zinc-600">
              No attendance records yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

