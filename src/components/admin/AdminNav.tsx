"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CreditCard,
  GraduationCap,
  Trophy,
  ImageIcon,
  BarChart,
  MessageSquare,
  LogOut,
  ChevronRight,
  ShieldCheck,
  FileText
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/admissions", label: "Admissions", icon: UserPlus },
  { href: "/admin/students", label: "Student Hub", icon: Users },
  { href: "/admin/parents", label: "Parent Hub", icon: ShieldCheck },
  { href: "/admin/paper-maker", label: "Paper Maker", icon: FileText },
  { href: "/admin/fees", label: "Finance & Fees", icon: CreditCard },
  { href: "/admin/results", label: "Exam Results", icon: GraduationCap },
  { href: "/admin/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/admin/gallery", label: "Media Gallery", icon: ImageIcon },
  { href: "/admin/reports", label: "Reports", icon: BarChart },
  { href: "/admin/notifications", label: "Communication", icon: MessageSquare },
];

export function AdminNav({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col justify-between">
      <nav className="space-y-1.5 overflow-y-auto p-4">
        <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold tracking-tight transition-all duration-300 ${isActive
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-brand-pink" : "text-zinc-400 group-hover:text-zinc-900"}`}
                />
                {item.label}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 p-4">
        <div className="rounded-2xl bg-zinc-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-zinc-900">Administrator</p>
              <p className="truncate text-[10px] text-zinc-500">{email}</p>
            </div>
          </div>
          <Link
            href="/signout"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 py-2 text-xs font-bold text-zinc-600 transition-all hover:bg-red-50 hover:border-red-100 hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
