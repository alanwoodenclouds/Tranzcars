import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";
import { inputBase } from "@/components/ui/input";

/**
 * Native select on purpose — mobile users get the platform picker, which beats
 * any custom listbox for a booking flow.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select"> & { wrapperClassName?: string }
>(({ className, wrapperClassName, children, ...props }, ref) => (
  <div className={cn("relative", wrapperClassName)}>
    <select
      ref={ref}
      className={cn(
        inputBase,
        "h-11 cursor-pointer appearance-none pr-10",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"
    />
  </div>
));
Select.displayName = "Select";

export { Select };
