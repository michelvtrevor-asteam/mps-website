import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { EditStudentForm } from "./EditStudentForm";
import { UserCheck, ArrowLeft, GraduationCap } from "lucide-react";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: { program: true, parentProfile: { include: { user: true } } },
  });
  
  if (!student) {
    return (
      <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50 p-12 text-center">
        <h2 className="font-display text-xl font-bold text-zinc-900">Student not found</h2>
        <Link href="/admin/students" className="mt-4 inline-flex text-brand-indigo font-bold hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  const programs = await prisma.program.findMany({ orderBy: { name: "asc" } });
  const parentProfiles = await prisma.parentProfile.findMany({ 
    orderBy: { name: "asc" } 
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-indigo">
            <GraduationCap className="h-3 w-3" /> Student Profile
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Edit <span className="text-brand-indigo">{student.fullName}</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Updating records for student ID: {student.id.slice(-6).toUpperCase()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/students"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Link>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <UserCheck className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-zinc-900">Update Information</h2>
        </div>
        <EditStudentForm student={student} programs={programs} parentProfiles={parentProfiles} />
      </div>
    </div>
  );
}
