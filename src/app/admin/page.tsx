import Link from "next/link";
import {
  UserPlus,
  Users,
  CreditCard,
  GraduationCap,
  Trophy,
  ImageIcon,
  BarChart,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { prisma } from "@/lib/db";

// Remove async from StatCard as it doesn't await anything
function StatCard({
  label,
  value,
  icon: Icon,
  color
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  // Ensure the color replacement is robust
  const iconColorClass = color.startsWith('bg-') ? color.replace('bg-', 'text-') : 'text-zinc-600';

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/50">
      {/* Animated background ornament */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150 ${color}`} />

      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} shadow-lg shadow-zinc-200/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}>
          {/* Explicitly set size and stroke width for visibility */}
          <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</div>
          <div className="font-display text-2xl font-black text-zinc-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default async function AdminHome() {
  const [studentsCount, admissionsCount, unpaidInvoices] = await Promise.all([
    prisma.student.count({ where: { isArchived: false } }),
    prisma.admissionApplication.count({ where: { status: "SUBMITTED" } }),
    prisma.invoice.count({ where: { status: "UNPAID" } }),
  ]);

  const cards = [
    {
      href: "/admin/admissions",
      label: "Admissions",
      desc: "Manage and approve incoming applications",
      icon: UserPlus,
      color: "bg-brand-pink",
    },
    {
      href: "/admin/students",
      label: "Student Hub",
      desc: "Comprehensive student records and profiles",
      icon: Users,
      color: "bg-brand-indigo",
    },
    {
      href: "/admin/fees",
      label: "Fees & Finance",
      desc: "Invoicing, payment tracking, and reminders",
      icon: CreditCard,
      color: "bg-emerald-500",
    },
    {
      href: "/admin/results",
      label: "Exam Results",
      desc: "Record academic performance and grades",
      icon: GraduationCap,
      color: "bg-brand-yellow",
    },
    {
      href: "/admin/leaderboards",
      label: "Leaderboards",
      desc: "Celebrate student excellence and streaks",
      icon: Trophy,
      color: "bg-brand-sky",
    },
    {
      href: "/admin/gallery",
      label: "Media Gallery",
      desc: "Showcase campus life and events",
      icon: ImageIcon,
      color: "bg-rose-500",
    },
    {
      href: "/admin/reports",
      label: "Analytics",
      desc: "Export data and performance reports",
      icon: BarChart,
      color: "bg-zinc-600",
    },
    {
      href: "/admin/notifications",
      label: "Communication",
      desc: "Mass announcements and auto-reminders",
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900 p-12 text-white shadow-2xl">
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl">
            Welcome Back, <span className="text-brand-pink">Admin.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-zinc-300">
            Everything is looking great today. You have {admissionsCount} submitted applications
            and {unpaidInvoices} unpaid invoices to review.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/admin/admissions"
              className="rounded-2xl bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-pink/20 transition-all hover:scale-105 hover:bg-brand-pink/90"
            >
              Review Admissions
            </Link>
            <Link
              href="/admin/notifications"
              className="rounded-2xl border border-zinc-700 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white"
            >
              Send Announcement
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-pink/10 blur-3xl" />
      </section>

      {/* Quick Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Students" value={studentsCount} icon={UserCheck} color="bg-brand-indigo" />
        <StatCard label="Pending Inquiries" value={admissionsCount} icon={TrendingUp} color="bg-brand-pink" />
        <StatCard label="Pending Fees" value={unpaidInvoices} icon={CreditCard} color="bg-orange-500" />
        <StatCard label="Growth Rate" value="+12%" icon={TrendingUp} color="bg-emerald-500" />
      </section>

      {/* Main Action Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const iconColorClass = c.color.startsWith('bg-') ? c.color.replace('bg-', 'text-') : 'text-zinc-600';

          return (
            <Link
              key={c.href}
              href={c.href}
              className="group relative rounded-[2.5rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${c.color} shadow-lg shadow-zinc-200/20 transition-transform duration-500 group-hover:rotate-12`}>
                <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-xl font-extrabold tracking-tight text-zinc-900 group-hover:text-zinc-950 transition-colors">{c.label}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{c.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-zinc-900 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                Launch module <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
