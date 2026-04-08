"use client";

import { useState } from "react";
import { createCategory } from "@/actions/gallery";

type Category = { id: string; name: string };

export function CategoryForm({ categories }: { categories: Category[] }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createCategory(formData);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-zinc-900">
        Create category
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          name="name"
          placeholder="Classroom, Activities, Events..."
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "..." : "Save"}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c.id}
            className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600"
          >
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}
