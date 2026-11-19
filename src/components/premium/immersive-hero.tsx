"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { BookingConsole } from "@/components/premium/booking-console";
import { MvdBadge } from "@/components/layout/mvd-badge";
import { Button } from "@/components/ui/button";

const POPULAR = [
  {
    label: "Cochin Airport self-drive",
    href: "/cars?pickup=cok-airport",
  },
  {
    label: "Automatic cars Kochi",
    href: "/cars?transmission=Automatic&category=car",
  },
  { label: "7-seater family MUV", href: "/cars?type=MUV" },
  { label: "Electric scooter rental", href: "/cars?category=bike" },
];

export function ImmersiveHero({ branches }: { branches: Branch[] }) {
  const reduce = useReducedMotion();
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      className="relative isolate -mt-16 overflow-hidden bg-ink-950 pt-16 text-white sm:-mt-[72px] sm:pt-[72px] lg:min-h-[100svh]"
      aria-labelledby="hero-heading"
    >
      {/* Full-bleed fleet photography */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        {...(reduce
          ? {}
          : {
              initial: { scale: 1.06 },
              animate: { scale: 1 },
              transition: { duration: 8, ease: [0.22, 1, 0.36, 1] },
            })}
      >
        <Image
          src={MEDIA.heroFullBleed}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_45%] sm:object-[60%_40%]"
        />
      </motion.div>

      {/* Readable dark overlays — keep the car visible on the right */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/70 to-ink-950/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_12%_25%,rgba(248,120,0,0.2),transparent_58%)]"
      />

      <div className="container-page relative flex flex-col pb-8 pt-8 sm:pb-12 sm:pt-12 lg:min-h-[calc(100svh-72px)] lg:justify-center lg:pb-14 lg:pt-16">
        <div className="grid items-start gap-7 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-12">
          <motion.div {...fade()} className="max-w-xl">
            <div className="mb-3.5 sm:mb-4">
              <MvdBadge size="banner" tone="onDark" />
            </div>

            <h1
              id="hero-heading"
              className="text-hero text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
            >
              Kerala&apos;s top-rated
              <br />
              self-drive car rental.
            </h1>

            <p className="text-lead-on-dark mt-3 max-w-md sm:mt-3.5">
              Cars and bikes in Kochi — Cochin Airport pickup,{" "}
              {BUSINESS_RULES.kmPerDay} km free every day, transparent pricing
              since {BUSINESS_RULES.foundedYear}.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15 hover:text-white"
              >
                <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                  <Phone />
                  {BUSINESS_RULES.phoneDisplay}
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            {...(reduce
              ? fade(0.1)
              : {
                  initial: { opacity: 0, y: 36 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: 0.75,
                    delay: 0.14,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                })}
            id="booking-console"
            className="relative z-10 w-full sm:mx-auto sm:max-w-[440px] lg:mx-0 lg:ml-auto lg:max-w-[460px]"
          >
            <BookingConsole
              branches={branches}
              className="shadow-[0_32px_80px_-28px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
            />
          </motion.div>
        </div>

        <nav
          aria-label="Popular self-drive searches"
          className="no-scrollbar mt-5 flex items-center gap-2 overflow-x-auto pb-1 sm:mt-7"
        >
          <span className="text-caption shrink-0 font-semibold text-white/70">
            Popular:
          </span>
          {POPULAR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-caption shrink-0 rounded-full border border-white/20 bg-ink-950/55 px-3 py-1.5 font-semibold text-white shadow-e1 backdrop-blur-sm transition-colors hover:border-brand-400/50 hover:bg-ink-950/75 sm:px-3.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

export { ImmersiveHero as Hero };
