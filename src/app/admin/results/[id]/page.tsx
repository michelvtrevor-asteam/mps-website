import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { ResultsEntryForm } from "./ResultsEntryForm";
import { 
  Trophy, 
  ArrowLeft, 
  GraduationCap, 
  Users 
} from "lucide-react";

export default async function TermResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const { id } = await params;
  const term = await prisma.examTerm.findUnique({ where: { id } });
  if (!term) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
          <Trophy className="h-8 w-8" />
        </div>
        <h3 className="font-display text-xl font-bold text-zinc-900">Term not found</h3>
        <Link href="/admin/results" className="mt-6 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-yellow">
          Back to Hub
        </Link>
      </div>
    );
  }

  const students = await prisma.student.findMany({
    where: { isArchived: false },
    include: { program: true },
    orderBy: [{ program: { name: "asc" } }, { fullName: "asc" }],
    take: 500,
  });

  const results = await prisma.result.findMany({
    where: { termId: term.id, studentId: { in: students.map((s) => s.id) } },
  });
  const resultsByStudent = Object.fromEntries(
    results.map((r) => [
      r.studentId,
      { grade: r.grade, score: r.score, remarks: r.remarks },
    ])
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
            <Trophy className="h-3 w-3" /> Grade Portal
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Enter <span className="text-brand-yellow">Results</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Term: <span className="font-bold text-zinc-900">{term.name}</span> • {students.length} students enrolled.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/results"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Hub
          </Link>
        </div>
      </div>

      <ResultsEntryForm
        termId={term.id}
        students={students}
        resultsByStudent={resultsByStudent}
      />
    </div>
  );
}

