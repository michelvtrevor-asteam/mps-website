"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auditLog } from "@/lib/audit";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(fd: FormData) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) throw new Error("Unauthorized");

  const adminId = auth.id;
  const name = String(fd.get("name") ?? "").trim();
  if (!name) throw new Error("Name required");
  const slug = slugify(name);
  const c = await prisma.galleryCategory.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
  await auditLog({
    actorId: adminId,
    action: "gallery.category.upsert",
    entityType: "GalleryCategory",
    entityId: c.id,
    metadata: { slug },
  });
  revalidatePath("/admin/gallery");
}
