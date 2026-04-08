import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

export async function getParentContext() {
  const { id: userId, role, email } = await getSessionUser();
  if (!userId || role !== UserRole.PARENT) return null;

  const parentProfile = await prisma.parentProfile.findUnique({
    where: { userId },
    include: {
      students: {
        where: { isArchived: false },
        include: { 
          program: true,
          attendance: {
            orderBy: { date: "desc" },
            take: 30, // Last 30 days for stats
          },
          invoices: {
            where: { isArchived: false },
            orderBy: { dueDate: "asc" },
          }
        },
        orderBy: { fullName: "asc" },
      },
    },
  });
  if (!parentProfile) return null;

  return { userId, email, parentProfile };
}

