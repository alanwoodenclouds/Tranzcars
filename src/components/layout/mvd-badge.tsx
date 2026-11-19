import Image from "next/image";
import { BUSINESS_RULES } from "@/content/site";
import { cn } from "@/utils";

type MvdBadgeProps = {
  className?: string;
  size?: "sm" | "md" | "banner";
};

/** Minimal Kerala MVD trust chip. */
export function MvdBadge({ className, size = "sm" }: MvdBadgeProps) {
  const isBanner = size === "banner";
  const logoSize = isBanner ? 36 : size === "md" ? 28 : 22;

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full border border-hairline bg-surface/90 text-ink-800 backdrop-blur-sm",
        isBanner ? "px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2" : "px-2 py-1",
        size === "md" && "px-2.5 py-1.5",
        className
      )}
      role="img"
      aria-label={`Kerala Government Approved Rent A Cab since ${BUSINESS_RULES.foundedYear}. MVD licensed self-drive.`}
    >
      <Image
        src="/brand/mvd-logo.png"
        alt="Kerala Motor Vehicles Department (MVD) seal"
        width={logoSize}
        height={Math.round(logoSize * (300 / 278))}
        className="shrink-0 object-contain"
        priority={isBanner}
      />
      <span
        className={cn(
          "min-w-0 font-semibold tracking-tight text-ink-700",
          isBanner ? "text-[12px] sm:text-[13px]" : "text-[11px]"
        )}
      >
        {isBanner ? (
          <>
            <span className="text-ink-900">Kerala Govt Approved</span>
            <span className="text-ink-400"> · Since {BUSINESS_RULES.foundedYear}</span>
          </>
        ) : (
          <>Govt Approved · {BUSINESS_RULES.foundedYear}</>
        )}
      </span>
    </div>
  );
}
