import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { InvoiceForm } from "./InvoiceForm";
import { Receipt, Plus, ArrowLeft } from "lucide-react";

export default async function NewInvoicePage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const students = await prisma.student.findMany({
    where: { isArchived: false },
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true },
  });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            <Receipt className="h-3 w-3" /> Finance Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Create <span className="text-emerald-500">Invoice</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Generate a new digital fee invoice for a student.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/fees"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Link>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Plus className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-zinc-900">Invoice Details</h2>
        </div>
        <InvoiceForm students={students} today={today} />
      </div>
    </div>
  );
}
