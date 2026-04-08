import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { 
  Award, 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  UserCheck,
  ChevronRight,
  Medal,
  Star
} from "lucide-react";

function pct(present: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((present / total) * 100);
}

export default async function AdminLeaderboardsPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const students = await prisma.student.findMany({
    where: { isArchived: false },
    include: { program: true },
    take: 500,
  });

  const attendance = await prisma.attendance.findMany({
    where: { date: { gte: since }, studentId: { in: students.map((s) => s.id) } },
  });

  const attAgg = new Map<string, { present: number; total: number }>();
  for (const a of attendance) {
    const curr = attAgg.get(a.studentId) ?? { present: 0, total: 0 };
    curr.total += 1;
    if (a.status === "PRESENT") curr.present += 1;
    attAgg.set(a.studentId, curr);
  }

  const attendanceLeaderboard = students
    .map((s) => {
      const agg = attAgg.get(s.id) ?? { present: 0, total: 0 };
      return { student: s, ...agg, percent: pct(agg.present, agg.total) };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 20);

  const latestPublishedTerm = await prisma.examTerm.findFirst({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  const academic = latestPublishedTerm
    ? await prisma.result.findMany({
        where: { termId: latestPublishedTerm.id },
        include: { student: { include: { program: true } } },
        take: 500,
      })
    : [];

  const academicLeaderboard = academic
    .filter((r) => typeof r.score === "number")
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 20);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-pink">
            <Award className="h-3 w-3" /> Recognition Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Student <span className="text-brand-pink">Leaderboards</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Celebrating excellence in attendance and academics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Attendance Leaderboard */}
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
          <div className="bg-brand-pink p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-black">Attendance Stars</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest opacity-80 text-brand-yellow">Top 20 • Last 30 Days</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <UserCheck className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-zinc-100">
            {attendanceLeaderboard.map((row, idx) => (
              <div key={row.student.id} className="group flex items-center justify-between px-8 py-5 transition-colors hover:bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-black border-2 ${
                    idx === 0 ? "bg-brand-yellow/10 border-brand-yellow text-brand-yellow" : 
                    idx === 1 ? "bg-zinc-100 border-zinc-200 text-zinc-400" :
                    idx === 2 ? "bg-orange-50 border-orange-200 text-orange-400" :
                    "bg-white border-zinc-100 text-zinc-300"
                  }`}>
                    {idx === 0 ? <Medal className="h-5 w-5" /> : idx + 1}
                  </div>
                  <div>
                    <div className="font-display font-bold text-zinc-900 group-hover:text-brand-pink transition-colors">{row.student.fullName}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{row.student.program.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-black text-zinc-900">{row.percent}%</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {row.present}/{row.total} Days
                  </div>
                </div>
              </div>
            ))}
            {attendanceLeaderboard.length === 0 && (
              <div className="px-8 py-12 text-center text-zinc-500">
                <Calendar className="mx-auto h-10 w-10 opacity-20 mb-4" />
                <p className="text-sm font-medium">No attendance data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Academic Leaderboard */}
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
          <div className="bg-brand-indigo p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-black">Academic Heroes</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest opacity-80 text-brand-pink">
                  {latestPublishedTerm ? `Term: ${latestPublishedTerm.name}` : "No term published"}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Trophy className="h-8 w-8 text-brand-yellow" />
              </div>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {academicLeaderboard.map((r, idx) => (
              <div key={r.id} className="group flex items-center justify-between px-8 py-5 transition-colors hover:bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-black border-2 ${
                    idx === 0 ? "bg-brand-yellow/10 border-brand-yellow text-brand-yellow" : 
                    idx === 1 ? "bg-zinc-100 border-zinc-200 text-zinc-400" :
                    idx === 2 ? "bg-orange-50 border-orange-200 text-orange-400" :
                    "bg-white border-zinc-100 text-zinc-300"
                  }`}>
                    {idx === 0 ? <Star className="h-5 w-5 fill-brand-yellow" /> : idx + 1}
                  </div>
                  <div>
                    <div className="font-display font-bold text-zinc-900 group-hover:text-brand-indigo transition-colors">{r.student.fullName}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{r.student.program.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-black text-zinc-900">{r.score}</div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    Grade {r.grade ?? "-"}
                  </div>
                </div>
              </div>
            ))}
            {academicLeaderboard.length === 0 && (
              <div className="px-8 py-12 text-center text-zinc-500">
                <Medal className="mx-auto h-10 w-10 opacity-20 mb-4" />
                <p className="text-sm font-medium">Publish a term to see academic rankings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
