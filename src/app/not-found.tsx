import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-zinc-100 text-brand-pink shadow-xl">
        <Sparkles className="h-10 w-10" />
      </div>
      <h1 className="font-display text-5xl font-black tracking-tight text-zinc-900">404</h1>
      <p className="mt-4 text-lg font-medium text-zinc-500">Oops! This page has wandered off to play.</p>
      <Link
        href="/"
        className="mt-8 flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:bg-brand-pink"
      >
        <ArrowLeft className="h-5 w-5" /> Back Home
      </Link>
    </div>
  );
}
