"use client";

import { useTransition } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { bulkMarkAsPaid } from "@/actions/fees";
import { useToast } from "@/components/ui/Toast";

export function BulkActions({ 
  selectedIds, 
  onClear 
}: { 
  selectedIds: string[]; 
  onClear: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-3xl bg-zinc-900 px-6 py-4 text-white shadow-2xl shadow-zinc-900/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 border-r border-zinc-700 pr-6">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-[10px] font-black">
          {selectedIds.length}
        </div>
        <span className="text-sm font-bold tracking-tight">Invoices Selected</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={isPending}
          onClick={() => {
            if (confirm(`Are you sure you want to mark ${selectedIds.length} invoices as PAID?`)) {
              toast(`Updating ${selectedIds.length} invoices...`, "loading");
              startTransition(async () => {
                try {
                  await bulkMarkAsPaid(selectedIds);
                  toast("Invoices updated successfully!", "success");
                  onClear();
                } catch (err) {
                  toast("Failed to update invoices.", "error");
                }
              });
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition-all hover:bg-emerald-500 hover:text-white disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Mark as Paid
        </button>

        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-xs font-bold transition-all hover:bg-zinc-800"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );
}
