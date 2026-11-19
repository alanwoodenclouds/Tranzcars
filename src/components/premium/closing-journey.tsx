"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function ClosingJourney() {
  return (
    <section className="section-y-sm" aria-labelledby="closing-heading">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-3xl)] border border-hairline bg-surface px-6 py-14 text-center sm:px-10 sm:py-20">
            <div aria-hidden className="absolute inset-0 bg-aurora" />
            <div
              aria-hidden
              className="absolute inset-0 bg-grid mask-fade-b opacity-40"
            />

            <div className="relative">
              <p className="text-eyebrow">Self-drive rental Kochi</p>
              <h2 id="closing-heading" className="text-display-lg mx-auto mt-4 max-w-2xl">
                Start your Kerala self-drive trip today.
              </h2>
              <p className="text-lead mx-auto mt-4 max-w-lg">
                Browse cars and bikes without signing in. Cochin Airport delivery,
                {` ${BUSINESS_RULES.kmPerDay} `}
                free km/day, and OTP only when you confirm payment.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/cars">
                    Find a self-drive car
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                    <Phone />
                    {BUSINESS_RULES.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
