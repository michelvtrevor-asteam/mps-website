"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== "loading") {
      setTimeout(() => {
        dismiss(id);
      }, 5000);
    }
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex min-w-[320px] items-center gap-4 rounded-2xl p-4 shadow-2xl transition-all animate-in slide-in-from-right-10 duration-500
              ${t.type === 'success' ? 'bg-zinc-900 text-white' : ''}
              ${t.type === 'error' ? 'bg-rose-600 text-white' : ''}
              ${t.type === 'info' ? 'bg-brand-indigo text-white' : ''}
              ${t.type === 'loading' ? 'bg-zinc-800 text-white' : ''}
            `}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-200" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-brand-sky" />}
              {t.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />}
            </div>
            <div className="flex-1 text-sm font-bold tracking-tight">{t.message}</div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-lg p-1 transition-colors hover:bg-white/10"
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
