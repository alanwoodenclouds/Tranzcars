"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { cn } from "@/utils";

const PLANS = [
  {
    name: "Explorer",
    price: "Pay as you go",
    desc: "Full fleet access at transparent daily rates.",
    perks: [
      `${BUSINESS_RULES.kmPerDay} free km each day`,
      "Airport & railway pickup",
      "Standard roadside assist",
      "OTP checkout in minutes",
    ],
    cta: "Browse the fleet",
    href: "/cars",
    featured: false,
  },
  {
    name: "Voyager",
    price: "Weekly member",
    desc: "Priority vehicles, flexible swaps and member rates.",
    perks: [
      "Priority fleet allocation",
      "Free home delivery in Kochi",
      "Weekend rate locks",
      `${BUSINESS_RULES.seniorDiscountPercent}% senior · ${BUSINESS_RULES.ladyDiscountPercent}% lady discount`,
    ],
    cta: "Talk to us",
    href: "/contact",
    featured: true,
  },
  {
    name: "Signature",
    price: "Corporate",
    desc: "For teams that need reliable cars across Kerala.",
    perks: [
      "Centralised monthly billing",
      "Dedicated coordinator",
      "Multi-city coverage",
      "SLA-backed replacements",
    ],
    cta: "Request access",
    href: "/contact",
    featured: false,
  },
];

export function Membership() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Membership"
            title="Drive more, decide less."
            description="Book a single trip or set up standing access for your family, team or long stay."
          />
        </Reveal>

        <RevealStagger className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <RevealItem key={plan.name} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-[var(--radius-2xl)] p-7",
                  plan.featured
                    ? "bg-ink-900 text-white shadow-e4 lg:-my-3 lg:py-10"
                    : "border border-hairline bg-surface shadow-e1"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={cn(
                      "text-eyebrow",
                      plan.featured ? "text-ink-400" : "text-ink-500"
                    )}
                  >
                    {plan.name}
                  </p>
                  {plan.featured ? (
                    <Badge tone="brand" size="sm" className="bg-brand-500 text-white">
                      Most popular
                    </Badge>
                  ) : null}
                </div>

                <h3
                  className={cn(
                    "text-title-lg mt-4",
                    plan.featured && "text-white"
                  )}
                >
                  {plan.price}
                </h3>
                <p
                  className={cn(
                    "text-body-sm mt-2",
                    plan.featured ? "text-white/75" : "text-ink-500"
                  )}
                >
                  {plan.desc}
                </p>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="text-body-sm flex items-start gap-2.5">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          plan.featured ? "text-brand-400" : "text-jade-500"
                        )}
                        strokeWidth={2.5}
                      />
                      <span
                        className={
                          plan.featured ? "text-white/90" : "text-ink-700"
                        }
                      >
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  block
                  size="lg"
                  variant={plan.featured ? "primary" : "outline"}
                  className="mt-8"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
