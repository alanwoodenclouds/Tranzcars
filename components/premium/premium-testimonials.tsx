"use client";

import { Star } from "lucide-react";
import type { Testimonial } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
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

export function PremiumTestimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Travellers"
            title="Reviewed by people who actually drove."
            action={
              <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-hairline bg-surface px-4 py-3 shadow-e1">
                <Stars size={4} />
                <div>
                  <p className="text-sm font-bold text-ink-900">
                    {BUSINESS_RULES.googleRating}/5 on Google
                  </p>
                  <p className="text-[12px] text-ink-500">
                    {BUSINESS_RULES.googleReviewCount} reviews
                  </p>
                </div>
              </div>
            }
          />
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <RevealItem key={t.id} className="h-full">
              <blockquote className="flex h-full flex-col rounded-[var(--radius-xl)] border border-hairline bg-surface p-6">
                <Stars />
                <p className="mt-4 font-display text-[17px] font-bold leading-snug tracking-tight text-ink-900">
                  “{t.title}”
                </p>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-500">
                  {t.body}
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                  <span className="grid size-10 place-items-center rounded-full bg-ink-100 text-[13px] font-bold text-ink-700">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <cite className="text-[13.5px] font-bold not-italic text-ink-900">
                      {t.name}
                    </cite>
                    <p className="text-[12px] text-ink-500">
                      Verified traveller
                    </p>
                  </div>
                </footer>
              </blockquote>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
