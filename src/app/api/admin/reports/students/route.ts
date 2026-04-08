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

  const format = new URL(req.url).searchParams.get("format") ?? "csv";
  if (format !== "csv")
    return NextResponse.json({ error: "Format not supported" }, { status: 400 });

  const students = await prisma.student.findMany({
    where: { isArchived: false },
    include: { program: true, parentProfile: { include: { user: true } } },
    orderBy: [{ program: { name: "asc" } }, { fullName: "asc" }],
    take: 2000,
  });

  const headers = [
    "Student Name",
    "DOB",
    "Age",
    "Program",
    "Parent Name",
    "Parent Email",
    "Parent Phone",
    "Address",
    "Admission Date",
  ];
  const rows = students.map((s) => [
    s.fullName,
    s.dateOfBirth.toISOString().slice(0, 10),
    s.age,
    s.program.name,
    s.parentProfile?.name ?? "",
    s.parentProfile?.user?.email ?? "",
    s.parentProfile?.phone ?? "",
    s.address,
    s.admissionDate.toISOString().slice(0, 10),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((val) => escapeCsv(String(val))).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=students.csv",
    },
  });
}
