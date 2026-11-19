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
          // Keep content readable on first paint (no opacity:0 flash on mobile).
          initial: { opacity: 1, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.55,
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

      <div className="container-page relative flex min-h-[min(88svh,820px)] flex-col justify-between gap-10 pb-10 pt-8 sm:min-h-[min(86svh,760px)] sm:justify-end sm:gap-0 sm:pb-0 sm:pt-16">
        <motion.div {...fade()} className="min-w-0 max-w-2xl sm:pb-12">
          <MvdBadge size="banner" tone="onDark" />

          <p className="text-eyebrow mt-5 flex items-center gap-2 text-brand-300 sm:mt-6">
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-brand-400"
            />
            About TranzCars
          </p>

          <h1 className="text-hero mt-3 text-white">
            Kerala&apos;s self-drive company,
            <br className="hidden sm:block" /> built for the open road.
          </h1>

          <p className="text-lead-on-dark mt-4 max-w-md">
            Govt-approved since {BUSINESS_RULES.foundedYear}. Kochi
            headquarters. Keys waiting at the airport, railway, or your door.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/cars">
                Browse the fleet
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15 hover:text-white sm:w-auto"
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
              <dd className="text-numeric font-display text-[1.5rem] font-extrabold tracking-tight text-white sm:text-4xl">
                {s.value}
              </dd>
              <p className="text-meta mt-1.5 break-words text-white/70">
                {s.label}
              </p>
            </div>
          ))}
        </motion.dl>
      </div>
    </header>
  );
}
