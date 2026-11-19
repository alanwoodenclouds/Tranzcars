"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { getFeaturedDestinations } from "@/content/destinations";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";

const DESTINATIONS = getFeaturedDestinations();

export function ExperienceKerala() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Trip planning"
            title="Pick a place. We’ll match the car."
            description="Popular Kerala drives from Kochi — drive time, trip length, and the right self-drive vehicle for each route."
            action={
              <Button asChild variant="outline">
                <Link href="/destinations">All destinations</Link>
              </Button>
            }
          />
        </Reveal>

        <div className="mt-10 grid auto-rows-[180px] gap-3 sm:grid-cols-3 sm:auto-rows-[220px] sm:gap-4">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.06} className={d.span}>
              <Link
                href={`/destinations/${d.slug}`}
                className="group relative block h-full overflow-hidden rounded-[var(--radius-xl)] bg-ink-100"
              >
                <Image
                  src={d.image}
                  alt={`${d.name} self-drive trip from Kochi`}
                  fill
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/90 to-transparent"
                />

                <span className="text-caption absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950/80 px-2.5 py-1.5 font-bold text-white ring-1 ring-white/15 backdrop-blur-md">
                  <Clock3 className="size-3.5 text-brand-400" />
                  {d.drive}
                </span>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <h3 className="text-title-lg text-white">
                      {d.name}
                    </h3>
                    <p className="text-caption mt-1 text-white/90">
                      {d.line}
                    </p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink-900 transition-colors group-hover:bg-brand-500 group-hover:text-white">
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
