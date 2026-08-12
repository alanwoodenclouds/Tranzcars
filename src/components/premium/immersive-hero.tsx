"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { BookingConsole } from "@/components/premium/booking-console";
import { cn } from "@/utils";

const POPULAR = [
  { label: "Cochin airport pickup", href: "/cars?pickup=cok-airport" },
  { label: "Automatic hatchbacks", href: "/cars?transmission=Automatic" },
  { label: "7-seater for family", href: "/cars?type=MUV" },
  { label: "Electric scooters", href: "/cars?category=bike" },
];

/** Flex ratio + vertical inset per collage panel, left to right. */
const PANEL_SHAPE = [
  "flex-[0.86] lg:my-7",
  "flex-[1.16] lg:my-2",
  "flex-[1] lg:my-0",
];

const AVATAR_TONES = ["bg-brand-600", "bg-brand-500", "bg-brand-300"];

export function ImmersiveHero({ branches }: { branches: Branch[] }) {
  const reduce = useReducedMotion();
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section className="relative isolate -mt-16 overflow-hidden pt-16 sm:-mt-[72px] sm:pt-[72px]">
      <div aria-hidden className="absolute inset-0 bg-aurora" />
      <div
        aria-hidden
        className="bg-grid mask-fade-b absolute inset-x-0 top-0 h-[640px] opacity-60"
      />

      <div className="container-page relative">
        <div className="grid items-end gap-8 pt-8 sm:pt-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6 lg:pt-12">
          {/* ------------------------------------------------ copy */}
          <motion.div {...fade()} className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 py-1.5 pl-2.5 pr-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-600 backdrop-blur">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-brand-500"
              />
              Kochi · Kerala · Since {BUSINESS_RULES.foundedYear}
            </span>

            <h1 className="text-hero mt-5">
              Drive your journey.
              <br />
              Your way.
            </h1>

            <p className="text-lead mt-4 max-w-md">
              Premium self-drive cars and bikes for every Kerala trip — airport
              delivery, {BUSINESS_RULES.kmPerDay} km free/day, MVD approved.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-3">
                <span className="flex -space-x-2.5">
                  {AVATAR_TONES.map((tone) => (
                    <span
                      key={tone}
                      aria-hidden
                      className={cn(
                        "size-8 rounded-full ring-[2.5px] ring-white",
                        tone
                      )}
                    />
                  ))}
                </span>
                <span>
                  <span className="text-numeric block text-[15px] font-extrabold text-ink-900">
                    {BUSINESS_RULES.googleRating}/5
                  </span>
                  <span className="block text-[12px] text-ink-500">
                    {BUSINESS_RULES.googleReviewCount} travellers
                  </span>
                </span>
              </div>

              <span aria-hidden className="hidden h-9 w-px bg-hairline sm:block" />

              <span>
                <span className="text-numeric block text-[15px] font-extrabold text-ink-900">
                  ₹1,499
                  <span className="text-[12px] font-semibold text-ink-500">
                    /day
                  </span>
                </span>
                <span className="block text-[12px] text-ink-500">
                  Starting price, all-inclusive
                </span>
              </span>
            </div>
          </motion.div>

          {/* ------------------------------------------------ slanted collage */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, x: 40 },
                  animate: { opacity: 1, x: 0 },
                  transition: {
                    duration: 0.9,
                    delay: 0.08,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                })}
            className={cn(
              "relative -mr-5 h-[220px] sm:-mr-8 sm:h-[280px]",
              "lg:-ml-10 lg:mr-0 lg:h-[420px] lg:w-[calc(100%_+_2.5rem_+_2.5rem_+_max(0px,(100vw_-_1280px)/2)_+_4vw)]"
            )}
          >
            <div className="absolute inset-0 flex items-stretch gap-2.5 sm:gap-3.5">
              {MEDIA.heroPanels.map((panel, i) => (
                <Link
                  key={panel.id}
                  href={panel.href}
                  aria-label={panel.alt}
                  className={cn(
                    "group relative focus-visible:outline-none",
                    PANEL_SHAPE[i]
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 block overflow-hidden rounded-[26px] bg-ink-100 shadow-e3 lg:rounded-[34px]",
                      "[transform:skewX(-9deg)]",
                      "transition-shadow duration-300 group-hover:shadow-e4",
                      "group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-ring"
                    )}
                  >
                    <span className="absolute inset-y-0 -left-[32%] -right-[32%] block [transform:skewX(9deg)]">
                      <Image
                        src={panel.src}
                        alt=""
                        fill
                        priority={i < 2}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 24vw"
                        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.06]"
                      />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------ primary booking */}
        <motion.div
          {...fade(0.12)}
          id="booking-console"
          className="relative z-10 mt-8 lg:-mt-10"
        >
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                Book your trip
              </p>
              <p className="mt-0.5 text-[13px] text-ink-500">
                Pick location and dates — browse fleet instantly.
              </p>
            </div>
            <Link
              href="#how-it-works"
              className="text-[13px] font-semibold text-ink-500 underline-offset-4 hover:text-ink-900 hover:underline"
            >
              How it works
            </Link>
          </div>
          <div className="rounded-[calc(var(--radius-2xl)+4px)] bg-gradient-to-br from-brand-500/25 via-brand-400/10 to-transparent p-[3px] shadow-e4">
            <BookingConsole
              branches={branches}
              className="border-brand-200/60 shadow-none"
            />
          </div>
        </motion.div>

        <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-12 lg:pb-14">
          <span className="shrink-0 text-[12.5px] font-semibold text-ink-400">
            Popular:
          </span>
          {POPULAR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ImmersiveHero as Hero };
