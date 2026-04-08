import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

function escapeCsv(val: string) {
  if (/[,"\n]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

export async function GET(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "csv";
  const fromStr = url.searchParams.get("from") ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const toStr = url.searchParams.get("to") ?? new Date().toISOString().slice(0, 10);

  if (format !== "csv")
    return NextResponse.json({ error: "Format not supported" }, { status: 400 });

  const from = new Date(`${fromStr}T00:00:00.000Z`);
  const to = new Date(`${toStr}T23:59:59.999Z`);

  const records = await prisma.attendance.findMany({
    where: { date: { gte: from, lte: to } },
    include: { student: { include: { program: true } } },
    orderBy: [{ date: "desc" }, { student: { fullName: "asc" } }],
    take: 5000,
  });

  const headers = ["Date", "Student", "Program", "Status", "Remark"];
  const rows = records.map((r) => [
    r.date.toISOString().slice(0, 10),
    r.student.fullName,
    r.student.program.name,
    r.status,
    r.remark ?? "",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((val) => escapeCsv(String(val))).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=attendance.csv",
    },
  });
}
