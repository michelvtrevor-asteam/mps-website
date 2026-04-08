import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const runtime = "nodejs";

function safeExt(name: string) {
  const ext = path.extname(name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return ext;
  return ".jpg";
}

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const categoryId = String(form.get("categoryId") ?? "");
  const caption = String(form.get("caption") ?? "").trim();
  const file = form.get("file");

  if (!categoryId || !(file instanceof File)) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const category = await prisma.galleryCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const ext = safeExt(file.name);
  const key = `${crypto.randomBytes(16).toString("hex")}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, key), buf);

  const publicUrl = `/uploads/${key}`;

  const photo = await prisma.galleryPhoto.create({
    data: {
      categoryId,
      caption: caption || undefined,
      storageKey: key,
      publicUrl,
      isPublic: true,
      uploadedById: auth.id,
    },
  });

  return NextResponse.json({ ok: true, photoId: photo.id, publicUrl });
}

