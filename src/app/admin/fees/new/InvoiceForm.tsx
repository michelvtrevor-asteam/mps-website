"use client";

import { useState } from "react";
import { createInvoice } from "@/actions/fees";

type Student = { id: string; fullName: string };

export function InvoiceForm({ students, today }: { students: Student[]; today: string }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createInvoice(formData);
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-800">Student</label>
          <select
            name="studentId"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
            required
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800">
            Amount (₹)
          </label>
          <input
            name="amountRupees"
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800">Due Date</label>
          <input
            name="dueDate"
            type="date"
            defaultValue={today}
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create invoice"}
        </button>
      </div>
    </form>
  );
}
