import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, CarFront, Clock3, Route } from "lucide-react";
import { DESTINATIONS } from "@/content/destinations";
import { PageHero } from "@/components/layout/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Kerala trip ideas — plan & rent a self-drive car",
  description:
    "Plan self-drive trips from Kochi to Munnar, Alleppey, Wayanad & Thekkady. See drive times, suggested days, and cars that fit each route.",
  path: "/destinations",
  keywords: [
    "Kerala road trip self drive",
    "Munnar car rental",
    "Alleppey day trip car",
    "Wayanad self drive",
    "rent a car Kochi trip",
  ],
});

export default function DestinationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
        ])}
      />

      <PageHero
        eyebrow="Trip planning · Rent a car"
        title="Where do you want to drive?"
        description="Choose a Kerala destination, see drive time and trip length, then pick a self-drive car that matches the roads — not a generic fleet dump."
      >
        <Button asChild size="lg">
          <Link href="/cars">
            <CarFront />
            Browse cars first
          </Link>
        </Button>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group interactive flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface shadow-e1 hover:-translate-y-1 hover:border-ink-200 hover:shadow-e3"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                  <Image
                    src={d.image}
                    alt={`${d.name} self-drive trip from Kochi`}
                    fill
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
                    <Badge tone="dark" size="sm">
                      <Clock3 className="size-3" />
                      {d.drive}
                    </Badge>
                    <Badge tone="brand" size="sm" className="bg-brand-500 text-white">
                      {d.suggestedDays}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-title-lg text-ink-900">{d.name}</h2>
                      <p className="text-body-sm mt-1">{d.line}</p>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-700 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>

                  <p className="text-body-sm mt-3 line-clamp-2 text-ink-600">
                    {d.summary}
                  </p>

                  <div className="text-caption mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-hairline pt-4 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <Route className="size-3.5 text-brand-500" />
                      {d.distanceKm} km
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-brand-500" />
                      {d.suggestedDays}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CarFront className="size-3.5 text-brand-500" />
                      {d.recommendedTypes[0]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
