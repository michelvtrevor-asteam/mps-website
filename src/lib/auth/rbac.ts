import { UserRole } from "@prisma/client";

export const DashboardRoleAccess: Record<
  "admin" | "staff" | "parent",
  UserRole[]
> = {
  admin: [UserRole.ADMIN],
  staff: [UserRole.ADMIN, UserRole.STAFF],
  parent: [UserRole.ADMIN, UserRole.PARENT],
};

export function roleAllows(role: UserRole, allowed: UserRole[]) {
  return allowed.includes(role);
}

