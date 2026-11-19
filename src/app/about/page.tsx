import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BRANCHES, BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { AboutHero } from "@/components/premium/about-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About TranzCars — Kerala Govt Approved self-drive",
  description:
    "TranzCars is Kerala’s top-rated self-drive car rental — Govt Approved since 2017, Kochi HQ, 100+ vehicles, Cochin Airport delivery across South India.",
  path: "/about",
});

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
    title: "Licensed in Kochi",
    body: "Second licensed self-drive operator in Kerala — a joint venture of 10 leading travel operators under Trust Pilot Trans & Trades Pvt Ltd.",
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
    body: "Pick-up in Kochi, Trivandrum and Kozhikode — plus home delivery in our service areas.",
  },
];

const PRESENCE = [
  {
    city: "Kochi",
    line: "HQ · Airport · Railway",
    image: MEDIA.destinations.alleppey,
  },
  {
    city: "Trivandrum",
    line: "South Kerala pick-ups",
    image: MEDIA.destinations.munnar,
  },
  {
    city: "Kozhikode",
    line: "Malabar coast desk",
    image: MEDIA.destinations.kozhikode,
  },
];

export default function AboutPage() {
  const airports = BRANCHES.filter((b) => b.type === "airport").length;

  return (
    <>
      <AboutHero />

      <section className="section-y">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-eyebrow mb-3 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-brand-400"
              />
              Our story
            </p>
            <h2 className="text-display-md max-w-[18ch]">
              Built by people who drive these roads every week.
            </h2>
            <div className="text-body mt-5 space-y-4">
              <p>
                Freedom to drive Kerala on your own terms — in a safe,
                well-maintained car, without a chauffeur watching the clock or a
                padded bill at the end.
              </p>
              <p>
                {BUSINESS_RULES.fleetSizeLabel} vehicles across{" "}
                {BUSINESS_RULES.fleetVariantsLabel} variants,{" "}
                {BUSINESS_RULES.kmPerDay} km free every day, and a desk that still
                picks up at 2 a.m. when your flight lands.
              </p>
              <p>
                Headquartered in Kochi. Pickup at Cochin Airport and railway
                stations. Delivery across South India — {airports} airport desks
                plus doorstep options, and we still answer the phone 24/7.
              </p>
            </div>

            <p className="text-body-sm mt-6 max-w-md border-l-2 border-brand-400 pl-4">
              {BUSINESS_RULES.ownership}.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Badge tone="jade">MVD approved</Badge>
              <Badge tone="brand">Airport delivery</Badge>
              <Badge tone="neutral">Kochi · TVM · Kozhikode</Badge>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-3xl)] bg-ink-100 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={MEDIA.heroFullBleed}
                alt="Maruti Suzuki Fronx self-drive — TranzCars Kochi"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-title-lg text-white">
                  Hand-over in minutes.
                </p>
                <p className="text-body-sm mt-1.5 max-w-sm text-white">
                  Documents, photos and fuel level confirmed together before you
                  drive away.
                </p>
              </div>
            </div>

            <div className="absolute -left-3 top-8 hidden max-w-[200px] rounded-[var(--radius-xl)] border border-hairline bg-surface p-4 sm:block lg:-left-6">
              <p className="text-numeric font-display text-2xl font-extrabold text-ink-900">
                {BUSINESS_RULES.googleRating}
                <span className="text-brand-500">/5</span>
              </p>
              <p className="text-meta mt-1">
                {BUSINESS_RULES.googleReviewCount} Google reviews
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-surface-sunken">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four things we refuse to compromise on."
            description="Promises our Kochi desk is measured against — every single trip."
          />

          <RevealStagger className="mt-12 grid gap-0 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <RevealItem key={v.title}>
                <div
                  className={`flex gap-4 border-hairline py-7 sm:gap-5 sm:px-6 sm:py-8 ${
                    i % 2 === 0 ? "sm:border-r" : ""
                  } ${i < 2 ? "border-b" : ""} ${i >= 2 ? "sm:border-t-0" : ""}`}
                >
                  <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-brand-50 text-brand-600">
                    <v.icon className="size-5" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-title">{v.title}</h3>
                    <p className="text-body-sm mt-2 text-ink-600">{v.body}</p>
                  </div>
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
            title="How we got here."
            description={`From the second licence in Kerala to a fleet that covers the whole state.`}
          />

          <ol className="relative mt-12 space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0">
            <span
              aria-hidden
              className="absolute left-[15px] top-3 hidden h-[calc(100%-24px)] w-px bg-hairline sm:block lg:left-0 lg:top-4 lg:h-px lg:w-full"
            />
            {TIMELINE.map((t, i) => (
              <li key={t.title} className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
                <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-ink-900 text-[12px] font-bold text-white lg:mt-0">
                  {i + 1}
                </span>
                <div className="lg:mt-6">
                  <p className="text-numeric text-title text-brand-600">
                    {t.year}
                  </p>
                  <h3 className="text-title mt-1">{t.title}</h3>
                  <p className="text-body-sm mt-2">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y-sm">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Where we operate"
              title="Three cities. One phone number."
              description="Pick up where your trip starts — or we bring the car to you."
              action={
                <Button asChild variant="outline">
                  <Link href="/contact">
                    <MapPin />
                    Find a desk
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-3">
            {PRESENCE.map((p) => (
              <RevealItem key={p.city}>
                <Link
                  href="/cars"
                  className="group relative block aspect-[5/4] overflow-hidden rounded-[var(--radius-2xl)] bg-ink-100"
                >
                  <Image
                    src={p.image}
                    alt={`${p.city} — TranzCars pick-up`}
                    fill
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/90 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <h3 className="text-title-lg text-white">
                        {p.city}
                      </h3>
                      <p className="text-caption mt-1 text-white/90">{p.line}</p>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink-900 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>
    </>
  );
}
