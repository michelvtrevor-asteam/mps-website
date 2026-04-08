"use client";

import { useState } from "react";

export function SetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className=" bg-zinc-50">
      <div className="mx-auto flex  max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">Set password</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Create a password to access the parent portal.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setMessage(null);
              if (!token) {
                setStatus("error");
                setMessage("Missing token.");
                return;
              }
              if (password.length < 8) {
                setStatus("error");
                setMessage("Password must be at least 8 characters.");
                return;
              }
              if (password !== confirm) {
                setStatus("error");
                setMessage("Passwords do not match.");
                return;
              }

              setStatus("saving");
              const res = await fetch("/api/auth/set-password", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ token, password }),
              });
              if (!res.ok) {
                const data = (await res.json().catch(() => null)) as
                  | { error?: string }
                  | null;
                setStatus("error");
                setMessage(data?.error ?? "Failed to set password.");
                return;
              }
              setStatus("done");
              setMessage("Password set successfully. You can now sign in.");
            }}
          >
            <div>
              <label className="text-sm font-medium text-zinc-800">
                New password
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-400"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800">
                Confirm password
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-400"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {message ? (
              <div
                className={`rounded-xl border px-3 py-2 text-sm ${
                  status === "done"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : status === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700"
                }`}
              >
                {message}
              </div>
            ) : null}

            <button
              disabled={status === "saving"}
              className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              type="submit"
            >
              {status === "saving" ? "Saving..." : "Set password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

