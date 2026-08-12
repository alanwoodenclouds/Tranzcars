import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Car,
  Gauge,
  HeartHandshake,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BRANCHES, BUSINESS_RULES, CARS } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "TranzCars is an MVD-approved self-drive car & bike rental company in Kochi, Kerala, operating since 2017.",
};

const YEARS = new Date().getFullYear() - BUSINESS_RULES.foundedYear;

const STATS = [
  { value: `${YEARS}+`, label: "Years on Kerala roads" },
  { value: `${CARS.length}`, label: "Cars & bikes in fleet" },
  { value: BUSINESS_RULES.googleReviewCount, label: "Google reviews" },
  { value: `${BUSINESS_RULES.googleRating}★`, label: "Average rating" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Legal, always",
    body: `MVD-authorised self-drive registration, valid insurance and a rental agreement you can show at any checkpoint in India.`,
  },
  {
    icon: Gauge,
    title: "Honest pricing",
    body: `${BUSINESS_RULES.kmPerDay} km free per day on cars, published excess-km rates, and no surprise line items at hand-over.`,
  },
  {
    icon: Sparkles,
    title: "Sanitised & serviced",
    body: "Every vehicle is cleaned, fuel-checked and inspected between trips — with photos shared before you drive off.",
  },
  {
    icon: HeartHandshake,
    title: "Humans on call",
    body: "A Kochi-based team answers the phone 24/7 for extensions, breakdowns and late-night airport landings.",
  },
];

const TIMELINE = [
  {
    year: `${BUSINESS_RULES.foundedYear}`,
    title: "Started in Kalamassery",
    body: "A joint venture of Kerala travel operators put four hatchbacks on self-drive rent.",
  },
  {
    year: "2019",
    title: "Airport delivery",
    body: "Cochin International Airport hand-over launched for late-night and early-morning flights.",
  },
  {
    year: "2022",
    title: "Two wheels added",
    body: "Scooters and motorcycles joined the fleet for backwater and hill-station riders.",
  },
  {
    year: "Today",
    title: "Across Kerala",
    body: `Pick-up points in Kochi, Trivandrum and Kozhikode plus home delivery in service areas.`,
  },
];

export default function AboutPage() {
  const airports = BRANCHES.filter((b) => b.type === "airport").length;

  return (
    <>
      <PageHero
        eyebrow="About TranzCars"
        title="Self-drive in Kerala, done the honest way."
        description={`We are a government-approved, MVD-authorised self-drive operator based in Kochi. Since ${BUSINESS_RULES.foundedYear} we have handed keys to travellers who would rather drive themselves through Kerala.`}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/cars">Browse the fleet</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Talk to us</Link>
          </Button>
        </div>
      </PageHero>

      <section className="hairline-b bg-surface">
        <div className="container-page grid grid-cols-2 gap-px overflow-hidden py-10 sm:grid-cols-4 sm:py-12">
          {STATS.map((s) => (
            <div key={s.label} className="px-2 text-center sm:px-4">
              <p className="text-numeric font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-[12.5px] font-medium text-ink-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-eyebrow mb-3">Our story</p>
            <h2 className="text-display-md">
              Built by people who drive these roads every week.
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-600">
              <p>
                TranzCars began as a small counter in Kalamassery with a simple
                promise: give travellers a clean, legal, well-maintained vehicle
                and get out of their way. No chauffeur watching the clock, no
                padded bills at the end of the trip.
              </p>
              <p>
                Today the fleet spans hatchbacks, sedans, SUVs and 7-seaters, plus
                electric scooters and motorcycles for riders who want the coast
                road to themselves. Cars include{" "}
                {BUSINESS_RULES.kmPerDay} km free per day; bikes carry
                model-specific free kilometres.
              </p>
              <p>
                We deliver to {airports} airports, two railway stations and your
                doorstep inside our service areas — and we still answer the phone
                ourselves.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Badge tone="jade">
                <BadgeCheck />
                MVD approved
              </Badge>
              <Badge tone="brand">
                <Plane />
                Airport delivery
              </Badge>
              <Badge tone="neutral">
                <Building2 />
                Kochi · Trivandrum · Kozhikode
              </Badge>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-3xl)] bg-ink-100 shadow-e3 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={CARS[0]?.image ?? "/images/cars/placeholder.jpg"}
                alt="A TranzCars self-drive vehicle ready for hand-over in Kochi"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[var(--radius-xl)] bg-white/90 p-4 backdrop-blur-md">
                <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
                  <Car className="size-4 text-brand-500" />
                  Hand-over in 10 minutes
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                  Documents, photos and fuel level confirmed together before you
                  drive away.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-surface-sunken">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four things we refuse to compromise on"
            description="These are the promises our Kochi desk is measured against, every single trip."
          />
          <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <div className="h-full rounded-[var(--radius-2xl)] border border-hairline bg-surface p-6 shadow-e1">
                  <span className="grid size-11 place-items-center rounded-[var(--radius-lg)] bg-brand-50 text-brand-600">
                    <v.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-bold tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                    {v.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Milestones"
            title="How we got here"
            align="center"
          />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t, i) => (
              <li key={t.title} className="relative">
                <span
                  aria-hidden
                  className="absolute left-0 top-3.5 hidden h-px w-full bg-hairline lg:block"
                />
                <span className="relative z-10 grid size-8 place-items-center rounded-full bg-ink-900 text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-numeric mt-4 font-display text-[15px] font-extrabold text-brand-600">
                  {t.year}
                </p>
                <h3 className="mt-1 font-display text-[16px] font-bold tracking-tight">
                  {t.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
                  {t.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y-sm">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[var(--radius-3xl)] bg-ink-900 px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="bg-grid absolute inset-0 opacity-[0.12]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready when your flight lands.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-300">
                Set your pick-up point and dates — we will have the keys, papers
                and a full tank waiting.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/cars">Find a ride</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                    {BUSINESS_RULES.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
