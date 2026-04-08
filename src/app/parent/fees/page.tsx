import { getParentContext } from "@/lib/parent/context";
import { prisma } from "@/lib/db";
import { InvoiceStatus } from "@prisma/client";
import { 
  Receipt, 
  ArrowLeft, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";

function formatINR(paise: number) {
  return (paise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
}

export default async function ParentFeesPage() {
  const ctx = await getParentContext();
  
  if (!ctx) {
    return (
      <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-8 text-red-800 shadow-sm">
        <h2 className="font-display text-xl font-bold">Profile Not Found</h2>
        <p className="mt-2 text-sm opacity-80">Please contact administration.</p>
      </div>
    );
  }

  const studentIds = ctx.parentProfile.students.map((s) => s.id);
  const invoices = await prisma.invoice.findMany({
    where: { studentId: { in: studentIds }, isArchived: false },
    orderBy: { createdAt: "desc" },
    include: { student: true, program: true },
    take: 200,
  });

  const now = Date.now();
  const normalized = invoices.map((i) => {
    const overdue = i.status !== InvoiceStatus.PAID && i.dueDate.getTime() < now;
    return { ...i, computedStatus: overdue ? InvoiceStatus.OVERDUE : i.status };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-pink">
            <Receipt className="h-3 w-3" /> Finance Portal
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Fees & <span className="text-brand-pink">Invoices</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            View and download digital invoices for your children.
          </p>
        </div>
        
        <Link
          href="/parent"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Invoice List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-4">Invoice Details</div>
          <div className="col-span-4">Student & Program</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {normalized.map((i) => (
            <div key={i.id} className="group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-all hover:bg-zinc-50/50">
              <div className="col-span-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 group-hover:bg-brand-pink group-hover:text-white transition-all">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-zinc-900">{i.invoiceNumber}</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      <Calendar className="h-3 w-3" /> Due: {i.dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                </div>
                <a
                  href={`/api/invoices/${i.id}/pdf`}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-brand-pink hover:shadow-brand-pink/30 active:scale-95"
                >
                  <Download className="h-3 w-3" /> Download PDF
                </a>
              </div>

              <div className="col-span-4 space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                  <User className="h-3 w-3 text-zinc-400" /> {i.student.fullName}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{i.program.name}</div>
              </div>

              <div className="col-span-2 font-display font-black text-zinc-900">
                {formatINR(i.amountPaise)}
              </div>

              <div className="col-span-2 flex justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    i.computedStatus === "PAID"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : i.computedStatus === "OVERDUE"
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    i.computedStatus === "PAID" ? "bg-emerald-500" : i.computedStatus === "OVERDUE" ? "bg-rose-500" : "bg-amber-500"
                  }`} />
                  {i.computedStatus}
                </span>
              </div>
            </div>
          ))}

          {normalized.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No invoices yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Invoices will appear here when they are generated by the school.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
