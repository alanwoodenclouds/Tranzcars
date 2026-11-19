import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  Clock3,
  Lightbulb,
  MapPin,
  Route,
  Users,
} from "lucide-react";
import { DESTINATIONS, getDestination } from "@/content/destinations";
import { BUSINESS_RULES } from "@/content/site";
import { CarCard } from "@/components/fleet/car-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { getCars } from "@/lib/api/server";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Destination not found", robots: { index: false } };
  return buildPageMetadata({
    title: `${destination.name} self-drive trip from Kochi`,
    description: `${destination.summary} Drive ${destination.drive}, plan ${destination.suggestedDays}, rent a car that fits.`,
    path: `/destinations/${destination.slug}`,
    image: destination.image,
    keywords: [
      `${destination.name} self drive`,
      `${destination.name} car rental Kochi`,
      `rent a car for ${destination.name}`,
      "Kerala road trip",
    ],
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const cars = await getCars({ category: "car" });
  const featured = destination.featuredCarSlugs
    .map((s) => cars.find((c) => c.slug === s))
    .filter(Boolean);
  const typeMatched = cars.filter(
    (c) =>
      destination.recommendedTypes.includes(c.type) &&
      !destination.featuredCarSlugs.includes(c.slug)
  );
  const recommended = [...featured, ...typeMatched].filter(Boolean).slice(0, 3);
  const others = DESTINATIONS.filter((d) => d.slug !== destination.slug).slice(0, 3);

  return (
    <div className="pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name: destination.name, path: `/destinations/${destination.slug}` },
        ])}
      />

      <div className="relative isolate -mt-16 min-h-[min(70svh,640px)] overflow-hidden bg-ink-950 pt-16 sm:-mt-[72px] sm:min-h-[58vh] sm:pt-[72px]">
        <Image
          src={destination.image}
          alt={`${destination.name} — self-drive from Kochi`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/25" />

        <div className="container-page relative flex min-h-[min(70svh,640px)] flex-col justify-end pb-10 pt-8 sm:min-h-[calc(58vh-72px)] sm:pb-14 sm:pt-10">
          <Link
            href="/destinations"
            className="text-caption mb-6 inline-flex w-fit items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-300"
          >
            <ChevronLeft className="size-4" />
            All destinations
          </Link>

          <div className="flex flex-wrap gap-2">
            <Badge tone="dark" className="bg-white/15 text-white backdrop-blur">
              <Clock3 className="size-3.5" />
              {destination.drive}
            </Badge>
            <Badge tone="dark" className="bg-white/15 text-white backdrop-blur">
              <CalendarDays className="size-3.5" />
              {destination.suggestedDays}
            </Badge>
            <Badge className="bg-brand-500 text-white">Rent a car · Kochi</Badge>
          </div>

          <h1 className="text-hero mt-5 max-w-3xl text-white">
            {destination.name}
          </h1>
          <p className="text-lead-on-dark mt-4 max-w-2xl sm:mt-5">
            {destination.summary}
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/cars">
                <CarFront />
                Choose a car for this trip
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
            >
              <a href="#itinerary">See trip plan</a>
            </Button>
          </div>
        </div>
      </div>

      <section className="border-b border-hairline bg-surface-sunken">
        <div className="container-page grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
          {[
            { icon: Clock3, label: "Drive time", value: destination.drive },
            { icon: Route, label: "Distance", value: `${destination.distanceKm} km` },
            { icon: CalendarDays, label: "Suggested", value: destination.suggestedDays },
            { icon: Users, label: "Best for", value: destination.bestFor },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 bg-surface-sunken px-4 py-5 sm:px-6 sm:py-6"
            >
              <span className="text-meta inline-flex items-center gap-1.5 text-ink-400">
                <stat.icon className="size-3.5 text-brand-500" />
                {stat.label}
              </span>
              <span className="text-title-lg break-words text-ink-900">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Why this drive"
              title={`Self-drive ${destination.name} from Kochi`}
              description={destination.vehicleTip}
            />

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {destination.highlights.map((h) => (
                <li
                  key={h}
                  className="text-body-sm flex items-start gap-3 rounded-[var(--radius-lg)] border border-hairline bg-surface px-4 py-3.5 font-medium text-ink-700"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600">
                    <Check className="size-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div id="itinerary" className="mt-12 scroll-mt-28">
              <h2 className="text-display-sm">Suggested trip plan</h2>
              <p className="text-body-sm mt-2 max-w-xl">
                Built around a typical TranzCars rental — pick up in Kochi or at
                the airport, drive yourself, hand back when you return.
              </p>

              <ol className="mt-7 space-y-4">
                {destination.itinerary.map((stop, i) => (
                  <li
                    key={stop.day}
                    className="relative flex gap-4 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-950 font-display text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-meta text-brand-600">{stop.day}</p>
                      <h3 className="text-title mt-0.5">{stop.title}</h3>
                      <p className="text-body-sm mt-1.5 text-ink-600">
                        {stop.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-5 lg:pt-2">
            <div className="rounded-[var(--radius-2xl)] border border-hairline bg-surface p-6">
              <p className="text-eyebrow flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-px w-6 bg-brand-400"
                />
                Rent for this trip
              </p>
              <h2 className="text-display-sm mt-2">Match the car to the roads</h2>
              <p className="text-body-sm mt-2">{destination.vehicleTip}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {destination.recommendedTypes.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
              <ul className="text-body-sm mt-5 space-y-2.5">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  Pick up Kochi office, COK airport, or home delivery
                </li>
                <li className="flex gap-2">
                  <Route className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  {BUSINESS_RULES.kmPerDay} free km / day included
                </li>
              </ul>
              <Button asChild block className="mt-6" size="lg">
                <Link href="/cars">
                  Browse matching cars
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="rounded-[var(--radius-2xl)] border border-hairline bg-surface-sunken p-6">
              <div className="flex items-center gap-2 text-ink-900">
                <Lightbulb className="size-4 text-brand-500" />
                <h3 className="font-display text-base font-bold">Drive tips</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {destination.tips.map((tip) => (
                  <li key={tip} className="text-body-sm">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {recommended.length > 0 ? (
        <section className="section-y-sm border-t border-hairline bg-surface-sunken">
          <div className="container-page">
            <SectionHeading
              eyebrow="Recommended fleet"
              title={`Cars travellers pick for ${destination.name}`}
              description="Start with these — or open the full fleet and filter by type."
              action={
                <Button asChild variant="outline">
                  <Link href="/cars">Full fleet</Link>
                </Button>
              }
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recommended.map((car, i) =>
                car ? <CarCard key={car.id} car={car} priority={i === 0} /> : null
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-y-sm">
        <div className="container-page">
          <SectionHeading
            eyebrow="More trips"
            title="Other places to drive next"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group relative aspect-[16/11] overflow-hidden rounded-[var(--radius-xl)] bg-ink-100"
              >
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/15"
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-title text-white">
                    {d.name}
                  </p>
                  <p className="text-caption mt-0.5 text-white/90">{d.drive}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
