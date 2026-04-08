"use client";

import { useState } from "react";
import { saveAttendance } from "@/actions/attendance";

type Student = { id: string; fullName: string };

export function AttendanceForm({
  students,
  existingByStudent,
  programId,
  dateStr,
}: {
  students: Student[];
  existingByStudent: Record<string, string>;
  programId: string;
  dateStr: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await saveAttendance(formData);
      alert("Attendance saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="date" value={dateStr} />

      <div className="space-y-3">
        {students.map((s) => {
          const current = existingByStudent[s.id] ?? "PRESENT";
          return (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-sm font-semibold text-zinc-900">
                {s.fullName}
              </div>
              <div className="flex gap-3 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`att_${s.id}`}
                    value="PRESENT"
                    defaultChecked={current === "PRESENT"}
                  />
                  Present
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`att_${s.id}`}
                    value="ABSENT"
                    defaultChecked={current === "ABSENT"}
                  />
                  Absent
                </label>
              </div>
            </div>
          );
        })}

        {students.length === 0 ? (
          <div className="text-sm text-zinc-600">
            No students found for this program.
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save attendance"}
        </button>
      </div>
    </form>
  );
}
