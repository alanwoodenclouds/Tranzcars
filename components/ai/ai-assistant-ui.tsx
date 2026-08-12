"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AiAssistantUiContextValue = {
  open: boolean;
  setOpen: (open: boolean | ((v: boolean) => boolean)) => void;
};

const AiAssistantUiContext = createContext<AiAssistantUiContextValue | null>(
  null
);

export function AiAssistantUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <AiAssistantUiContext.Provider value={value}>
      {children}
    </AiAssistantUiContext.Provider>
  );
}

export function useAiAssistantUi() {
  const ctx = useContext(AiAssistantUiContext);
  if (!ctx) {
    throw new Error("useAiAssistantUi must be used within AiAssistantUiProvider");
  }
  return ctx;
}

/** Safe hook when provider might not wrap (e.g. tests) */
export function useAiAssistantUiOptional() {
  return useContext(AiAssistantUiContext);
}

export function useToggleAiAssistant() {
  const ctx = useAiAssistantUiOptional();
  return useCallback(() => {
    ctx?.setOpen((v) => !v);
  }, [ctx]);
}
