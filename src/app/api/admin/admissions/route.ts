import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

export async function GET() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = await prisma.admissionApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { program: { select: { name: true } } },
    take: 200,
  });

  return NextResponse.json({ applications });
}

