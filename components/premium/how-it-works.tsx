"use client";

import Link from "next/link";
import { CalendarCheck, CarFront, KeyRound } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Set your trip",
    body: `Choose pick-up and drop-off points, dates and times. Minimum ${BUSINESS_RULES.minRentalHours} hours — no sign-in needed to look around.`,
  },
  {
    icon: CarFront,
    title: "Pick your ride",
    body: "Filter by transmission, seats or budget. Every price you see already includes free km and insurance.",
  },
  {
    icon: KeyRound,
    title: "Verify & drive",
    body: "One OTP, licence check at handover, and the keys are yours. Delivery to the airport or your door.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from landing to driving."
            description="A booking flow built for travellers, not paperwork."
            action={
              <Button asChild variant="outline">
                <Link href="/cars">Start a booking</Link>
              </Button>
            }
          />
        </Reveal>

        <RevealStagger className="relative mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <RevealItem key={step.title}>
              <div className="relative h-full overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface p-6 sm:p-7">
                <span
                  aria-hidden
                  className="text-numeric absolute right-5 top-4 font-display text-5xl font-extrabold text-ink-100"
                >
                  {i + 1}
                </span>
                <span className="relative grid size-12 place-items-center rounded-[var(--radius-md)] bg-ink-900 text-white">
                  <step.icon className="size-5" />
                </span>
                <h3 className="relative mt-6 font-display text-lg font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="relative mt-2.5 text-[14px] leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
