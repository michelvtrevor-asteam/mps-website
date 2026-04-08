"use client";

import { useState } from "react";
import { createTerm, togglePublish } from "@/actions/results";

export function CreateTermForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createTerm(formData);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create term");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="text-sm font-semibold text-zinc-900">Create term</div>
      <div className="mt-3 flex gap-2">
        <input
          name="name"
          placeholder="Term 1, Term 2, Final, etc."
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}

export function TogglePublishButton({ termId, isPublished }: { termId: string; isPublished: boolean }) {
  const [submitting, setSubmitting] = useState(false);

  const handleToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await togglePublish(termId);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleToggle}>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {submitting ? "..." : (isPublished ? "Unpublish" : "Publish")}
      </button>
    </form>
  );
}
