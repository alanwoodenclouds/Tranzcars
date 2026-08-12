import { cn } from "@/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-shimmer rounded-[var(--radius-md)]", className)}
      {...props}
    />
  );
}
