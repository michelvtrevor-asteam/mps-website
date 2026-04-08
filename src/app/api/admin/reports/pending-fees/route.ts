import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { InvoiceStatus, UserRole } from "@prisma/client";

function escapeCsv(val: string) {
  if (/[,"\n]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

function formatPaise(paise: number) {
  return (paise / 100).toFixed(2);
}

export async function GET(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const format = new URL(req.url).searchParams.get("format") ?? "csv";
  if (format !== "csv")
    return NextResponse.json({ error: "Format not supported" }, { status: 400 });

  const invoices = await prisma.invoice.findMany({
    where: {
      isArchived: false,
      status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIAL, InvoiceStatus.OVERDUE] },
    },
    include: {
      student: { include: { parentProfile: { include: { user: true } } } },
      program: true,
      payments: true,
    },
    orderBy: { dueDate: "asc" },
    take: 2000,
  });

  const rows = invoices.map((i) => {
    const paid = i.payments.reduce((s, p) => s + p.amountPaise, 0);
    const pending = Math.max(0, i.amountPaise - paid);
    return [
      i.invoiceNumber,
      i.student.fullName,
      i.program.name,
      i.student.parentProfile?.user?.email ?? "",
      i.student.parentProfile?.phone ?? "",
      formatPaise(i.amountPaise),
      formatPaise(paid),
      formatPaise(pending),
      i.dueDate.toISOString().slice(0, 10),
      i.status,
    ];
  });

  const headers = [
    "Invoice #",
    "Student",
    "Program",
    "Parent Email",
    "Parent Phone",
    "Amount (₹)",
    "Paid (₹)",
    "Pending (₹)",
    "Due Date",
    "Status",
  ];
  const csv = [headers.join(","), ...rows.map((r) => r.map((val) => escapeCsv(String(val))).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=pending-fees.csv",
    },
  });
}
