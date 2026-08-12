"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function ClosingJourney() {
  return (
    <section className="section-y-sm">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-3xl)] border border-hairline bg-surface px-6 py-14 text-center sm:px-10 sm:py-20">
            <div aria-hidden className="absolute inset-0 bg-aurora" />
            <div
              aria-hidden
              className="absolute inset-0 bg-grid mask-fade-b opacity-40"
            />

            <div className="relative">
              <p className="text-eyebrow">Ready when you are</p>
              <h2 className="text-display-lg mx-auto mt-4 max-w-2xl">
                Your Kerala trip starts with a search.
              </h2>
              <p className="text-lead mx-auto mt-4 max-w-md">
                Cars and bikes, browsable without an account. OTP only when you
                pay.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/cars">
                    Find a vehicle
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
