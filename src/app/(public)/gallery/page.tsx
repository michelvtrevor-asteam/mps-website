import Link from "next/link";
import { prisma } from "@/lib/db";
import { Camera, Sparkles, Filter } from "lucide-react";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const categorySlug =
    typeof params?.category === "string" ? params.category : null;

  const categories = await prisma.galleryCategory.findMany({
    orderBy: { name: "asc" },
  });

  const photos = await prisma.galleryPhoto.findMany({
    where: {
      isPublic: true,
      ...(categorySlug
        ? { category: { slug: categorySlug } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 100,
  });

  return (
    <div className="relative overflow-hidden ">
      {/* Header Section */}
      <section className="bg-zinc-50 py-16 md:py-12 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-pink">
                <Camera className="h-3 w-3" /> Visual Journey
              </div>
              <h1 className="mt-8 font-display text-5xl font-black tracking-tight text-zinc-900 md:text-5xl">
                Moments of <span className="text-brand-pink">Joy.</span>
              </h1>
              <p className="mt-6 text-lg text-zinc-600">
                A glimpse into the vibrant daily life, learning, and celebrations at Maanvi’s Preschool.
              </p>
            </div>
            
            <div className="flex items-center gap-3 rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <Filter className="h-3 w-3" /> Filter
              </div>
              <div className="flex flex-wrap gap-1">
                <Link
                  href="/gallery"
                  className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                    !categorySlug
                      ? "bg-zinc-900 text-white shadow-lg"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  All
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/gallery?category=${c.slug}`}
                    className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                      categorySlug === c.slug
                        ? "bg-zinc-900 text-white shadow-lg"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-12 ">
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative mb-6 overflow-hidden rounded-[2rem] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-200/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.publicUrl}
                alt={p.caption ?? ""}
                className="w-full transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-pink px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  <Sparkles className="h-2.5 w-2.5" /> {p.category.name}
                </div>
                {p.caption && (
                  <p className="mt-3 text-sm font-bold text-white leading-snug">{p.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-zinc-50 py-16 md:py-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
              <Camera className="h-10 w-10 text-zinc-300" />
            </div>
            <h3 className="font-display text-2xl font-black text-zinc-900">No photos yet</h3>
            <p className="mt-2 text-zinc-500">We’re capturing moments, check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
