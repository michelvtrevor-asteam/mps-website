"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogOut, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export function SignOutForm() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    handleSignOut();
  }, []);

  return (
    <div className="relative  overflow-hidden bg-gradient-to-br from-pink-50 via-white to-sky-50">
      {/* Background Shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-pink/5 blur-3xl animate-pulse" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-brand-sky/5 blur-3xl" />
      </div>

      <div className="relative flex  items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white shadow-2xl shadow-zinc-200/50 transition-transform hover:rotate-12">
              <LogOut className="h-10 w-10 text-brand-pink" />
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
              See You <span className="text-brand-pink">Soon!</span>
            </h1>
            <p className="mt-4 text-lg font-medium text-zinc-500 leading-relaxed">
              Are you sure you want to sign out of your portal?
            </p>
          </div>

          <div className="rounded-[3rem] border border-zinc-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="space-y-4">
              <button
                disabled={loading}
                onClick={handleSignOut}
                className="group relative w-full overflow-hidden rounded-[2rem] bg-zinc-900 py-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-brand-pink disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Signing out...
                    </>
                  ) : (
                    <>
                      Sign Out Now <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </button>

              <Link
                href="/admin"
                className="flex w-full items-center justify-center gap-2 rounded-[2rem] border-2 border-zinc-100 bg-white py-4 text-base font-bold text-zinc-600 transition-all hover:border-zinc-900 hover:text-zinc-900"
              >
                <ArrowLeft className="h-5 w-5" /> Keep me signed in
              </Link>
            </div>

            <div className="mt-10 border-t border-zinc-100 pt-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Sparkles className="h-3 w-3 text-brand-pink" />
                Maanvi&apos;s Preschool Excellence
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
