"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Quote } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

const POINTS = [
  {
    title: "Government-approved",
    body: `Kerala Govt Approved self-drive operator since ${BUSINESS_RULES.foundedYear}, fully licensed.`,
  },
  {
    title: `${BUSINESS_RULES.kmPerDay} km free every day`,
    body: "Transparent excess-km rates — no surprise line items at hand-over.",
  },
  {
    title: "Airport & doorstep",
    body: "Cochin Airport, railway stations and home delivery across South India.",
  },
  {
    title: "Deposit back in 7 days",
    body: `Refundable security deposit returned within ${BUSINESS_RULES.refundWorkingDays} working days of a clean return.`,
  },
];

export function WhyTranzCars() {
  return (
    <section id="why" className="section-y">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-eyebrow mb-3">Why TranzCars</p>
            <h2 className="text-display-md">
              Rental, minus the
              <br />
              small print.
            </h2>
            <p className="text-lead mt-4 max-w-md">
              We built TranzCars because renting a car in Kerala used to mean
              queues, hidden charges and a deposit you had to chase.
            </p>

            <ul className="mt-9 space-y-5">
              {POINTS.map((point) => (
                <li key={point.title} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-jade-50 text-jade-600">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-ink-900">
                      {point.title}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Button asChild className="mt-9">
              <Link href="/about">Read our story</Link>
            </Button>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[var(--radius-2xl)] bg-ink-100 shadow-e2">
              <Image
                src={MEDIA.keralaRoadCar}
                alt="Toyota Innova Hycross self-drive — TranzCars Kochi"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 92vw, 46vw"
              />
            </div>

            <div className="relative z-10 mx-4 -mt-14 rounded-[var(--radius-xl)] border border-hairline bg-surface p-6 shadow-e3 sm:mx-8">
              <Quote className="size-6 text-brand-300" />
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink-800">
                “We booked Thar Roxx for Munnar and Vagamon. Car was so clean,
                documents hassle-free, and Vineesh arranged everything on time.
                10/10.”
              </p>
              <p className="mt-4 text-[12.5px] font-bold uppercase tracking-[0.1em] text-ink-500">
                Karthikeyan M S
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
