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

const PANEL_SHAPE = [
  "flex-[0.86] lg:my-7",
  "flex-[1.16] lg:my-2",
  "flex-[1] lg:my-0",
];

export function ImmersiveHero({ branches }: { branches: Branch[] }) {
  const reduce = useReducedMotion();
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section className="relative isolate -mt-16 overflow-hidden pt-16 sm:-mt-[72px] sm:pt-[72px]">
      <div aria-hidden className="absolute inset-0 bg-aurora" />
      <div
        aria-hidden
        className="bg-grid mask-fade-b absolute inset-x-0 top-0 h-[560px] opacity-60 sm:h-[720px]"
      />

      <div className="container-page relative">
        <div className="grid items-start gap-6 pt-6 sm:gap-8 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pt-12">
          {/* Brand + images */}
          <motion.div {...fade()} className="min-w-0">
            <div className="relative z-10 text-center lg:text-left">
              <h1 className="text-hero">
                Drive your journey.
                <br />
                Your way.
              </h1>

              <p className="text-lead mx-auto mt-3 max-w-md sm:mt-4 lg:mx-0">
                Premium self-drive cars and bikes for every Kerala trip —
                airport delivery, {BUSINESS_RULES.kmPerDay} km free/day, MVD
                approved.
              </p>
            </div>

            {/* Collage: compact on mobile, full on desktop */}
            <motion.div
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: {
                      duration: 0.8,
                      delay: 0.12,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  })}
              className="relative mt-5 hidden h-[160px] overflow-hidden sm:mt-8 sm:block sm:h-[240px] lg:h-[360px]"
            >
              <div className="absolute inset-0 flex items-stretch gap-2 sm:gap-3.5">
                {MEDIA.heroPanels.map((panel, i) => (
                  <Link
                    key={panel.id}
                    href={panel.href}
                    aria-label={panel.alt}
                    className={cn(
                      "group relative focus-visible:outline-none",
                      PANEL_SHAPE[i],
                      i === 2 && "hidden sm:block"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 block overflow-hidden rounded-[20px] bg-ink-100 shadow-e3 sm:rounded-[26px] lg:rounded-[34px]",
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
                          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 24vw"
                          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.06]"
                        />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Booking */}
          <motion.div
            {...fade(0.08)}
            id="booking-console"
            className="relative z-10 w-full max-w-none sm:mx-auto sm:max-w-[420px] lg:mx-0 lg:ml-auto lg:max-w-[440px]"
          >
            <BookingConsole branches={branches} />
          </motion.div>
        </div>

        <div className="no-scrollbar -mx-1 mt-5 flex items-center gap-2 overflow-x-auto px-1 pb-10 sm:mt-8 sm:pb-12 lg:pb-14">
          <span className="shrink-0 text-[12px] font-semibold text-ink-400 sm:text-[12.5px]">
            Popular:
          </span>
          {POPULAR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900 sm:px-3.5 sm:text-[12.5px]"
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
