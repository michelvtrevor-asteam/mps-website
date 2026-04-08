"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative  overflow-hidden bg-gradient-to-br from-pink-100 via-amber-50 to-sky-100">
      {/* Subtle floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-20 left-1/4 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <div className="relative flex  items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm border border-zinc-200">
              <span className="text-4xl">🌱</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Maanvi&apos;s Preschool
            </h1>
            <p className="mt-2 text-zinc-600">
              Sign in to your portal
            </p>
          </div>

          {/* Card */}
          <div className="rounded-[2rem] border border-zinc-200 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <details className="mb-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-zinc-800 hover:text-zinc-900 transition">
                📋 Demo credentials
              </summary>
              <div className="mt-3 space-y-2 text-xs text-zinc-600">
                <p>
                  <strong className="text-zinc-900">Admin:</strong> admin@maanvispreschool.local / Admin@12345
                </p>
                <p>
                  <strong className="text-zinc-900">Parent:</strong> parent@demo.local / Parent@12345
                </p>
              </div>
            </details>

            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setError(null);
                try {
                  const res = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                    callbackUrl,
                  });
                  setSubmitting(false);
                  if (res?.error) {
                    setError("Invalid email or password.");
                    return;
                  }
                  router.push(res?.url ?? callbackUrl);
                } catch (err) {
                  setSubmitting(false);
                  setError("An unexpected error occurred. Check your database connection.");
                }
              }}
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                disabled={submitting}
                className="w-full rounded-2xl bg-zinc-900 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-zinc-800 hover:shadow-xl disabled:opacity-60 disabled:hover:shadow-lg"
                type="submit"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-zinc-500">
              Admin, staff & parents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
