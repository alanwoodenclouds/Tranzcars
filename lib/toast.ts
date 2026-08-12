"use client";

import { create } from "zustand";

export type ToastTone = "default" | "success" | "error" | "info";

type Toast = { id: string; message: string; tone: ToastTone };

type ToastState = {
  toasts: Toast[];
  push: (message: string, tone?: ToastTone) => void;
  dismiss: (id: string) => void;
};

let seq = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone = "default") => {
    const id = `t_${Date.now()}_${seq++}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, tone: ToastTone = "default") {
  useToastStore.getState().push(message, tone);
}
