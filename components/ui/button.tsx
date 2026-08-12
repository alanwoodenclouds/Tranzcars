import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-quint)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.985]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-brand",
        secondary:
          "bg-ink-900 text-white hover:bg-ink-800 hover:shadow-e2",
        outline:
          "border border-hairline bg-surface text-ink-900 hover:border-ink-300 hover:bg-ink-50",
        subtle: "bg-ink-100 text-ink-900 hover:bg-ink-200",
        ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
        danger: "bg-danger text-white hover:brightness-95",
        link: "h-auto rounded-none p-0 text-brand-500 underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-8 gap-1.5 px-3 text-xs [&_svg]:size-3.5",
        sm: "h-9 px-4 text-[13px] [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-[52px] px-7 text-[15px] [&_svg]:size-[18px]",
        icon: "size-10 [&_svg]:size-[18px]",
        "icon-sm": "size-9 [&_svg]:size-4",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      block,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, className }))}
        ref={ref}
        disabled={disabled ?? (asChild ? undefined : loading)}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? <Loader2 className="animate-spin" /> : null}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
