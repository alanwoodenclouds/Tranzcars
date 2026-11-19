import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils";

type LogoVariant = "full" | "wordmark";

const SRC: Record<LogoVariant, { src: string; width: number; height: number }> =
  {
    full: {
      src: "/brand/tranzcars-logo.png",
      width: 852,
      height: 215,
    },
    wordmark: {
      src: "/brand/tranzcars-wordmark.png",
      width: 852,
      height: 147,
    },
  };

/** Square brand plate (full logo on black) — favicon-style compact mark. */
export function LogoMark({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 overflow-hidden rounded-[10px] bg-black ring-1 ring-white/10",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/icon-512.png"
        alt=""
        width={size}
        height={size}
        className="size-full object-cover"
        priority
      />
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  variant = "wordmark",
  /** When false, skip the black brand plate (e.g. already on a dark footer). */
  plate = true,
}: {
  className?: string;
  href?: string;
  /** full = wordmark + tagline (transparent); wordmark = header-friendly */
  variant?: LogoVariant;
  plate?: boolean;
}) {
  const asset = SRC[variant];

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-95",
        plate &&
          "rounded-xl bg-black px-2.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(248,120,0,0.55)] ring-1 ring-white/10",
        className
      )}
      aria-label="TranzCars home — Rent A Car. Drive Better."
    >
      <Image
        src={asset.src}
        alt="TranzCars — Rent A Car. Drive Better."
        width={asset.width}
        height={asset.height}
        className={cn(
          "w-auto object-contain object-left",
          variant === "wordmark" && "h-7 sm:h-8",
          variant === "full" && "h-10 sm:h-12"
        )}
        priority
      />
    </Link>
  );
}
