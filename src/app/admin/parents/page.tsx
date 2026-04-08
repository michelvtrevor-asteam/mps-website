import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { NewParentForm } from "./NewParentForm";
import { ParentListItem } from "./ParentListItem";
import { 
  ArrowLeft, 
  Search, 
  ShieldCheck,
  Users
} from "lucide-react";

export default async function AdminParentsPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) return <div className="p-8">Unauthorized</div>;

  const parents = await prisma.parentProfile.findMany({
    include: {
      user: true,
      students: {
        include: { program: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const allStudents = await prisma.student.findMany({
    where: { isArchived: false },
    include: { program: true },
    orderBy: { fullName: "asc" }
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-pink">
            <ShieldCheck className="h-3 w-3" /> User Access Control
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Parent <span className="text-brand-pink">Management</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Managing credentials and access for {parents.length} sets of parents.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <NewParentForm />
        </div>

        {/* Parent List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-zinc-900">Active Parent Accounts</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input 
                  placeholder="Search parents..." 
                  className="rounded-xl bg-zinc-50 py-2 pl-10 pr-4 text-xs font-bold outline-none ring-zinc-100 focus:ring-4"
                />
              </div>
            </div>

            <div className="space-y-4">
              {parents.map((p) => (
                <ParentListItem 
                  key={p.id} 
                  parent={p as any} 
                  allStudents={allStudents as any}
                />
              ))}

              {parents.length === 0 && (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-zinc-900">No parent accounts yet</h3>
                  <p className="mt-1 text-sm text-zinc-500">Add parents manually or register students to see them here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
