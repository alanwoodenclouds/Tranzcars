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
        className="bg-grid mask-fade-b absolute inset-x-0 top-0 h-[720px] opacity-60"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-8 pt-8 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-12">
          {/* ------------------------------------------------ left: image + brand copy */}
          <motion.div {...fade()} className="order-2 lg:order-1">
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

            <motion.div
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, x: -28 },
                    animate: { opacity: 1, x: 0 },
                    transition: {
                      duration: 0.9,
                      delay: 0.1,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  })}
              className="relative mt-8 h-[240px] sm:h-[300px] lg:h-[380px]"
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
          </motion.div>

          {/* ------------------------------------------------ right: booking card */}
          <motion.div
            {...fade(0.1)}
            id="booking-console"
            className="relative z-10 order-1 mx-auto w-full max-w-[420px] lg:order-2 lg:mx-0 lg:ml-auto lg:max-w-[440px]"
          >
            <BookingConsole branches={branches} />
          </motion.div>
        </div>

        <div className="no-scrollbar mt-8 flex items-center gap-2 overflow-x-auto pb-12 lg:pb-14">
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
