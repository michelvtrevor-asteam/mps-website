import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/security/tokens";
import { UserTokenType } from "@prisma/client";

export async function createPasswordSetupToken(userId: string) {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);

  const record = await prisma.userToken.create({
    data: { userId, token, type: UserTokenType.PASSWORD_SETUP, expiresAt },
  });

  return record.token;
}

