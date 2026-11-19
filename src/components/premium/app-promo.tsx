"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Check,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { MvdBadge } from "@/components/layout/mvd-badge";

const REASONS = [
  "Government-approved & fully licensed self-drive operator",
  `${BUSINESS_RULES.kmPerDay} km of free driving every day`,
  "24×7 roadside support and assistance",
  "Doorstep delivery + Cochin Airport & railway station pickup",
  "Automatic & manual, petrol & diesel options",
  "Transparent pricing with no hidden charges",
  "Headquartered in Kochi with pan-Kerala coverage and delivery/drop-off anywhere in South India",
];

const FIELDS = [
  { icon: MapPin, label: "Pickup Location", value: "Cochin Airport (COK)" },
  { icon: MapPin, label: "Drop-off Location", value: "Select drop-off city" },
  {
    icon: CalendarRange,
    label: "Pickup Date & Time",
    value: "Thu, 19 Nov · 10:00",
  },
  {
    icon: CalendarRange,
    label: "Drop-off Date & Time",
    value: "Sat, 21 Nov · 10:00",
  },
];

/** Phone mockup + “why choose us” — live HTML UI, not a flat screenshot. */
export function AppPromo() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            {/* Left visual */}
            <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
              {/* Soft backdrop plate */}
              <div className="absolute inset-y-6 left-0 w-[72%] overflow-hidden rounded-[28px] bg-ink-900 shadow-e3 sm:inset-y-10 sm:rounded-[32px]">
                <Image
                  src="/images/fleet/maruti-fronx.png"
                  alt=""
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 1024px) 60vw, 28vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/50" />
              </div>

              {/* Phone */}
              <div className="relative ml-auto w-[min(100%,270px)] sm:w-[290px]">
                <div className="relative overflow-hidden rounded-[40px] border-[8px] border-ink-950 bg-ink-950 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
                  {/* Notch */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black"
                  />

                  {/* App chrome */}
                  <div className="relative bg-ink-900 pt-9">
                    <div className="flex items-center justify-center px-4 pb-3">
                      <Image
                        src="/brand/tranzcars-wordmark.png"
                        alt="TranzCars"
                        width={140}
                        height={24}
                        className="h-5 w-auto object-contain"
                      />
                    </div>

                    <div className="relative mx-3 aspect-[16/11] overflow-hidden rounded-2xl">
                      <Image
                        src="/images/fleet/tata-punch.png"
                        alt="Tata Punch self-drive"
                        fill
                        className="object-cover"
                        sizes="270px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
                    </div>

                    <div className="relative -mt-8 rounded-t-[26px] bg-white px-4 pb-5 pt-5">
                      <p className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-ink-900">
                        Let’s find your{" "}
                        <span className="text-brand-500">perfect car</span>
                      </p>

                      <div className="mt-4 space-y-2">
                        {FIELDS.map((field) => (
                          <div
                            key={field.label}
                            className="flex items-center gap-2.5 rounded-xl border border-hairline bg-ink-50/80 px-3 py-2.5"
                          >
                            <field.icon className="size-4 shrink-0 text-brand-500" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-ink-400">
                                {field.label}
                              </p>
                              <p className="truncate text-[12.5px] font-semibold text-ink-800">
                                {field.value}
                              </p>
                            </div>
                            <ChevronRight className="size-4 shrink-0 text-ink-300" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link
                          href="/cars"
                          className="grid size-12 place-items-center rounded-full bg-brand-500 text-white shadow-brand transition-transform hover:scale-105"
                          aria-label="Search cars"
                        >
                          <ArrowRight className="size-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reasons */}
            <div>
              <MvdBadge className="mb-5" />
              <h2 className="text-display-md">
                Why customers choose{" "}
                <span className="text-brand-500">TranzCars</span>
              </h2>
              <p className="text-lead mt-3 max-w-lg">
                Kerala Govt Approved self-drive since {BUSINESS_RULES.foundedYear} —
                clean cars, honest km, and a desk that picks up the phone.
              </p>

              <ul className="mt-8 space-y-3.5">
                {REASONS.map((reason) => (
                  <li key={reason} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-[14.5px] font-medium leading-snug text-ink-700">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/cars">Browse the fleet</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/about">Our story</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
