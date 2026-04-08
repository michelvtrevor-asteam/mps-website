"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, User, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { BulkActions } from "./BulkActions";

type Invoice = {
  id: string;
  invoiceNumber: string;
  amountPaise: number;
  dueDate: Date;
  status: string;
  computedStatus: string;
  student: { fullName: string };
  program: { name: string };
};

function formatINR(paise: number) {
  const rupees = (paise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
  return rupees;
}

export function FeesTable({ invoices }: { invoices: Invoice[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map((i) => i.id));
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-1 flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.length === invoices.length && invoices.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <div className="col-span-3">Invoice Details</div>
          <div className="col-span-3">Student & Program</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {invoices.map((i) => (
            <div
              key={i.id}
              className={`group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-all hover:bg-zinc-50/50 ${selectedIds.includes(i.id) ? 'bg-emerald-50/30' : ''}`}
            >
              <div className="col-span-1 flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(i.id)}
                  onChange={() => toggleSelect(i.id)}
                  className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              
              <Link
                href={`/admin/fees/${i.id}`}
                className="col-span-3 flex items-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display font-bold text-zinc-900">{i.invoiceNumber}</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Digital Invoice</div>
                </div>
              </Link>

              <div className="col-span-3 space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                  <User className="h-3 w-3 text-zinc-400" /> {i.student.fullName}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{i.program.name}</div>
              </div>

              <div className="col-span-2 font-display font-black text-zinc-900">
                {formatINR(i.amountPaise)}
              </div>

              <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-zinc-500">
                <Calendar className="h-3 w-3" />
                {new Date(i.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>

              <div className="col-span-1 flex justify-end">
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

          {invoices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <Receipt className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No invoices yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Start by creating your first fee invoice for a student.</p>
              <Link href="/admin/fees/new" className="mt-6 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600">
                Create Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <BulkActions
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
      />
    </>
  );
}
