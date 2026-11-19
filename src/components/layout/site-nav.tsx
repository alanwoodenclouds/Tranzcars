"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bike,
  Car,
  ChevronRight,
  LogOut,
  Menu,
  Phone,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/logo";
import { OtpDialog } from "@/components/auth/otp-dialog";

type NavMatch = (pathname: string, category: string | null) => boolean;

const NAV: {
  href: string;
  label: string;
  match: NavMatch;
  icon?: typeof Bike;
}[] = [
  {
    href: "/cars",
    label: "Cars",
    match: (p, category) => p === "/cars" && category !== "bike",
  },
  {
    href: "/cars?category=bike",
    label: "Bikes",
    match: (p, category) => p === "/cars" && category === "bike",
    icon: Bike,
  },
  {
    href: "/destinations",
    label: "Trips",
    match: (p) => p.startsWith("/destinations"),
  },
  { href: "/about", label: "About", match: (p) => p === "/about" },
  { href: "/faq", label: "FAQ", match: (p) => p === "/faq" },
  { href: "/contact", label: "Contact", match: (p) => p === "/contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const hasPhotoHero =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    /^\/destinations\/[^/]+$/.test(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  /** Light-on-dark chrome over photo hero, and keep dark after scroll */
  const overHero = hasPhotoHero && !scrolled;
  const darkChrome = overHero || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-300",
          scrolled
            ? "border-b border-white/10 bg-ink-950/95 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <Logo />

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
            {NAV.map((item) => {
              const active = item.match(pathname, category);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    darkChrome
                      ? active
                        ? "text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                      : active
                        ? "text-ink-900"
                        : "text-ink-500 hover:bg-ink-100/70 hover:text-ink-900"
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-brand-500"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`tel:${BUSINESS_RULES.phoneE164}`}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors lg:inline-flex",
                darkChrome
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-ink-700 hover:bg-ink-100"
              )}
            >
              <Phone className="size-4 text-brand-500" />
              {BUSINESS_RULES.phoneDisplay}
            </a>
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={
                    darkChrome
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : undefined
                  }
                >
                  <Link href="/account">
                    <UserRound />
                    Account
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/trips">My trips</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOtpOpen(true)}
                  className={
                    darkChrome
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : undefined
                  }
                >
                  Sign in
                </Button>
                <Button asChild size="sm">
                  <Link href="/cars">Book a ride</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <a
              href={`tel:${BUSINESS_RULES.phoneE164}`}
              aria-label="Call TranzCars"
              className={cn(
                "grid size-11 place-items-center rounded-full text-brand-500",
                darkChrome
                  ? "border border-white/20 bg-white/10"
                  : "border border-hairline bg-surface"
              )}
            >
              <Phone className="size-[18px]" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={cn(
                "grid size-11 place-items-center rounded-full",
                darkChrome
                  ? "border border-white/20 bg-white/10 text-white"
                  : "border border-hairline bg-surface text-ink-900"
              )}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          "fixed inset-0 z-[70] md:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink-950/40 backdrop-blur-[3px] transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto rounded-b-[var(--radius-3xl)] bg-surface px-5 pb-8 pt-4 transition-transform duration-[420ms] ease-[var(--ease-out-quint)]",
            menuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full bg-ink-100 text-ink-700"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/cars"
              onClick={() => setMenuOpen(false)}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-hairline bg-surface-sunken p-4"
            >
              <Car className="size-5 text-brand-500" />
              <span className="text-sm font-bold">Self-drive cars</span>
            </Link>
            <Link
              href="/cars?category=bike"
              onClick={() => setMenuOpen(false)}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-hairline bg-surface-sunken p-4"
            >
              <Bike className="size-5 text-brand-500" />
              <span className="text-sm font-bold">Bikes & scooters</span>
            </Link>
          </div>

          <nav className="mt-4 flex flex-col" aria-label="Mobile">
            {[
              { href: "/trips", label: "My trips", icon: Ticket },
              { href: "/account", label: "Account", icon: UserRound },
              ...NAV.filter((n) => !["Cars", "Bikes"].includes(n.label)).map(
                (n) => ({ href: n.href, label: n.label, icon: undefined })
              ),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-hairline py-4 text-[15px] font-semibold text-ink-900 last:border-b-0"
              >
                <span className="flex items-center gap-3">
                  {item.icon ? (
                    <item.icon className="size-4 text-ink-400" />
                  ) : null}
                  {item.label}
                </span>
                <ChevronRight className="size-4 text-ink-300" />
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="flex items-center justify-between rounded-[var(--radius-lg)] bg-surface-sunken px-4 py-3">
                  <div>
                    <p className="text-sm font-bold">
                      {user.name || "Signed in"}
                    </p>
                    <p className="text-xs text-ink-500">
                      {user.mobile ? `+91 ${user.mobile}` : user.email || "Signed in"}
                    </p>
                  </div>
                  <Badge tone="success" size="sm">
                    Verified
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  block
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  <LogOut />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  block
                  onClick={() => {
                    setMenuOpen(false);
                    setOtpOpen(true);
                  }}
                >
                  Sign in
                </Button>
                <a
                  href={`tel:${BUSINESS_RULES.phoneE164}`}
                  className="text-center text-sm font-semibold text-ink-500"
                >
                  or call {BUSINESS_RULES.phoneDisplay}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <OtpDialog open={otpOpen} onOpenChange={setOtpOpen} />
    </>
  );
}
