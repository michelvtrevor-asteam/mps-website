import { prisma } from "@/lib/db";

export async function auditLog(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: any;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata ?? undefined,
    },
  });
}

