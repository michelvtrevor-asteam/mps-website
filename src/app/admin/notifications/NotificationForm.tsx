"use client";

import { useState } from "react";
import { sendAnnouncement } from "@/actions/notifications";

type Program = { id: string; name: string };

export function NotificationForm({ programs }: { programs: Program[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [audience, setAudience] = useState("ALL_PARENTS");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await sendAnnouncement(formData);
      alert("Announcement sent successfully");
      (e.target as HTMLFormElement).reset();
      setAudience("ALL_PARENTS");
    } catch (err) {
      console.error(err);
      alert("Failed to send announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="text-sm font-semibold text-zinc-900">Send announcement</div>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-zinc-700">Title</label>
          <input
            name="title"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder="e.g. Fee Due Reminder"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">Message</label>
          <textarea
            name="message"
            rows={4}
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder="Your message to parents..."
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">Audience</label>
          <select
            name="audience"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="ALL_PARENTS">All parents</option>
            <option value="PROGRAM_PARENTS">Program parents only</option>
          </select>
        </div>
        {audience === "PROGRAM_PARENTS" && (
          <div>
            <label className="text-xs font-medium text-zinc-700">
              Program
            </label>
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
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send announcement"}
        </button>
      </div>
    </form>
  );
}
