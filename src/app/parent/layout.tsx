"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  CalendarCheck, 
  Receipt, 
  Trophy, 
  Bell, 
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";

const links = [
  { href: "/parent", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/parent/profile", label: "Student Profile", icon: UserCircle },
  { href: "/parent/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/parent/fees", label: "Fees & Invoices", icon: Receipt },
  { href: "/parent/results", label: "Academic Results", icon: Trophy },
  { href: "/parent/notifications", label: "Notifications", icon: Bell },
];

export default function ParentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className=" bg-zinc-50 font-display">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/80 px-8 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <Link href="/parent" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-pink shadow-lg shadow-brand-pink/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="block text-base font-black tracking-tight text-zinc-900">Parent Portal</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Maanvi’s Preschool</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Website</span>
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-500 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-8 py-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar Nav */}
        <aside className="hidden lg:block">
          <nav className="sticky top-32 space-y-1.5">
            <div className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Menu
            </div>
            {links.map((l) => {
              const Icon = l.icon;
              const isActive = l.exact ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-bold tracking-tight transition-all duration-300 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20"
                      : "text-zinc-500 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-brand-pink" : "text-zinc-400 group-hover:text-zinc-900"}`} />
                    {l.label}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Nav (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden no-scrollbar">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold tracking-tight transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                    : "bg-white text-zinc-500 border border-zinc-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-brand-pink" : "text-zinc-400"}`} />
                {l.label}
              </Link>
            );
          })}
        </div>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
