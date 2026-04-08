"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { InvoiceStatus, PaymentMethod, UserRole } from "@prisma/client";
import { generateInvoiceNumber } from "@/lib/fees/invoiceNumber";
import { auditLog } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const studentId = String(formData.get("studentId") ?? "");
  const amountRupees = Number(formData.get("amountRupees") ?? 0);
  const dueDateStr = String(formData.get("dueDate") ?? "");

  const dueDate = new Date(`${dueDateStr}T00:00:00.000Z`);
  if (!studentId || !Number.isFinite(amountRupees) || amountRupees <= 0) {
    throw new Error("Invalid input");
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, programId: true },
  });
  if (!student) throw new Error("Student not found");

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      status: InvoiceStatus.UNPAID,
      studentId,
      programId: student.programId,
      amountPaise: Math.round(amountRupees * 100),
      dueDate,
      createdById: adminId,
    },
  });

  await auditLog({
    actorId: adminId,
    action: "invoice.create",
    entityType: "Invoice",
    entityId: invoice.id,
    metadata: { studentId, amountRupees, dueDate: dueDateStr },
  });

  revalidatePath("/admin/fees");
  redirect(`/admin/fees/${invoice.id}`);
}

export async function recordPayment(invoiceId: string, fd: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const amountRupees = Number(fd.get("amountRupees") ?? 0);
  const method = String(fd.get("method") ?? "CASH") as PaymentMethod;
  const reference = String(fd.get("reference") ?? "").trim();
  if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
    throw new Error("Invalid amount");
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!invoice) throw new Error("Invoice not found");

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amountPaise: Math.round(amountRupees * 100),
      method,
      reference: reference || undefined,
      recordedById: adminId,
    },
  });

  const totalPaid =
    invoice.payments.reduce((sum, p) => sum + p.amountPaise, 0) + payment.amountPaise;

  const newStatus =
    totalPaid >= invoice.amountPaise
      ? InvoiceStatus.PAID
      : totalPaid > 0
        ? InvoiceStatus.PARTIAL
        : InvoiceStatus.UNPAID;

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: newStatus },
  });

  await auditLog({
    actorId: adminId,
    action: "payment.record",
    entityType: "Invoice",
    entityId: invoiceId,
    metadata: { amountRupees, method },
  });

  revalidatePath(`/admin/fees/${invoiceId}`);
}

export async function bulkMarkAsPaid(ids: string[]) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;

  for (const id of ids) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!invoice || invoice.status === InvoiceStatus.PAID) continue;

    const remainingPaise =
      invoice.amountPaise - invoice.payments.reduce((sum, p) => sum + p.amountPaise, 0);

    if (remainingPaise <= 0) {
      await prisma.invoice.update({
        where: { id },
        data: { status: InvoiceStatus.PAID },
      });
      continue;
    }

    await prisma.payment.create({
      data: {
        invoiceId: id,
        amountPaise: remainingPaise,
        method: PaymentMethod.CASH,
        reference: "Bulk Update",
        recordedById: adminId,
      },
    });

    await prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.PAID },
    });

    await auditLog({
      actorId: adminId,
      action: "payment.bulk_paid",
      entityType: "Invoice",
      entityId: id,
      metadata: { amountPaise: remainingPaise },
    });
  }

  revalidatePath("/admin/fees");
}
