import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { Sparkles, Bell, Search } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className=" bg-zinc-50 font-display">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-zinc-200/50 bg-white shadow-sm transition-transform lg:translate-x-0">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center px-8">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-pink shadow-lg shadow-brand-pink/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="block text-base font-black tracking-tight text-zinc-900">MPS Admin</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Control Center</span>
              </div>
            </Link>
          </div>
          <AdminNav email={session?.user?.email} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white/80 px-10 backdrop-blur-xl border-b border-zinc-200/50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input 
              placeholder="Search students, invoices, results..." 
              className="w-full rounded-2xl bg-zinc-100 py-2.5 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-pink border-2 border-white" />
            </button>
            <div className="h-10 w-[1px] bg-zinc-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900">Administrator</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Super User</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-600">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-10">{children}</main>
      </div>
    </div>
  );
}
