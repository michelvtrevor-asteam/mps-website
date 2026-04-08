import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { CreateTermForm, TogglePublishButton } from "./ResultActions";
import { 
  Trophy, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  ChevronRight,
  ArrowLeft,
  GraduationCap
} from "lucide-react";

export default async function AdminResultsHome() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const terms = await prisma.examTerm.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
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
            Manage {terms.length} examination terms and student performance.
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

      {/* Action Area: Create Term */}
      <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/10 text-brand-yellow">
            <Plus className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-zinc-900">Create New Term</h2>
        </div>
        <CreateTermForm />
      </div>

      {/* Terms List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-5">Examination Term</div>
          <div className="col-span-3">Created Date</div>
          <div className="col-span-2">Visibility</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {terms.map((t) => (
            <div key={t.id} className="group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-all hover:bg-zinc-50/50">
              <div className="col-span-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/10 text-brand-yellow group-hover:rotate-6 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display font-bold text-zinc-900 group-hover:text-brand-yellow transition-colors">{t.name}</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Academic Year 2026</div>
                </div>
              </div>

              <div className="col-span-3 flex items-center gap-2 text-xs font-bold text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                {t.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>

              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    t.isPublished
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-zinc-50 text-zinc-400 border border-zinc-100"
                  }`}
                >
                  {t.isPublished ? (
                    <>
                      <Eye className="h-3 w-3" /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" /> Draft
                    </>
                  )}
                </span>
              </div>

              <div className="col-span-2 flex justify-end gap-2">
                <Link
                  href={`/admin/results/${t.id}`}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-yellow"
                >
                  Enter Marks
                </Link>
                <TogglePublishButton termId={t.id} isPublished={t.isPublished} />
              </div>
            </div>
          ))}

          {terms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No terms created yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Start by creating an examination term like "First Term 2026".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
