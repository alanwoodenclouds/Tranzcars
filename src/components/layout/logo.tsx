import Link from "next/link";
import { cn } from "@/utils";

/** Brand mark — squircle with a stylised road vanishing to the horizon. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-brand-500 text-white",
        className
      )}
    >
      <svg viewBox="0 0 32 32" className="size-full" fill="none">
        <path d="M0 0h32v32H0z" fill="url(#tz-g)" />
        <path
          d="M11.2 27 14.6 8.5h2.8L20.8 27h-3.2l-.6-3.6h-2.1L14.4 27h-3.2Zm4.1-6.7h1.4L16 14.6l-.7 5.7Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M4 27c2.6-3.4 5.2-5.1 7.8-5.1M28 27c-2.6-3.4-5.2-5.1-7.8-5.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <defs>
          <linearGradient id="tz-g" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#FA7A4C" />
            <stop offset="1" stopColor="#D24310" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

export function Logo({
  className,
  wordmarkClassName,
  href = "/",
}: {
  className?: string;
  wordmarkClassName?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label="TranzCars home"
    >
      <LogoMark />
      <span
        className={cn(
          "font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink-900",
          wordmarkClassName
        )}
      >
        Tranz<span className="text-brand-500">Cars</span>
      </span>
    </Link>
  );
}
