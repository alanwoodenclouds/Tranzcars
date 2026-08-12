import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

type FieldProps = {
  label?: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + hint/error, with consistent vertical rhythm. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor={htmlFor}>{label}</Label>
          {optional ? (
            <span className="text-[11px] font-medium text-ink-400">Optional</span>
          ) : null}
        </div>
      ) : null}
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-danger">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] leading-relaxed text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
