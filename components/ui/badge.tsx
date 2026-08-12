import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "bg-ink-100 text-ink-700",
        brand: "bg-brand-50 text-brand-700",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        info: "bg-info-soft text-info",
        jade: "bg-jade-50 text-jade-600",
        outline: "border border-hairline bg-surface text-ink-600",
        dark: "bg-ink-900/85 text-white backdrop-blur-sm",
      },
      size: {
        sm: "px-2 py-0.5 text-[10.5px] tracking-wide [&_svg]:size-3",
        md: "px-2.5 py-1 text-[11.5px] [&_svg]:size-3.5",
        lg: "px-3 py-1.5 text-[13px] [&_svg]:size-4",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
  );
}

export { badgeVariants };
