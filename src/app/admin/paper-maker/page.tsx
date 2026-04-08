import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { 
  FileText, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  Zap,
  CheckCircle,
  FileDigit,
  Download,
  PenTool
} from "lucide-react";
import Link from "next/link";
import { Creator } from "./Creator";

export default async function PaperMakerPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return <div className="p-8">Unauthorized</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-brand-pink ring-1 ring-inset ring-brand-pink/20">
            <PenTool className="h-3.5 w-3.5" /> Manual Paper Creator
          </div>
          <h1 className="font-display text-5xl font-black tracking-tight text-zinc-900">
            Smart <span className="text-brand-pink">Paper Builder</span>
          </h1>
          <p className="max-w-md text-sm font-medium leading-relaxed text-zinc-500">
            Create professional, print-ready question papers for your preschool students with a few clicks.
          </p>
        </div>
        
        <Link
          href="/admin"
          className="group flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-6 py-4 text-xs font-black text-zinc-600 shadow-sm transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Dashboard
        </Link>
      </div>

      <div className="space-y-12">
        <Creator />
      </div>
    </div>
  );
}
