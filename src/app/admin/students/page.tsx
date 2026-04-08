import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  GraduationCap, 
  Calendar, 
  Phone, 
  Mail,
  MoreVertical,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

import { SearchInput } from "@/components/ui/SearchInput";

export default async function AdminStudentsPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await props.searchParams;

  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const students = await prisma.student.findMany({
    where: {
      isArchived: false,
      OR: search
        ? [
            { fullName: { contains: search } },
            { id: { contains: search } },
            { parentProfile: { name: { contains: search } } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: {
      program: true,
      parentProfile: { include: { user: true } },
    },
    take: 200,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-indigo">
            <Users className="h-3 w-3" /> Student Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Active <span className="text-brand-indigo">Students</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Managing {students.length} enrolled students across all programs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search name or ID..." className="w-64" />
          <Link
            href="/admin/students/new"
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-indigo hover:shadow-lg hover:shadow-brand-indigo/20"
          >
            <UserPlus className="h-4 w-4" /> Add Student
          </Link>
        </div>
      </div>

      {/* Student List */}
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-4">Student Info</div>
          <div className="col-span-2">Program</div>
          <div className="col-span-3">Parent / Guardian</div>
          <div className="col-span-3 text-right">Quick Actions</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {students.map((s) => (
            <div key={s.id} className="group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-colors hover:bg-zinc-50/50">
              <div className="col-span-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-indigo/10 font-display text-lg font-black text-brand-indigo transition-transform group-hover:rotate-6">
                  {s.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-zinc-900 group-hover:text-brand-indigo transition-colors">
                    {s.fullName}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs font-bold text-zinc-500">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px]">
                      <Calendar className="h-3 w-3" /> {s.age}y
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300" />
                    ID: {s.id.slice(-6).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  <GraduationCap className="h-3 w-3" />
                  {s.program.name}
                </div>
              </div>

              <div className="col-span-3 space-y-1.5">
                <div className="text-xs font-bold text-zinc-900">{s.parentProfile.name}</div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                    <Phone className="h-3 w-3" /> {s.parentProfile.phone ?? "No phone"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                    <Mail className="h-3 w-3" /> {s.parentProfile.user.email}
                  </div>
                </div>
              </div>

              <div className="col-span-3 flex justify-end gap-2">
                <Link
                  href={`/admin/students/${s.id}/edit`}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 transition-all hover:border-brand-indigo hover:text-brand-indigo"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/students/${s.id}/attendance`}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-indigo"
                >
                  Records
                </Link>
              </div>
            </div>
          ))}

          {students.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No students yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Start by adding your first student or approving an admission.</p>
              <Link href="/admin/students/new" className="mt-6 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-indigo">
                Add Student
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
