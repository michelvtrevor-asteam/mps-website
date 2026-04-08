import Link from "next/link";
import { getParentContext } from "@/lib/parent/context";
import { 
  UserCircle, 
  CalendarCheck, 
  Receipt, 
  Trophy, 
  ArrowRight,
  Sparkles,
  GraduationCap,
  Heart
} from "lucide-react";

export default async function ParentHome() {
  const ctx = await getParentContext();
  
  if (!ctx) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center shadow-xl shadow-zinc-200/50">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <UserCircle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-black text-zinc-900">No student profile found</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-zinc-500">
          This login is not yet linked to any student record. Please contact the 
          school administration to sync your account.
        </p>
        <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105">
          Contact School
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-pink p-8 text-white shadow-2xl shadow-brand-pink/20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest">
            Parent Portal
          </div>
          <h1 className="mt-4 font-display text-3xl font-black tracking-tight md:text-4xl leading-[1.1]">
            Hello, <span className="text-brand-yellow">{ctx.parentProfile.name}</span>
          </h1>
          <p className="mt-3 max-w-lg text-[15px] opacity-90 leading-snug">
            Welcome to your child&apos;s digital home. Track attendance, view results, 
            and manage fees all in one place.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
      </section>

      {/* Students List */}
      <section>
        <div className="mb-5 flex items-center justify-between px-2">
          <h2 className="font-display text-lg font-black text-zinc-900">Your Children</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {ctx.parentProfile.students.length} Student{ctx.parentProfile.students.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {ctx.parentProfile.students.map((s) => {
            const attendancePct = s.attendance.length > 0
              ? Math.round((s.attendance.filter(a => a.status === 'PRESENT').length / s.attendance.length) * 100)
              : 100;
            const pendingInvoices = s.invoices.filter(i => i.status !== 'PAID').length;

            return (
              <div 
                key={s.id} 
                className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-indigo/5 transition-transform duration-700 group-hover:scale-150" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo shadow-lg shadow-zinc-200/20 text-white transition-transform duration-500 group-hover:rotate-6">
                        <GraduationCap className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-black text-zinc-900">{s.fullName}</h3>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <span className="h-1 w-1 rounded-full bg-brand-pink" />
                          {s.program.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Attendance</div>
                      <div className={`text-lg font-black ${attendancePct < 75 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {attendancePct}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-2.5">
                    {[
                      { label: "Attendance", icon: CalendarCheck, href: "/parent/attendance", color: "text-emerald-500", count: null },
                      { label: "Fees", icon: Receipt, href: "/parent/fees", color: "text-brand-pink", count: pendingInvoices > 0 ? pendingInvoices : null },
                      { label: "Results", icon: Trophy, href: "/parent/results", color: "text-brand-yellow", count: null },
                    ].map((btn) => (
                      <Link
                        key={btn.label}
                        href={btn.href}
                        className="relative flex flex-col items-center gap-2 rounded-xl bg-zinc-50 py-3 transition-all hover:bg-zinc-900 hover:text-white"
                      >
                        {btn.count && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg">
                            {btn.count}
                          </span>
                        )}
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${btn.color.replace('text-', 'bg-')} shadow-sm`}>
                          <btn.icon className="h-4 w-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{btn.label}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/parent/profile"
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-zinc-100 bg-white py-3 text-xs font-bold text-zinc-900 shadow-sm transition-all hover:border-zinc-900"
                  >
                    View Full Profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Support & Quick Links */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-zinc-900 p-8 text-white lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-pink shadow-lg shadow-brand-pink/20 text-white">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-lg font-bold">Upcoming Events</h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
            Stay updated with the latest events and celebrations. Check the 
            notifications tab for recent announcements from the administration.
          </p>
          <Link href="/parent/notifications" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-pink hover:underline">
            Go to Notifications <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-200 p-8 text-center bg-white/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink shadow-lg shadow-brand-pink/20 text-white">
            <Heart className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <h4 className="font-display font-bold text-zinc-900">Need Help?</h4>
          <p className="mt-2 text-[11px] text-zinc-500 max-w-[180px]">Contact the support desk for any technical issues.</p>
          <Link href="/contact" className="mt-5 text-[10px] font-black uppercase tracking-widest text-brand-pink hover:underline">
            Get Support
          </Link>
        </div>
      </section>
    </div>
  );
}
