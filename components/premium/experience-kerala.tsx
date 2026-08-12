"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { MEDIA } from "@/content/media";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";

const DESTINATIONS = [
  {
    name: "Munnar",
    line: "Tea estates and misty hairpins",
    drive: "4h from Kochi",
    image: MEDIA.destinations.munnar,
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    name: "Alleppey",
    line: "Backwaters at golden hour",
    drive: "1h 30m",
    image: MEDIA.destinations.alleppey,
    span: "",
  },
  {
    name: "Wayanad",
    line: "Forests, falls, open roads",
    drive: "5h",
    image: MEDIA.destinations.wayanad,
    span: "",
  },
  {
    name: "Kozhikode",
    line: "Coastal drives and city ease",
    drive: "3h 30m",
    image: MEDIA.destinations.kozhikode,
    span: "sm:col-span-2",
  },
];

export function ExperienceKerala() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Where people go"
            title="Kerala is best on your own schedule."
            description="Four drives our travellers book again and again — each one easy in a day or a weekend."
          />
        </Reveal>

        <div className="mt-10 grid auto-rows-[200px] gap-4 sm:grid-cols-3 sm:auto-rows-[220px]">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.06} className={d.span}>
              <Link
                href="/cars"
                className="group relative block h-full overflow-hidden rounded-[var(--radius-xl)] bg-ink-100"
              >
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent" />

                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  <Clock3 className="size-3" />
                  {d.drive}
                </span>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-white">
                      {d.name}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-white/75">{d.line}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-brand-500">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
