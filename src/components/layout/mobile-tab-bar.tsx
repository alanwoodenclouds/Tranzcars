"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bike, Car, Home, UserRound } from "lucide-react";
import { cn } from "@/utils";

type TabMatch = (pathname: string, category: string | null) => boolean;

const TABS: {
  href: string;
  label: string;
  icon: typeof Home;
  match: TabMatch;
}[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    match: (p) => p === "/",
  },
  {
    href: "/cars",
    label: "Cars",
    icon: Car,
    match: (p, category) => p.startsWith("/cars") && category !== "bike",
  },
  {
    href: "/cars?category=bike",
    label: "Bikes",
    icon: Bike,
    match: (p, category) => p.startsWith("/cars") && category === "bike",
  },
  {
    href: "/account",
    label: "Account",
    icon: UserRound,
    match: (p) => p.startsWith("/account"),
  },
];

/** Floating curved bottom nav — thumb-reachable on mobile only. */
export function MobileTabBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <nav
      aria-label="Quick navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul
        className={cn(
          "pointer-events-auto mx-auto grid h-[3.85rem] max-w-md grid-cols-4 gap-0.5",
          "rounded-[1.85rem] border border-hairline bg-surface p-1.5",
          "shadow-[0_10px_36px_rgba(15,23,42,0.16),0_2px_8px_rgba(15,23,42,0.06)]",
          "ring-1 ring-ink-900/5"
        )}
      >
        {TABS.map((tab) => {
          const active = tab.match(pathname, category);
          return (
            <li key={tab.href} className="min-w-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full min-h-11 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-1 text-[12px] font-semibold tracking-normal transition-all duration-200 ease-[var(--ease-out-quint)]",
                  active
                    ? "bg-brand-50 text-brand-600 shadow-[inset_0_0_0_1px_rgba(248,120,0,0.12)]"
                    : "text-ink-500 hover:text-ink-600"
                )}
              >
                <tab.icon
                  className="size-[18px]"
                  strokeWidth={active ? 2.35 : 1.75}
                  aria-hidden
                />
                <span className="truncate leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
