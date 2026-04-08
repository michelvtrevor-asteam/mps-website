import { getParentContext } from "@/lib/parent/context";
import { prisma } from "@/lib/db";
import { 
  CalendarCheck, 
  ArrowLeft, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";

export default async function ParentAttendancePage() {
  const ctx = await getParentContext();
  
  if (!ctx) {
    return (
      <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-8 text-red-800 shadow-sm">
        <h2 className="font-display text-xl font-bold">Profile Not Found</h2>
        <p className="mt-2 text-sm opacity-80">Please contact administration.</p>
      </div>
    );
  }

  const studentIds = ctx.parentProfile.students.map((s) => s.id);
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);
  const records = await prisma.attendance.findMany({
    where: { studentId: { in: studentIds }, date: { gte: since } },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            <CalendarCheck className="h-3 w-3" /> Student Welfare
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Daily <span className="text-emerald-500">Attendance</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Reviewing logs for the last 60 days.
          </p>
        </div>
        
        <Link
          href="/parent"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Attendance List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-4">Date & Day</div>
          <div className="col-span-5">Student</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {records.map((r) => {
            const student = ctx.parentProfile.students.find((s) => s.id === r.studentId);
            const dateStr = r.date.toLocaleDateString('en-IN', { 
              weekday: 'short', 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            });
            
            return (
              <div key={r.id} className="group grid grid-cols-12 items-center gap-4 px-6 py-5 transition-colors hover:bg-zinc-50/50">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900">{dateStr}</div>
                </div>

                <div className="col-span-5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500">
                    {student?.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{student?.fullName}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{student?.program.name}</div>
                  </div>
                </div>

                <div className="col-span-3 flex justify-end">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      r.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      r.status === "PRESENT" ? "bg-emerald-500" : "bg-rose-500"
                    }`} />
                    {r.status}
                  </span>
                </div>
              </div>
            );
          })}

          {records.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <CalendarCheck className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No attendance yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Attendance records will appear here as they are marked.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
