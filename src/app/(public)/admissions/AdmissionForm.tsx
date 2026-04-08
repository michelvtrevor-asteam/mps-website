"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdmissionApplyInput } from "@/lib/validation/admissions";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

type Program = { id: string; name: string; slug: string };

export function AdmissionForm() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<AdmissionApplyInput>({
    studentName: "",
    dateOfBirth: "",
    age: 3,
    parentName: "",
    phoneNumber: "",
    email: "",
    programId: "",
    address: "",
  });

  useEffect(() => {
    let ok = true;
    setLoadingPrograms(true);
    fetch("/api/programs")
      .then((r) => r.json())
      .then((data: { programs?: Program[] }) => {
        if (!ok) return;
        const list = data.programs ?? [];
        setPrograms(list);
        setForm((prev) => ({
          ...prev,
          programId: prev.programId || list[0]?.id || "",
        }));
      })
      .catch(() => {
        if (!ok) return;
        setMessage("Failed to load programs.");
      })
      .finally(() => {
        if (!ok) return;
        setLoadingPrograms(false);
      });

    return () => {
      ok = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.studentName.trim().length > 1 &&
      form.dateOfBirth.trim().length > 0 &&
      form.parentName.trim().length > 1 &&
      form.phoneNumber.trim().length >= 7 &&
      form.email.includes("@") &&
      form.programId.length > 0 &&
      form.address.trim().length > 4
    );
  }, [form]);

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="font-display text-2xl font-black text-zinc-900">Application Received!</h3>
        <p className="mt-4 text-zinc-600">
          Thank you for choosing Maanvi’s Preschool. We’ve sent a confirmation to your email. 
          Our team will contact you shortly.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-8 font-bold text-brand-pink hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setMessage(null);
        try {
          const res = await fetch("/api/admissions/apply", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(form),
          });
          if (!res.ok) throw new Error();
          setStatus("submitted");
        } catch (err) {
          setStatus("error");
          setMessage("Something went wrong. Please check your connection and try again.");
        }
      }}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Student Name</label>
            <input
              required
              placeholder="Full name of child"
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
              value={form.studentName}
              onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Date of Birth</label>
            <input
              required
              type="date"
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
              value={form.dateOfBirth}
              onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Age</label>
            <input
              required
              type="number"
              min={1}
              max={10}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
              value={form.age}
              onChange={(e) => setForm((p) => ({ ...p, age: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Program Interest</label>
            <select
              required
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
              value={form.programId}
              onChange={(e) => setForm((p) => ({ ...p, programId: e.target.value }))}
            >
              {loadingPrograms ? (
                <option>Loading programs...</option>
              ) : (
                programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Parent/Guardian Name</label>
          <input
            required
            placeholder="Full name"
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
            value={form.parentName}
            onChange={(e) => setForm((p) => ({ ...p, parentName: e.target.value }))}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Phone Number</label>
            <input
              required
              type="tel"
              placeholder="+91"
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
              value={form.phoneNumber}
              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Residential Address</label>
          <textarea
            required
            rows={3}
            placeholder="Current address in Kakinada"
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-pink focus:bg-white focus:ring-4 focus:ring-brand-pink/5"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          />
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${status === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {status === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          {message}
        </div>
      )}

      <button
        disabled={!canSubmit || status === "submitting"}
        className="group relative w-full overflow-hidden rounded-[2rem] bg-zinc-900 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:bg-brand-pink disabled:opacity-50 disabled:hover:bg-zinc-900"
        type="submit"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {status === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Submit Application <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </button>
    </form>
  );
}
