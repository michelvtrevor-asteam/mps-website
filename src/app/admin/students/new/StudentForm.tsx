"use client";

import { useState } from "react";
import { createStudent } from "@/actions/students";

type Program = { id: string; name: string };

export function StudentForm({ programs }: { programs: Program[] }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createStudent(formData);
    } catch (err) {
      console.error(err);
      alert("Failed to create student");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="text-sm font-semibold text-zinc-900">Student Info</div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Full Name</label>
            <input
              name="fullName"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Age</label>
            <input
              name="age"
              type="number"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Program</label>
            <select
              name="programId"
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
          <div>
            <label className="text-xs font-medium text-zinc-700">Address</label>
            <textarea
              name="address"
              rows={3}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-zinc-900">Parent Info</div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Parent Name</label>
            <input
              name="parentName"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Parent Email</label>
            <input
              name="parentEmail"
              type="email"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Parent Phone</label>
            <input
              name="parentPhone"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="sendInvite"
                defaultChecked
                className="h-4 w-4 rounded border-zinc-300"
              />
              Send email invite to set password
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create student"}
        </button>
      </div>
    </form>
  );
}
