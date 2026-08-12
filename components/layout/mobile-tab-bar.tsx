"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, Ticket, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/cars",
    label: "Fleet",
    icon: Car,
    match: (p: string) => p.startsWith("/cars"),
  },
  {
    href: "/trips",
    label: "Trips",
    icon: Ticket,
    match: (p: string) => p.startsWith("/trips"),
  },
  {
    href: "/account",
    label: "Account",
    icon: UserRound,
    match: (p: string) => p.startsWith("/account"),
  },
];

/** App-style bottom navigation — thumb-reachable on mobile only. */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold transition-colors",
                  active ? "text-brand-600" : "text-ink-400"
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-brand-50"
                  )}
                >
                  <tab.icon className="size-[18px]" />
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
