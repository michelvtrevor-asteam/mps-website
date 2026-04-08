"use client";

import { useState } from "react";
import { deleteParent, resetParentPassword, updateParent } from "@/actions/parents";
import { useToast } from "@/components/ui/Toast";
import { 
  Trash2, 
  Lock, 
  Loader2, 
  Mail, 
  Phone, 
  User as UserIcon,
  ShieldAlert,
  X,
  Edit,
  CheckCircle2,
  Plus
} from "lucide-react";

type Student = {
  id: string;
  fullName: string;
  program: { name: string };
};

type ParentWithStudents = {
  id: string;
  name: string;
  phone: string | null;
  user: {
    id: string;
    email: string;
  };
  students: Student[];
};

export function ParentListItem({ 
  parent: p, 
  allStudents 
}: { 
  parent: ParentWithStudents; 
  allStudents: any[];
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    p.students.map((s) => s.id)
  );
  
  const { toast } = useToast();

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    formData.append("studentIds", selectedStudents.join(","));
    
    try {
      await updateParent(p.user.id, formData);
      toast("Profile updated successfully!", "success");
      setShowEditModal(false);
    } catch (err: any) {
      toast(err.message || "Failed to update profile.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${p.name}'s account? This will permanently remove their access.`)) return;
    
    setIsDeleting(true);
    try {
      await deleteParent(p.user.id);
      toast("Parent account deleted successfully.", "success");
    } catch (err: any) {
      toast(err.message || "Failed to delete parent.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsResetting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await resetParentPassword(p.user.id, formData);
      toast("Password reset successfully!", "success");
      setShowResetModal(false);
    } catch (err: any) {
      toast(err.message || "Failed to reset password.", "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white p-7 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 font-display text-xl font-black text-zinc-400 group-hover:bg-brand-pink group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
            {p.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display text-lg font-black text-zinc-900 leading-tight">{p.name}</h3>
            <div className="flex flex-wrap items-center gap-4 mt-1.5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 transition-colors group-hover:text-zinc-900">
                <Mail className="h-3.5 w-3.5 text-brand-pink" /> {p.user.email}
              </div>
              {p.phone && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 transition-colors group-hover:text-zinc-900">
                  <Phone className="h-3.5 w-3.5 text-brand-sky" /> {p.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-50 pt-5 lg:border-none lg:pt-0">
          <div className="flex items-center gap-2">
            <div className="mr-4 flex -space-x-3">
              {p.students.map((s) => (
                <div 
                  key={s.id} 
                  title={`${s.fullName} (${s.program.name})`}
                  className="group/tag relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-brand-sky text-[11px] font-black text-white shadow-xl transition-transform hover:z-20 hover:scale-110"
                >
                  {s.fullName.charAt(0)}
                </div>
              ))}
              {p.students.length === 0 && (
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em] italic">No Linked Students</span>
              )}
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:bg-brand-sky hover:text-white transition-all shadow-sm"
              title="Edit Profile & Links"
            >
              <Edit className="h-4.5 w-4.5" />
            </button>
            
            <button 
              onClick={() => setShowResetModal(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
              title="Change Password"
            >
              <Lock className="h-4.5 w-4.5" />
            </button>
            
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm disabled:opacity-50"
              title="Delete Account"
            >
              {isDeleting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Trash2 className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile & Links Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-10 py-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sky text-white shadow-lg shadow-brand-sky/20">
                  <Edit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black text-zinc-900">Edit Profile</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Parent Management</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm transition-all hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-10">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        name="name"
                        defaultValue={p.name}
                        required
                        className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-4 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        name="email"
                        defaultValue={p.user.email}
                        required
                        type="email"
                        className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-4 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        name="phone"
                        defaultValue={p.phone || ""}
                        className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-11 pr-4 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Link Students</label>
                  <div className="flex-1 overflow-y-auto rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-4 max-h-[250px] custom-scrollbar">
                    <div className="space-y-2">
                      {allStudents.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleStudent(s.id)}
                          className={`flex w-full items-center justify-between rounded-xl p-3 transition-all ${
                            selectedStudents.includes(s.id)
                              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                              : "bg-white text-zinc-600 hover:bg-zinc-100"
                          }`}
                        >
                          <div className="text-left">
                            <div className="text-xs font-black">{s.fullName}</div>
                            <div className={`text-[9px] font-bold uppercase tracking-widest opacity-60`}>
                              {s.program.name}
                            </div>
                          </div>
                          {selectedStudents.includes(s.id) ? (
                            <CheckCircle2 className="h-4 w-4 text-brand-pink" />
                          ) : (
                            <Plus className="h-4 w-4 opacity-30" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-2xl border-2 border-zinc-100 py-4 text-sm font-black text-zinc-400 transition-all hover:border-zinc-900 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-[2] rounded-2xl bg-zinc-900 py-4 text-sm font-black text-white shadow-xl shadow-zinc-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-900">Reset Password</h3>
              </div>
              <button 
                onClick={() => setShowResetModal(false)}
                className="rounded-full p-2 hover:bg-zinc-100 text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-zinc-500 mb-6">
              Enter a new password for <strong className="text-zinc-900">{p.name}</strong>. They will need this to log in next time.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">New Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoFocus
                  className="h-14 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 py-3 px-4 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-zinc-100 outline-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={isResetting}
                className="w-full rounded-2xl bg-zinc-900 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isResetting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
