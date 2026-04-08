import { getParentContext } from "@/lib/parent/context";
import { prisma } from "@/lib/db";
import { 
  Trophy, 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  Star,
  GraduationCap,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default async function ParentResultsPage() {
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
  const results = await prisma.result.findMany({
    where: { studentId: { in: studentIds }, term: { isPublished: true } },
    include: { term: true, student: true },
    orderBy: [{ term: { createdAt: "desc" } }],
    take: 200,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
            <Trophy className="h-3 w-3" /> Academic Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Exam <span className="text-brand-yellow">Results</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            View published performance reports for your children.
          </p>
        </div>
        
        <Link
          href="/parent"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Results List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-5">Examination Term</div>
          <div className="col-span-4">Student</div>
          <div className="col-span-1">Grade</div>
          <div className="col-span-2 text-right">Score</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {results.map((r) => (
            <div key={r.id} className="group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-all hover:bg-zinc-50/50">
              <div className="col-span-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/10 text-brand-yellow group-hover:rotate-6 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display font-bold text-zinc-900 group-hover:text-brand-yellow transition-colors">{r.term.name}</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Academic Year 2026</div>
                </div>
              </div>

              <div className="col-span-4 flex items-center gap-2 text-sm font-bold text-zinc-900">
                <User className="h-3 w-3 text-zinc-400" /> {r.student.fullName}
              </div>

              <div className="col-span-1">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-brand-pink/10 text-brand-pink font-black text-xs">
                  {r.grade ?? "-"}
                </span>
              </div>

              <div className="col-span-2 text-right">
                <div className="font-display font-black text-2xl text-zinc-900">
                  {typeof r.score === "number" ? r.score : "-"}
                </div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Points</div>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No results yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Academic results will appear here once they are published by the school.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recognition Note */}
      <div className="rounded-[2rem] bg-zinc-900 p-10 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-pink">
            <Star className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Celebrating Progress</h3>
            <p className="mt-1 text-sm text-zinc-400">Every child learns at their own pace. We celebrate every milestone reached!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
