"use client";

import { useState } from "react";
import { recordPayment } from "@/actions/fees";

export function PaymentForm({ invoiceId }: { invoiceId: string }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await recordPayment(invoiceId, formData);
      alert("Payment recorded successfully");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-zinc-900">Record payment</div>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-medium text-zinc-700">Amount (₹)</label>
          <input
            name="amountRupees"
            type="number"
            min={1}
            step="0.01"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">Method</label>
          <select
            name="method"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
            defaultValue="CASH"
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CARD">Card</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">
            Reference (optional)
          </label>
          <input
            name="reference"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Recording..." : "Add payment"}
        </button>
      </form>
    </div>
  );
}
