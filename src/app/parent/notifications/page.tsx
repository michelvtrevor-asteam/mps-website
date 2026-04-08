import { getParentContext } from "@/lib/parent/context";
import { prisma } from "@/lib/db";
import { 
  Bell, 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Users,
  Sparkles,
  Megaphone
} from "lucide-react";
import Link from "next/link";

export default async function ParentNotificationsPage() {
  const ctx = await getParentContext();
  
  if (!ctx) {
    return (
      <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-8 text-red-800 shadow-sm">
        <h2 className="font-display text-xl font-bold">Profile Not Found</h2>
        <p className="mt-2 text-sm opacity-80">Please contact administration.</p>
      </div>
    );
  }

  const studentIds = ctx.parentProfile.students.map((s) => s.id);
  const programIds = Array.from(new Set(ctx.parentProfile.students.map((s) => s.programId)));

  const notifications = await prisma.notification.findMany({
    where: {
      status: "SENT",
      OR: [
        { audience: "ALL_PARENTS" },
        { audience: "PROGRAM_PARENTS", programId: { in: programIds } },
        { audience: "STUDENT_PARENT", studentId: { in: studentIds } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
            <Bell className="h-3 w-3" /> Communication Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            School <span className="text-orange-500">Updates</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Stay informed with the latest announcements and notices.
          </p>
        </div>
        
        <Link
          href="/parent"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Notifications List */}
      <div className="grid gap-6">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
          >
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Megaphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-zinc-900">{n.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {n.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <Users className="h-3 w-3" />
                  {n.audience.replace('_', ' ')}
                </span>
              </div>

              <div className="prose prose-zinc max-w-none">
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{n.message}</p>
              </div>
            </div>
            
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/5 transition-transform duration-700 group-hover:scale-150" />
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-zinc-50">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-200">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-zinc-900">No notifications</h3>
            <p className="mt-1 text-sm text-zinc-500">You&apos;ll see school announcements here as they are posted.</p>
          </div>
        )}
      </div>

      {/* Helper Card */}
      <div className="rounded-[2rem] bg-zinc-900 p-10 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-pink">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Never Miss an Update</h3>
            <p className="mt-1 text-sm text-zinc-400">Important notices are also sent to your registered email and WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
