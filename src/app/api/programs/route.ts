import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const programs = await prisma.program.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return NextResponse.json({ programs });
}

