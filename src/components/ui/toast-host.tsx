"use client";

import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useToastStore, type ToastTone } from "@/store/useToastStore";

const ICONS: Record<ToastTone, React.ReactNode> = {
  default: null,
  success: <CheckCircle2 className="size-4 text-emerald-400" />,
  error: <AlertTriangle className="size-4 text-brand-300" />,
  info: <Info className="size-4 text-sky-300" />,
};

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!toasts.length) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[90] mx-auto flex w-[min(92vw,420px)] flex-col gap-2 sm:bottom-8"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-in pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-ink-900/95 py-2.5 pl-4 pr-2 text-sm font-medium text-white shadow-e4 backdrop-blur-md"
        >
          {ICONS[t.tone]}
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className="grid size-7 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
