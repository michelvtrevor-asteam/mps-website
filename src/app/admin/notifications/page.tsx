import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { NotificationForm } from "./NotificationForm";
import { 
  Bell, 
  ArrowLeft, 
  Send, 
  Users, 
  Calendar, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from "lucide-react";

export default async function AdminNotificationsPage() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
        <h2 className="font-display text-xl font-bold">Unauthorized</h2>
        <p className="mt-2 text-sm opacity-80">You do not have permission to view this page.</p>
      </div>
    );
  }

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const programs = await prisma.program.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
            <Bell className="h-3 w-3" /> Communication Hub
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900">
            School <span className="text-orange-500">Announcements</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Send mass updates and reminders to parents and staff.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      {/* Action Area: New Announcement */}
      <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
            <Send className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-zinc-900">Send New Message</h2>
        </div>
        <NotificationForm programs={programs} />
      </div>

      {/* History List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-3">Sent On</div>
          <div className="col-span-4">Announcement Title</div>
          <div className="col-span-3">Target Audience</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {notifications.map((n) => (
            <div key={n.id} className="group grid grid-cols-12 items-center gap-4 px-6 py-6 transition-all hover:bg-zinc-50/50">
              <div className="col-span-3 flex items-center gap-2 text-xs font-bold text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                {n.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>

              <div className="col-span-4 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="font-display font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                  {n.title}
                </div>
              </div>

              <div className="col-span-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  <Users className="h-3 w-3" />
                  {n.audience.replace('_', ' ')}
                </div>
              </div>

              <div className="col-span-2 flex justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-3 w-3" /> Sent
                </span>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">No message history</h3>
              <p className="mt-1 text-sm text-zinc-500">Your sent announcements will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
