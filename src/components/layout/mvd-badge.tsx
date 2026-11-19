import Image from "next/image";
import { BUSINESS_RULES } from "@/content/site";
import { cn } from "@/utils";

type MvdBadgeProps = {
  className?: string;
  size?: "sm" | "md" | "banner";
  /** light = on pale pages; onDark = on black / photo hero */
  tone?: "light" | "onDark" | "dark";
};

/** Minimal Kerala MVD trust chip. */
export function MvdBadge({
  className,
  size = "sm",
  tone = "light",
}: MvdBadgeProps) {
  const isBanner = size === "banner";
  const logoSize = isBanner ? 36 : size === "md" ? 28 : 22;
  const onDark = tone === "onDark" || tone === "dark";

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full backdrop-blur-sm",
        onDark
          ? "border border-white/15 bg-white/[0.06] text-white"
          : "border border-hairline bg-surface/90 text-ink-800",
        isBanner ? "gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5" : "px-2.5 py-1.5",
        size === "md" && "px-3 py-1.5",
        className
      )}
      role="img"
      aria-label={`Kerala Government Approved Rent A Cab since ${BUSINESS_RULES.foundedYear}. MVD licensed self-drive.`}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full",
          onDark && "bg-white p-0.5"
        )}
      >
        <Image
          src="/brand/mvd-logo.png"
          alt="Kerala Motor Vehicles Department (MVD) seal"
          width={logoSize}
          height={Math.round(logoSize * (300 / 278))}
          className="object-contain"
          priority={isBanner}
        />
      </span>
      <span
        className={cn(
          "min-w-0 font-semibold leading-snug tracking-tight",
          isBanner ? "text-[13px] sm:text-[14px]" : "text-[12px]",
          onDark ? "text-white/90" : "text-ink-700"
        )}
      >
        {isBanner ? (
          <>
            <span className={onDark ? "text-white" : "text-ink-900"}>
              Kerala Govt Approved
            </span>
            <span className={onDark ? "text-white/70" : "text-ink-400"}>
              {" "}
              · Since {BUSINESS_RULES.foundedYear}
            </span>
          </>
        ) : (
          <>Govt Approved · {BUSINESS_RULES.foundedYear}</>
        )}
      </span>
    </div>
  );
}
