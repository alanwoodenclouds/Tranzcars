"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSession } from "@/content/site";

type AuthState = {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  updateProfile: (partial: Pick<UserSession, "name" | "email">) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateProfile: (partial) =>
        set((s) =>
          s.user ? { user: { ...s.user, ...partial } } : { user: null }
        ),
      logout: () => set({ user: null }),
    }),
    { name: "tranzcars-auth" }
  )
);
