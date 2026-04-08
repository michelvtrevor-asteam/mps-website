"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Upload, Camera, ImageIcon, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Category = { id: string; name: string };

export function UploadForm({ categories }: { categories: Category[] }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file || !categoryId) return;
    setStatus("uploading");
    toast("Uploading photo...", "loading");

    try {
      const fd = new FormData();
      fd.set("categoryId", categoryId);
      fd.set("caption", caption);
      fd.set("file", file);

      const res = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("Upload failed.");
      }

      toast("Photo uploaded successfully!", "success");
      setStatus("done");
      setFile(null);
      setCaption("");
      // Force refresh data
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast("Failed to upload photo. Please try again.", "error");
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Category</label>
          <select
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100 outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Context / Caption</label>
          <input
            placeholder="Describe this moment..."
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100 outline-none"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Media Source</label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className={`flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-10 transition-all ${
              file ? "border-emerald-500 bg-emerald-50/30" : "border-zinc-200 bg-zinc-50 group-hover:border-brand-sky group-hover:bg-brand-sky/5"
            }`}>
              {file ? (
                <>
                  <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-500 animate-bounce" />
                  <p className="text-sm font-bold text-emerald-600">{file.name}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500"
                  >
                    Change selection
                  </button>
                </>
              ) : (
                <>
                  <Upload className="mb-3 h-8 w-8 text-zinc-300 transition-transform group-hover:-translate-y-1 group-hover:text-brand-sky" />
                  <p className="text-sm font-bold text-zinc-400">Click or drag image to upload</p>
                  <p className="mt-1 text-[10px] font-medium text-zinc-300 uppercase tracking-widest">Max 5MB • JPG, PNG, WEBP</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        className="group relative w-full overflow-hidden rounded-2xl bg-zinc-900 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-brand-sky active:scale-95 disabled:opacity-50"
        disabled={!file || !categoryId || status === "uploading"}
        onClick={handleUpload}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {status === "uploading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing Media
            </>
          ) : (
            <>
              Confirm Upload <Camera className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </>
          )}
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </button>
    </div>
  );
}
