"use client";

import { Gauge, Headphones, MapPinned, ShieldCheck } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { RevealItem, RevealStagger } from "@/components/motion/reveal";

const PROPS = [
  {
    icon: ShieldCheck,
    title: "Kerala Govt / MVD approved",
    body: `Licensed self-drive Rent A Cab since ${BUSINESS_RULES.foundedYear}. Insurance and paperwork ready before you arrive.`,
  },
  {
    icon: Gauge,
    title: `${BUSINESS_RULES.kmPerDay} free km every day`,
    body: "Built for Kerala distances. Extra kilometres billed only at a flat, published rate.",
  },
  {
    icon: MapPinned,
    title: "Cochin Airport delivery",
    body: "Pickup at COK, railway stations, branches, or doorstep delivery across Kochi & South India.",
  },
  {
    icon: Headphones,
    title: "24/7 roadside support",
    body: "One Kerala number for breakdowns, extensions and route advice — answered by humans.",
  },
];

export function ValueProps() {
  return (
    <section className="section-y-sm">
      <div className="container-page">
        <RevealStagger className="grid gap-px overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map((item) => (
            <RevealItem key={item.title} className="bg-surface">
              <div className="h-full p-6 transition-colors hover:bg-brand-50/40">
                <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <item.icon className="size-[19px]" />
                </span>
                <h3 className="text-title mt-5">{item.title}</h3>
                <p className="text-body-sm mt-2">{item.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
