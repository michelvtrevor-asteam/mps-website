"use client";

import { useState } from "react";
import { createParent } from "@/actions/parents";
import { useToast } from "@/components/ui/Toast";
import { UserPlus, Loader2, Key, Mail, User, Phone, Eye, EyeOff } from "lucide-react";

export function NewParentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createParent(formData);
      if (res.success) {
        toast("Parent account created successfully!", "success");
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      toast(err.message || "Failed to create parent.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50 transition-all hover:shadow-2xl hover:shadow-zinc-200/60">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-brand-pink/10 text-brand-pink ring-4 ring-brand-pink/5">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-black text-zinc-900 leading-tight">Create Parent</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">New System Access</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-brand-pink" />
              <input
                name="name"
                required
                placeholder="Parent's Name"
                className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-4 text-sm font-bold transition-all focus:border-transparent focus:bg-white focus:ring-4 focus:ring-brand-pink/5 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 ml-1">Email / Username</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-brand-pink" />
              <input
                name="email"
                type="email"
                required
                placeholder="parent@example.com"
                className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-4 text-sm font-bold transition-all focus:border-transparent focus:bg-white focus:ring-4 focus:ring-brand-pink/5 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 ml-1">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-brand-pink" />
              <input
                name="phone"
                placeholder="+91 00000 00000"
                className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-4 text-sm font-bold transition-all focus:border-transparent focus:bg-white focus:ring-4 focus:ring-brand-pink/5 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 ml-1">Initial Password</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-brand-pink" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-12 text-sm font-bold transition-all focus:border-transparent focus:bg-white focus:ring-4 focus:ring-brand-pink/5 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group relative h-14 w-full overflow-hidden rounded-2xl bg-zinc-900 text-sm font-black text-white shadow-xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Registering...
              </>
            ) : (
              <>
                Register Parent <UserPlus className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </button>
      </form>
    </div>
  );
}
