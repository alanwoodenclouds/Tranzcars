"use client";

import * as React from "react";
import { cn } from "@/utils";

type Option<T extends string> = {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

type SegmentedProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
};

/** Sliding-pill segmented control. Keyboard accessible via native radio semantics. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  className,
  ...rest
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={rest["aria-label"]}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-ink-100 p-1",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 ease-[var(--ease-out-quint)]",
              size === "md" ? "h-9 px-4 text-sm" : "h-8 px-3.5 text-[13px]",
              active
                ? "bg-surface text-ink-900"
                : "text-ink-500 hover:text-ink-800"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
