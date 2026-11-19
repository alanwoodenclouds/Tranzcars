"use client";

import { useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";

function Stars({ size = 3.5 }: { size?: number }) {
  return (
    <span className="flex gap-0.5 text-brand-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="fill-current"
          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
        />
      ))}
    </span>
  );
}

function TestimonialCard({
  t,
  className,
}: {
  t: Testimonial;
  className?: string;
}) {
  return (
    <blockquote
      className={`flex h-full flex-col rounded-[var(--radius-xl)] border border-hairline bg-surface p-6 ${className ?? ""}`}
    >
      <Stars />
      <p className="text-title mt-4 leading-snug">“{t.title}”</p>
      <p className="text-body-sm mt-3 line-clamp-5 flex-1">{t.body}</p>
      <footer className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
        <span className="text-caption grid size-10 place-items-center rounded-full bg-ink-100 font-bold text-ink-700">
          {t.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <cite className="text-caption font-bold not-italic text-ink-900">
            {t.name}
          </cite>
          <p className="text-caption">Verified traveller</p>
        </div>
      </footer>
    </blockquote>
  );
}

function TestimonialTrack({
  items,
  ariaHidden,
}: {
  items: Testimonial[];
  ariaHidden?: boolean;
}) {
  return (
    <ul
      className="flex shrink-0 gap-4 pr-4"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((t) => (
        <li key={`${ariaHidden ? "dup" : "live"}-${t.id}`} className="h-full">
          <TestimonialCard
            t={t}
            className="w-[300px] shrink-0 sm:w-[340px]"
          />
        </li>
      ))}
    </ul>
  );
}

export function PremiumTestimonials({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();

  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Travellers"
            title="Reviewed by people who actually drove."
            action={
              <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-hairline bg-surface px-4 py-3">
                <Stars size={4} />
                <div>
                  <p className="text-caption font-bold text-ink-900">
                    {BUSINESS_RULES.googleRating}/5 on Google
                  </p>
                  <p className="text-caption">
                    {BUSINESS_RULES.googleReviewCount} reviews
                  </p>
                </div>
              </div>
            }
          />
        </Reveal>
      </div>

      {reduce || items.length === 0 ? (
        <div className="container-page mt-10">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <li key={t.id} className="h-full">
                <TestimonialCard t={t} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="group/marquee relative mt-10 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16"
          />

          <div className="flex w-max animate-marquee-testimonials group-hover/marquee:[animation-play-state:paused]">
            <TestimonialTrack items={items} />
            <TestimonialTrack items={items} ariaHidden />
          </div>
        </div>
      )}
    </section>
  );
}
