import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

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

  const payments = await prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: {
      invoice: {
        include: {
          student: true,
          program: true,
        },
      },
    },
    take: 5000,
  });

  const headers = ["Paid At", "Invoice #", "Student", "Program", "Amount (₹)", "Method", "Reference"];
  const rows = payments.map((p) => [
    p.paidAt.toISOString().slice(0, 19),
    p.invoice.invoiceNumber,
    p.invoice.student.fullName,
    p.invoice.program.name,
    formatPaise(p.amountPaise),
    p.method,
    p.reference ?? "",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((val) => escapeCsv(String(val))).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=fee-collection.csv",
    },
  });
}
