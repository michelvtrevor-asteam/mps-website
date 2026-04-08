import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  AlertCircle,
  ChevronRight,
  PieChart
} from "lucide-react";

export default async function AdminReportsPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const reports = [
    {
      title: "Student List",
      desc: "Full database of active students and parent links.",
      href: "/api/admin/reports/students?format=csv",
      icon: Users,
      color: "text-brand-indigo",
      bg: "bg-brand-indigo/10"
    },
    {
      title: "Attendance Report",
      desc: "Monthly logs and percentage calculations.",
      href: "/api/admin/reports/attendance?format=csv",
      icon: CalendarCheck,
      color: "text-brand-pink",
      bg: "bg-brand-pink/10"
    },
    {
      title: "Fee Collection",
      desc: "History of all paid invoices and revenue.",
      href: "/api/admin/reports/fee-collection?format=csv",
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Pending Fees",
      desc: "List of students with unpaid or overdue invoices.",
      href: "/api/admin/reports/pending-fees?format=csv",
      icon: AlertCircle,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <PieChart className="h-3 w-3" /> Analytics Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Data & <span className="text-zinc-500">Reports</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Export school data into CSV format for offline analysis.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((r) => (
          <a
            key={r.title}
            href={r.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
          >
            <div className="relative z-10">
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${r.bg} ${r.color} transition-transform duration-500 group-hover:rotate-12`}>
                <r.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-zinc-900">{r.title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500">{r.desc}</p>
            </div>

            <div className="relative z-10 mt-10 flex items-center justify-between border-t border-zinc-100 pt-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">CSV Export</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform group-hover:scale-110">
                <Download className="h-4 w-4" />
              </div>
            </div>
            
            <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-150 ${r.bg.replace('/10', '')}`} />
          </a>
        ))}
      </div>

      {/* Helper Note */}
      <div className="rounded-[2rem] bg-zinc-900 p-10 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-pink">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Custom Report Request?</h3>
            <p className="mt-1 text-sm text-zinc-400">Need data in a different format? Contact the technical support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
