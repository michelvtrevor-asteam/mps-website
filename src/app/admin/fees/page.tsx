import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { InvoiceStatus, UserRole } from "@prisma/client";
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Calendar,
  User
} from "lucide-react";

function formatINR(paise: number) {
  const rupees = (paise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
  return rupees;
}

import { SearchInput } from "@/components/ui/SearchInput";

import { FeesTable } from "./FeesTable";

export default async function AdminFeesPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await props.searchParams;

  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      isArchived: false,
      OR: search
        ? [
            { invoiceNumber: { contains: search } },
            { student: { fullName: { contains: search } } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: { student: true, program: true },
    take: 200,
  });

  const now = Date.now();
  const normalized = invoices.map((i) => {
    const overdue = i.status !== InvoiceStatus.PAID && i.dueDate.getTime() < now;
    return { ...i, computedStatus: overdue ? InvoiceStatus.OVERDUE : i.status };
  });

  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.status === 'PAID' ? curr.amountPaise : 0), 0);
  const pendingRevenue = invoices.reduce((acc, curr) => acc + (curr.status !== 'PAID' ? curr.amountPaise : 0), 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            <Receipt className="h-3 w-3" /> Finance Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Fees & <span className="text-emerald-500">Invoices</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Tracking {invoices.length} invoices and collections.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search invoice or student..." className="w-64" />
          <Link
            href="/admin/fees/new"
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" /> Create Invoice
          </Link>
        </div>
      </div>

      {/* Finance Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Collected", value: formatINR(totalRevenue), color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
          { label: "Pending", value: formatINR(pendingRevenue), color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
          { label: "Overdue", value: normalized.filter(i => i.computedStatus === 'OVERDUE').length, color: "text-rose-600", bg: "bg-rose-50", icon: AlertCircle },
          { label: "Growth", value: "+8.4%", color: "text-brand-indigo", bg: "bg-brand-indigo/5", icon: CreditCard },
        ].map((stat) => (
          <div key={stat.label} className={`flex flex-col justify-between rounded-2xl border border-zinc-100 ${stat.bg} p-6`}>
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
              <div className={`mt-1 font-display text-xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice List */}
      <FeesTable invoices={normalized} />
    </div>
  );
}
