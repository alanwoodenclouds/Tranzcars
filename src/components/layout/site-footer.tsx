"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { toast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/logo";
import { MvdBadge } from "@/components/layout/mvd-badge";

const COLUMNS = [
  {
    title: "Fleet",
    links: [
      { href: "/cars", label: "All vehicles" },
      { href: "/cars?category=car", label: "Self-drive cars" },
      { href: "/cars?category=bike", label: "Bikes & scooters" },
      { href: "/cars?transmission=Automatic", label: "Automatic cars" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/destinations", label: "Destinations" },
      { href: "/about", label: "About TranzCars" },
      { href: "/faq", label: "Help & FAQ" },
      { href: "/trips", label: "My trips" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/terms-and-conditions", label: "Terms of service" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/cancellation-policy", label: "Cancellation" },
      { href: "/refund-policy", label: "Refunds" },
    ],
  },
];

export function SiteFooter() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? BUSINESS_RULES.phoneE164;
  const [email, setEmail] = useState("");

  function onJoin(e: React.FormEvent) {
    e.preventDefault();
    toast("You’re on the list — journey notes are on the way.", "success");
    setEmail("");
  }

  return (
    <footer className="relative mt-16 overflow-hidden bg-ink-950 text-ink-300 sm:mt-24 md:pb-0">
      {/* Atmosphere — brand wash + road grid, not flat black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_10%_-10%,rgba(248,120,0,0.22),transparent_55%),radial-gradient(ellipse_60%_40%_at_90%_0%,rgba(248,120,0,0.08),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
      />
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07] mask-fade-b"
      />

      <div className="container-page relative">
        {/* Brand + newsletter — one composition */}
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16 lg:py-16">
          <div>
            <Logo variant="wordmark" plate={false} className="mb-7" />
            <p className="text-eyebrow text-brand-300">
              Self-drive · Kerala · Since {BUSINESS_RULES.foundedYear}
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(1.85rem,3.4vw,2.5rem)] font-extrabold leading-[1.06] tracking-[-0.032em] text-white">
              Rent a car.
              <span className="text-brand-400"> Drive better.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-400">
              MVD-approved cars and bikes across Kerala.{" "}
              {BUSINESS_RULES.kmPerDay} free km a day, Cochin Airport delivery
              included.
            </p>
          </div>

          <div className="lg:pb-1">
            <p className="text-sm font-semibold text-white">
              Kerala road notes, once a month
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
              Drive routes, monsoon tips, member rates. No spam.
            </p>
            <form
              onSubmit={onJoin}
              className="mt-5 flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="h-12 min-w-0 flex-1 border-white/15 bg-white/[0.05] text-white placeholder:text-ink-500 hover:border-white/25 focus:border-brand-400"
              />
              <Button type="submit" size="lg" className="h-12 w-full shrink-0 sm:w-auto">
                Join
                <ArrowRight />
              </Button>
            </form>
          </div>
        </div>

        {/* Contact — one job: reach the desk */}
        <div className="border-b border-white/10 py-10">
          <p className="text-eyebrow text-ink-500">Talk to Kochi</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`tel:${BUSINESS_RULES.phoneE164}`}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500/25">
                <Phone className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  Primary
                </span>
                <span className="mt-0.5 block truncate font-display text-base font-bold text-white">
                  {BUSINESS_RULES.phoneDisplay}
                </span>
              </span>
            </a>

            <a
              href={`tel:${BUSINESS_RULES.phoneAltE164}`}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500/25">
                <Phone className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  Alternate
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-ink-200">
                  {BUSINESS_RULES.phoneAltDisplay}
                </span>
              </span>
            </a>

            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500/25">
                <MessageCircle className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  WhatsApp
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-ink-200">
                  Message a booking agent
                </span>
              </span>
            </a>

            <a
              href={`mailto:${BUSINESS_RULES.email}`}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500/25">
                <Mail className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  Email
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-ink-200">
                  {BUSINESS_RULES.email}
                </span>
              </span>
            </a>
          </div>

          <p className="mt-5 inline-flex max-w-2xl items-start gap-2.5 text-sm leading-relaxed text-ink-500">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
            <span>
              <Link
                href="/contact"
                className="font-medium text-ink-300 transition-colors hover:text-white"
              >
                Visit or write
              </Link>
              {" · "}
              {BUSINESS_RULES.addressLine}
            </span>
          </p>
        </div>

        {/* Site map */}
        <div className="grid gap-10 py-12 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-eyebrow text-ink-500">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-300 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal bar */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-7 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between md:pb-7">
          <p className="text-xs leading-snug text-ink-500">
            © {new Date().getFullYear()} {BUSINESS_RULES.brandLegalName}.
            <span className="mt-0.5 block sm:mt-0 sm:inline">
              {" "}
              Self-drive rentals, Kerala.
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <MvdBadge tone="onDark" size="sm" />
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TranzCars on Instagram"
              className="grid size-9 place-items-center rounded-full border border-white/10 text-ink-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="size-[16px]"
              >
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.6" cy="6.4" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
