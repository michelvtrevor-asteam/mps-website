import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { UserRole } from "@prisma/client";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  const role = (session.user as { role?: UserRole }).role;
  if (role === UserRole.ADMIN) redirect("/admin");
  if (role === UserRole.STAFF) redirect("/staff");
  if (role === UserRole.PARENT) redirect("/parent");
  redirect("/");
}
