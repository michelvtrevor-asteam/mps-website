import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { UploadForm } from "@/app/admin/gallery/UploadForm";
import { CategoryForm } from "./GalleryForms";
import { 
  Image as ImageIcon, 
  Plus, 
  Camera, 
  FolderHeart, 
  Sparkles,
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";

export default async function AdminGalleryPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const categories = await prisma.galleryCategory.findMany({
    orderBy: { name: "asc" },
  });

  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 60,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-600">
            <ImageIcon className="h-3 w-3" /> Media Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Visual <span className="text-rose-500">Gallery</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Showcasing {photos.length} moments of joy across {categories.length} categories.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      {/* Action Area: Upload & Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
              <FolderHeart className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-zinc-900">Manage Categories</h2>
          </div>
          <CategoryForm categories={categories} />
        </div>

        <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sky/10 text-brand-sky">
              <Camera className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-zinc-900">Upload New Photo</h2>
          </div>
          <UploadForm categories={categories} />
        </div>
      </div>

      {/* Photo Grid */}
      <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-zinc-900 flex items-center gap-2">
            Recent Uploads <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100">
              <Filter className="h-3 w-3" /> All Categories
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.publicUrl}
                alt={p.caption ?? ""}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="inline-flex rounded-full bg-rose-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white mb-1.5">
                  {p.category.name}
                </div>
                <p className="truncate text-[10px] font-bold text-white leading-tight">{p.caption || "Untilted Moment"}</p>
              </div>
            </div>
          ))}

          {photos.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">Gallery is empty</h3>
              <p className="mt-1 text-sm text-zinc-500">Upload your first campus photo to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
