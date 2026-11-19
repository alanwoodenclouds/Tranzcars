"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { toast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/logo";

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
    title: "Company",
    links: [
      { href: "/about", label: "About TranzCars" },
      { href: "/faq", label: "Help & FAQ" },
      { href: "/contact", label: "Contact us" },
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
    <footer className="mt-24 bg-ink-900 pb-16 text-ink-300 md:pb-0">
      <div className="container-page">
        {/* Newsletter / CTA band */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg">
            <h2 className="text-display-sm text-white">
              Kerala road notes, once a month.
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-400">
              Drive routes, monsoon tips and member-only rates. No spam, ever.
            </p>
          </div>
          <form
            onSubmit={onJoin}
            className="flex w-full max-w-md items-center gap-2"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-12 border-white/15 bg-white/[0.06] text-white placeholder:text-ink-500 hover:border-white/25 focus:border-brand-400"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0">
              Join
              <ArrowRight />
            </Button>
          </form>
        </div>

        {/* Links */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo variant="full" plate={false} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              MVD-approved self-drive cars and bikes across Kerala since{" "}
              {BUSINESS_RULES.foundedYear}. {BUSINESS_RULES.kmPerDay} free km a
              day, airport delivery included.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${BUSINESS_RULES.phoneE164}`}
                className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-white transition-colors hover:text-brand-300"
              >
                <Phone className="size-4 text-brand-400" />
                {BUSINESS_RULES.phoneDisplay}
              </a>
              <a
                href={`tel:${BUSINESS_RULES.phoneAltE164}`}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-ink-300 transition-colors hover:text-white"
              >
                <Phone className="size-4 text-brand-400" />
                {BUSINESS_RULES.phoneAltDisplay}
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-ink-300 transition-colors hover:text-white"
              >
                <MessageCircle className="size-4 text-brand-400" />
                WhatsApp a booking agent
              </a>
              <p className="inline-flex items-start gap-2.5 text-sm leading-relaxed text-ink-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
                {BUSINESS_RULES.addressLine}
              </p>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-eyebrow text-ink-500">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-ink-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center gap-5 border-t border-white/10 py-7 sm:flex-row sm:justify-between">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} TranzCars. Self-drive rentals, Kerala.
          </p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold text-ink-300">
              <ShieldCheck className="size-3.5 text-brand-400" />
              MVD approved
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TranzCars on Instagram"
              className="text-ink-400 transition-colors hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="size-[18px]"
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
