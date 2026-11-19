import * as React from "react";
import { cn } from "@/utils";

export const inputBase = [
  "w-full rounded-[var(--radius-md)] border bg-surface px-3.5 text-[15px] font-medium text-ink-900",
  "border-hairline placeholder:font-normal placeholder:text-ink-400",
  "transition-[border-color] duration-200",
  "hover:border-ink-300",
  "focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/12",
  "disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400",
  "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/12",
].join(" ");

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputBase, "h-11", className)}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(inputBase, "min-h-[112px] resize-y py-3 leading-relaxed", className)}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Input, Textarea };
