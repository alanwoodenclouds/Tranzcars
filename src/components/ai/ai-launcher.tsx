"use client";

import { Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAiAssistantUi } from "@/components/ai/ai-assistant-ui";

/**
 * Single persistent launcher. Sits above the mobile tab bar so it never
 * collides with navigation. Hidden while any dialog / bottom sheet is open.
 * Icon-only on small screens to avoid covering booking CTAs.
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
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.35rem)] right-4 z-[55] inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-brand-500 text-white shadow-brand ring-1 ring-brand-700/30 sm:bottom-7 sm:right-6 sm:h-[52px] sm:w-auto sm:gap-2.5 sm:pl-3 sm:pr-4"
    >
      <span className="grid size-8 place-items-center rounded-full bg-white text-brand-600 sm:size-8">
        {open ? (
          <X className="size-4" />
        ) : (
          <Sparkles className="size-[15px]" />
        )}
      </span>
      <span className="hidden text-[13px] font-bold tracking-wide text-white sm:inline">
        {open ? "Close" : "Ask AI"}
      </span>
    </motion.button>
  );
}
