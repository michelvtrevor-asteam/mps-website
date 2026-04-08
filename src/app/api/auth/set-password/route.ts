import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { UserTokenType } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token, password } = parsed.data;

  const record = await prisma.userToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }
  if (record.type !== UserTokenType.PASSWORD_SETUP) {
    return NextResponse.json({ error: "Invalid token type." }, { status: 400 });
  }
  if (record.usedAt) {
    return NextResponse.json({ error: "Token already used." }, { status: 400 });
  }
  if (record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Token expired." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: await hashPassword(password) },
    }),
    prisma.userToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

