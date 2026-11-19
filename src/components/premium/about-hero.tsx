"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { MvdBadge } from "@/components/layout/mvd-badge";
import { Button } from "@/components/ui/button";

const YEARS = new Date().getFullYear() - BUSINESS_RULES.foundedYear;

const STATS = [
  { value: `${YEARS}+`, label: "Years in Kerala" },
  {
    value: BUSINESS_RULES.fleetSizeLabel,
    label: `${BUSINESS_RULES.fleetVariantsLabel} variants`,
  },
  { value: `${BUSINESS_RULES.kmPerDay}`, label: "Free km every day" },
  { value: "24×7", label: "Desk on the phone" },
];

export function AboutHero() {
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
    <header className="relative isolate -mt-16 overflow-hidden bg-ink-950 pt-16 text-white sm:-mt-[72px] sm:pt-[72px]">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        {...(reduce
          ? {}
          : {
              initial: { scale: 1.06 },
              animate: { scale: 1 },
              transition: { duration: 7.5, ease: [0.22, 1, 0.36, 1] },
            })}
      >
        <Image
          src={MEDIA.keralaRoadCar}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_42%]"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-950/55 to-ink-950/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_18%,rgba(248,120,0,0.22),transparent_58%)]"
      />

      <div className="container-page relative flex min-h-[min(88svh,820px)] flex-col justify-between gap-10 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-10 sm:min-h-[min(86svh,760px)] sm:justify-end sm:gap-0 sm:pb-0 sm:pt-16">
        <motion.div {...fade()} className="max-w-2xl sm:pb-12">
          <MvdBadge size="banner" tone="onDark" />

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-300 sm:mt-6">
            About TranzCars
          </p>

          <h1 className="text-hero mt-3 text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            Kerala&apos;s self-drive company,
            <br className="hidden sm:block" /> built for the open road.
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75 sm:text-[16.5px]">
            Govt-approved since {BUSINESS_RULES.foundedYear}. Kochi
            headquarters. Keys waiting at the airport, railway, or your door.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
            <Button asChild size="lg">
              <Link href="/cars">
                Browse the fleet
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15 hover:text-white"
            >
              <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                <Phone />
                Talk to us
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.dl
          {...fade(0.18)}
          className="grid grid-cols-2 gap-px border-t border-white/10 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-ink-950/45 px-2 py-5 text-center backdrop-blur-sm sm:px-3 sm:py-8"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-numeric font-display text-[1.75rem] font-extrabold tracking-tight text-white sm:text-4xl">
                {s.value}
              </dd>
              <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/50 sm:text-[11px]">
                {s.label}
              </p>
            </div>
          ))}
        </motion.dl>
      </div>
    </header>
  );
}
