import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { generateInvoicePdf } from "@/lib/pdf/invoicePdf";

function formatINR(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { id: userId, role } = await getSessionUser();
  if (!userId || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      student: { include: { parentProfile: true } },
      program: true,
    },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = role === UserRole.ADMIN;
  const isParentOwner =
    role === UserRole.PARENT && invoice.student.parentProfile.userId === userId;

  if (!isAdmin && !isParentOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pdfBytes = await generateInvoicePdf({
    invoiceNumber: invoice.invoiceNumber,
    studentName: invoice.student.fullName,
    programName: invoice.program.name,
    amountRupees: formatINR(invoice.amountPaise),
    dueDate: invoice.dueDate.toISOString().slice(0, 10),
    status: invoice.status,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}

