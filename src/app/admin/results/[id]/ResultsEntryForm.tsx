"use client";

import { useState } from "react";
import { saveResults } from "@/actions/results";
import { useToast } from "@/components/ui/Toast";
import { Save, User, Award, BookOpen, MessageSquare } from "lucide-react";

type Student = {
  id: string;
  fullName: string;
  program: { name: string };
};

type Result = {
  grade: string | null;
  score: number | null;
  remarks: string | null;
};

export function ResultsEntryForm({
  termId,
  students,
  resultsByStudent,
}: {
  termId: string;
  students: Student[];
  resultsByStudent: Record<string, Result>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    toast("Saving results...", "loading");
    try {
      const formData = new FormData(e.currentTarget);
      await saveResults(termId, formData);
      toast("All results saved successfully!", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to save results.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-4">Student Details</div>
          <div className="col-span-2 text-center">Grade</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-4">Academic Remarks</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {students.map((s) => {
            const r = resultsByStudent[s.id];
            return (
              <div
                key={s.id}
                className="group grid grid-cols-12 items-center gap-4 px-8 py-6 transition-colors hover:bg-zinc-50/50"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-brand-yellow/20 group-hover:text-brand-yellow">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-zinc-900 group-hover:text-brand-yellow transition-colors">{s.fullName}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.program.name}</div>
                  </div>
                </div>
                
                <div className="col-span-2 flex justify-center px-4">
                  <div className="relative w-full">
                    <Award className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    <input
                      name={`grade_${s.id}`}
                      defaultValue={r?.grade ?? ""}
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs font-bold uppercase transition-all focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/5"
                      placeholder="GRADE"
                    />
                  </div>
                </div>

                <div className="col-span-2 flex justify-center px-4">
                   <div className="relative w-full">
                    <BookOpen className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    <input
                      name={`score_${s.id}`}
                      type="number"
                      defaultValue={r?.score ?? ""}
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs font-bold transition-all focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/5"
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    <input
                      name={`remarks_${s.id}`}
                      defaultValue={r?.remarks ?? ""}
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs font-medium transition-all focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/5"
                      placeholder="Teacher's comments..."
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-black text-white shadow-2xl transition-all hover:scale-105 hover:bg-brand-yellow hover:text-white disabled:opacity-50"
        >
          {submitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Update Academic Records
        </button>
      </div>
    </form>
  );
}
