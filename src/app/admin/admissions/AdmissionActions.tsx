"use client";

import { useState } from "react";
import { approveAdmission, rejectAdmission } from "@/actions/admissions";
import { useToast } from "@/components/ui/Toast";

export function AdmissionActions({ id }: { id: string }) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!confirm("Approve this application and create student profile?")) return;
    setSubmitting(true);
    toast("Approving application...", "loading");
    try {
      await approveAdmission(id);
      toast("Application approved successfully!", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to approve application.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    const notes = prompt("Reason for rejection (optional):");
    if (notes === null) return;
    setSubmitting(true);
    toast("Rejecting application...", "loading");
    try {
      await rejectAdmission(id, notes);
      toast("Application rejected.", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to reject application.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={submitting}
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={submitting}
        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
