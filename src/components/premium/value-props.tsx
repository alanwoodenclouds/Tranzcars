"use client";

import { Gauge, Headphones, MapPinned, ShieldCheck } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { RevealItem, RevealStagger } from "@/components/motion/reveal";

const PROPS = [
  {
    icon: ShieldCheck,
    title: "MVD approved",
    body: `Licensed self-drive since ${BUSINESS_RULES.foundedYear}. Insurance and paperwork sorted before you arrive.`,
  },
  {
    icon: Gauge,
    title: `${BUSINESS_RULES.kmPerDay} free km daily`,
    body: "Real Kerala distances, no nickel-and-diming. Extra km billed at a flat, published rate.",
  },
  {
    icon: MapPinned,
    title: "Delivered to you",
    body: "Cochin airport, railway stations, our branches, or your doorstep across Kochi.",
  },
  {
    icon: Headphones,
    title: "24/7 road support",
    body: "One number for breakdowns, extensions and route advice — answered by humans.",
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
                <h3 className="mt-5 font-display text-[17px] font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
                  {item.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
