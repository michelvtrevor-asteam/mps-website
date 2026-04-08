import { getParentContext } from "@/lib/parent/context";
import { 
  UserCircle, 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart
} from "lucide-react";
import Link from "next/link";

export default async function ParentProfilePage() {
  const ctx = await getParentContext();
  
  if (!ctx) {
    return (
      <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-8 text-red-800 shadow-sm">
        <h2 className="font-display text-xl font-bold">Profile Not Found</h2>
        <p className="mt-2 text-sm opacity-80">We couldn&apos;t find your parent profile. Please contact administration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-pink">
            <UserCircle className="h-3 w-3" /> Family Portal
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            Student <span className="text-brand-pink">Profiles</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Managing records for {ctx.parentProfile.students.length} child(ren).
          </p>
        </div>
        
        <Link
          href="/parent"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Parent Info Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-2xl md:p-10">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-brand-pink/20 text-brand-pink shadow-inner">
            <Heart className="h-10 w-10 fill-current" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Parent / Guardian</div>
            <h2 className="font-display text-3xl font-black">{ctx.parentProfile.name}</h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-pink" /> {ctx.email}
              </div>
              {ctx.parentProfile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-pink" /> {ctx.parentProfile.phone}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-pink/10 blur-3xl" />
      </div>

      {/* Students List */}
      <div className="grid gap-8 md:grid-cols-2">
        {ctx.parentProfile.students.map((s) => (
          <div 
            key={s.id} 
            className="group relative overflow-hidden rounded-[3rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-indigo/5 transition-transform duration-700 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-indigo/10 text-brand-indigo shadow-inner transition-transform duration-500 group-hover:rotate-6">
                  <GraduationCap className="h-8 w-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black text-zinc-900">{s.fullName}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <Sparkles className="h-3 w-3 text-brand-pink" /> {s.program.name}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4 border-t border-zinc-100 pt-8">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-zinc-500 font-medium">
                    <Calendar className="h-4 w-4 text-zinc-300" /> Date of Birth
                  </div>
                  <div className="font-bold text-zinc-900">{s.dateOfBirth.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-zinc-500 font-medium">
                    <Clock className="h-4 w-4 text-zinc-300" /> Current Age
                  </div>
                  <div className="font-bold text-zinc-900">{s.age} Years</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-zinc-500 font-medium">
                    <Sparkles className="h-4 w-4 text-zinc-300" /> Admission Date
                  </div>
                  <div className="font-bold text-zinc-900">{s.admissionDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-2 rounded-2xl bg-zinc-50 p-4">
                <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                <p className="text-xs font-medium text-zinc-500 line-clamp-1">{s.address || "No address listed"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
