"use client";

import { useState } from "react";
import { updateStudent, archiveStudent } from "@/actions/students";

type Program = { id: string; name: string };
type ParentProfile = { id: string; name: string };
type Student = {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  age: number;
  address: string;
  programId: string;
  parentProfileId: string | null;
};

export function EditStudentForm({
  student,
  programs,
  parentProfiles,
}: {
  student: Student;
  programs: Program[];
  parentProfiles: ParentProfile[];
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateStudent(student.id, formData);
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this student?")) return;
    setSubmitting(true);
    try {
      await archiveStudent(student.id);
    } catch (err) {
      console.error(err);
      alert("Failed to archive student");
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-zinc-700">Full Name</label>
              <input
                name="fullName"
                defaultValue={student.fullName}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                defaultValue={student.dateOfBirth.toISOString().slice(0, 10)}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700">Age</label>
              <input
                name="age"
                type="number"
                defaultValue={student.age}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-zinc-700">Program</label>
              <select
                name="programId"
                defaultValue={student.programId}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                required
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-zinc-700">Linked Parent</label>
              <select
                name="parentProfileId"
                defaultValue={student.parentProfileId ?? ""}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>
                  Select parent profile
                </option>
                {parentProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-zinc-400 font-medium">Changing the parent will determine who can see this student in their portal.</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-zinc-700">Address</label>
              <textarea
                name="address"
                rows={3}
                defaultValue={student.address}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <div className="text-sm font-semibold text-red-900">Danger zone</div>
        <p className="mt-1 text-xs text-red-700">
          Archiving will remove the student from active lists. This cannot be undone easily.
        </p>
        <button
          onClick={handleArchive}
          disabled={submitting}
          className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Archive student
        </button>
      </div>
    </div>
  );
}
