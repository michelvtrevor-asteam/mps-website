import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as UserRole | undefined;
  const email = session?.user?.email ?? undefined;
  return { session, id, role, email };
}

export async function requireRole(allowed: UserRole[]) {
  const { id, role } = await getSessionUser();
  if (!id || !role || !allowed.includes(role)) {
    return null;
  }
  return { id, role };
}

