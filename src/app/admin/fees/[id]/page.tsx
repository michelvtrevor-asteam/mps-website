import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { InvoiceStatus, UserRole } from "@prisma/client";
import { PaymentForm } from "./PaymentForm";

function formatINR(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="p-8">
        <p className="text-sm text-zinc-600">Unauthorized.</p>
      </div>
    );
  }

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      student: { include: { parentProfile: { include: { user: true } } } },
      program: true,
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
  if (!invoice) {
    return (
      <div className="p-8">
        <p className="text-sm text-zinc-600">Invoice not found.</p>
      </div>
    );
  }

  const paidTotal = invoice.payments.reduce((sum, p) => sum + p.amountPaise, 0);
  const pending = Math.max(0, invoice.amountPaise - paidTotal);
  const now = Date.now();
  const computedStatus =
    invoice.status !== InvoiceStatus.PAID && invoice.dueDate.getTime() < now
      ? InvoiceStatus.OVERDUE
      : invoice.status;

  return (
    <div className="p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Invoice</h1>
          <p className="mt-1 text-sm text-zinc-600">{invoice.invoiceNumber}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/fees"
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Back
          </Link>
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Download PDF
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Student</div>
              <div className="font-medium text-zinc-900">
                {invoice.student.fullName}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Program</div>
              <div className="font-medium text-zinc-900">{invoice.program.name}</div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Parent email</div>
              <div className="font-medium text-zinc-900">
                {invoice.student.parentProfile.user.email}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Amount</div>
              <div className="font-medium text-zinc-900">{formatINR(invoice.amountPaise)}</div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Paid</div>
              <div className="font-medium text-zinc-900">{formatINR(paidTotal)}</div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Pending</div>
              <div className="font-medium text-zinc-900">{formatINR(pending)}</div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Due</div>
              <div className="font-medium text-zinc-900">
                {invoice.dueDate.toISOString().slice(0, 10)}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="text-zinc-600">Status</div>
              <div className="font-medium text-zinc-900">{computedStatus}</div>
            </div>
          </div>
        </div>

        <PaymentForm invoiceId={invoice.id} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
          <div className="col-span-4">Paid at</div>
          <div className="col-span-3">Amount</div>
          <div className="col-span-3">Method</div>
          <div className="col-span-2">Reference</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {invoice.payments.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
              <div className="col-span-4 text-zinc-700">
                {p.paidAt.toISOString().replace("T", " ").slice(0, 16)}
              </div>
              <div className="col-span-3 text-zinc-700">{formatINR(p.amountPaise)}</div>
              <div className="col-span-3 text-zinc-700">{p.method}</div>
              <div className="col-span-2 text-zinc-600">{p.reference ?? "-"}</div>
            </div>
          ))}
          {invoice.payments.length === 0 ? (
            <div className="px-4 py-10 text-sm text-zinc-600">No payments yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

