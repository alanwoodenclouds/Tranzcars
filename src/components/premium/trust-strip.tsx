"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BUSINESS_RULES } from "@/content/site";
import { MvdBadge } from "@/components/layout/mvd-badge";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  {
    label: "Google rating",
    value: BUSINESS_RULES.googleRating,
    suffix: "/5",
    decimals: 1,
  },
  { label: "Travellers served", value: 25, suffix: "K+", decimals: 0 },
  { label: "Free km per day", value: BUSINESS_RULES.kmPerDay, suffix: "", decimals: 0 },
  { label: "Licensed since", value: BUSINESS_RULES.foundedYear, suffix: "", decimals: 0 },
];

export function TrustStrip() {
  return (
    <section className="section-y-sm">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-[var(--radius-2xl)] bg-ink-900 px-5 py-8 sm:px-10 sm:py-12">
            <dl className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:gap-4">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="lg:border-l lg:border-white/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                >
                  <dd className="text-numeric font-display text-[1.85rem] font-extrabold leading-none text-white sm:text-[2.75rem]">
                    <AnimatedNumber
                      value={stat.value}
                      decimals={stat.decimals}
                      delay={i * 0.08}
                    />
                    <span className="text-brand-400">{stat.suffix}</span>
                  </dd>
                  <dt className="text-meta mt-2 text-white/70">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
              <MvdBadge size="md" />
              <p className="text-caption text-white/70 sm:text-right">
                Comprehensive insurance included · 24/7 roadside assistance
                across Kerala
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AnimatedNumber({
  value,
  decimals,
  delay = 0,
}: {
  value: number;
  decimals: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start - delay * 1000) / duration);
      if (t < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, delay, reduce]);

  return (
    <motion.span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
    </motion.span>
  );
}
