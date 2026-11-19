"use client";

import { Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAiAssistantUi } from "@/components/ai/ai-assistant-ui";

/**
 * Single persistent launcher. Sits above the mobile tab bar so it never
 * collides with navigation. Hidden while any dialog / bottom sheet is open.
 */
export function AiFloatingButton() {
  const { open, setOpen } = useAiAssistantUi();

  return (
    <motion.button
      type="button"
      data-ai-fab
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={open ? "Close AI booking assistant" : "Open AI booking assistant"}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] right-4 z-40 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-brand-500 pl-3 pr-4 font-semibold text-white shadow-brand ring-1 ring-brand-700/30 sm:bottom-7 sm:right-6"
      style={{ height: 52 }}
    >
      <span className="grid size-8 place-items-center rounded-full bg-white text-brand-600 shadow-e1">
        {open ? (
          <X className="size-4" />
        ) : (
          <Sparkles className="size-[15px]" />
        )}
      </span>
      <span className="text-[13px] font-bold tracking-wide text-white">
        {open ? "Close" : "Ask AI"}
      </span>
    </motion.button>
  );
}
