import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { AdmissionActions } from "./AdmissionActions";
import { 
  UserPlus, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Search,
  ChevronRight
} from "lucide-react";

export default async function AdminAdmissionsPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const applications = await prisma.admissionApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { program: true },
    take: 200,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-pink">
            <UserPlus className="h-3 w-3" /> Admissions Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Review <span className="text-brand-pink">Applications</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            {applications.length} total inquiries waiting for review.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input 
              placeholder="Search applications..." 
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs font-medium outline-none transition-all focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5"
            />
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Submitted", count: applications.filter(a => a.status === 'SUBMITTED').length, color: "text-brand-pink", bg: "bg-brand-pink/5", icon: Clock },
          { label: "Approved", count: applications.filter(a => a.status === 'APPROVED').length, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
          { label: "Rejected", count: applications.filter(a => a.status === 'REJECTED').length, color: "text-rose-600", bg: "bg-rose-50", icon: XCircle },
        ].map((stat) => (
          <div key={stat.label} className={`flex items-center justify-between rounded-2xl border border-zinc-100 ${stat.bg} p-4`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
            </div>
            <div className={`font-display text-xl font-black ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-4">Student & Program</div>
          <div className="col-span-4">Parent Details</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Action Hub</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {applications.map((a) => (
            <div
              key={a.id}
              className="group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-colors hover:bg-zinc-50/50"
            >
              {/* Student Info */}
              <div className="col-span-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-pink/10 font-display text-lg font-black text-brand-pink">
                  {a.studentName.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-zinc-900 group-hover:text-brand-pink transition-colors">
                    {a.studentName}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs font-bold text-zinc-500">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px]">
                      <Calendar className="h-3 w-3" /> {a.age}y
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300" />
                    {a.program.name}
                  </div>
                </div>
              </div>

              {/* Parent Info */}
              <div className="col-span-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                  <span className="h-6 w-6 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                    {a.parentName.charAt(0)}
                  </span>
                  {a.parentName}
                </div>
                <div className="flex flex-col gap-1 pl-8">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                    <Phone className="h-3 w-3" /> {a.phoneNumber}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                    <Mail className="h-3 w-3" /> {a.email}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    a.status === "SUBMITTED"
                      ? "bg-amber-50 text-amber-600 border border-amber-100"
                      : a.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    a.status === "SUBMITTED" ? "bg-amber-500" : a.status === "APPROVED" ? "bg-emerald-500" : "bg-rose-500"
                  }`} />
                  {a.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end">
                {a.status !== "APPROVED" ? (
                  <AdmissionActions id={a.id} />
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Enrolled
                  </div>
                )}
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No applications found</h3>
              <p className="mt-1 text-sm text-zinc-500">Inquiries will appear here as parents submit them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
