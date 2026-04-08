import { prisma } from "@/lib/db";
import { admissionApplySchema } from "@/lib/validation/admissions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const parsed = admissionApplySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const program = await prisma.program.findUnique({
    where: { id: data.programId },
    select: { id: true },
  });
  if (!program) {
    return NextResponse.json({ error: "Invalid program." }, { status: 400 });
  }

  const dob = new Date(data.dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return NextResponse.json({ error: "Invalid date of birth." }, { status: 400 });
  }

  const application = await prisma.admissionApplication.create({
    data: {
      studentName: data.studentName,
      dateOfBirth: dob,
      age: data.age,
      parentName: data.parentName,
      phoneNumber: data.phoneNumber,
      email: data.email.toLowerCase(),
      address: data.address,
      programId: program.id,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, applicationId: application.id });
}

