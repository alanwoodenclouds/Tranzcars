import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CarFront, Phone } from "lucide-react";
import { SearchHydrator } from "@/components/booking/search-hydrator";
import { CarCard } from "@/components/fleet/car-card";
import { FleetFilters, FleetToolbar } from "@/components/fleet/fleet-filters";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  JsonLd,
  breadcrumbJsonLd,
  fleetItemListJsonLd,
} from "@/components/seo/json-ld";
import { BUSINESS_RULES } from "@/content/site";
import type { Car } from "@/content/site";
import { getCars } from "@/lib/api/server";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Self-drive cars & bikes for rent in Kochi",
  description:
    "Browse TranzCars self-drive fleet in Kochi & Kerala — hatchbacks, SUVs, Innova, Thar, electric scooters. 120 km free/day, airport delivery, book with OTP.",
  path: "/cars",
  keywords: [
    "self drive cars Kochi",
    "bike rental Kerala",
    "SUV rental Kochi",
    "Innova rental Kochi",
    "electric scooter rental Kochi",
    "self drive car hire Cochin Airport",
  ],
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const str = (v: string | string[] | undefined) =>
  typeof v === "string" ? v : undefined;

function sortCars(cars: Car[], sort?: string) {
  const list = [...cars];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "price-desc":
      return list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "seats-desc":
      return list.sort((a, b) => b.seats - a.seats);
    default:
      return list.sort(
        (a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular))
      );
  }
}

export default async function CarsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = str(params.category);
  const sort = str(params.sort);

  const cars = await getCars({
    transmission: str(params.transmission),
    type: str(params.type),
    category,
    q: str(params.q),
  });

  const results = sortCars(cars, sort);

  const heading =
    category === "bike"
      ? "Bikes & scooters"
      : category === "car"
        ? "Self-drive cars"
        : "The TranzCars fleet";

  return (
    <div className="container-page pb-20 pt-6 sm:pt-8">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Fleet", path: "/cars" },
          ]),
          fleetItemListJsonLd(results),
        ]}
      />
      <Suspense fallback={null}>
        <SearchHydrator />
      </Suspense>

      <PageHeading
        eyebrow="Kochi · Kerala"
        title={heading}
        description={`Every price includes ${BUSINESS_RULES.kmPerDay} free km a day and insurance.`}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[264px_1fr] lg:gap-10">
        <Suspense fallback={null}>
          <FleetFilters />
        </Suspense>

        <div>
          <Suspense
            fallback={<Skeleton className="h-9 w-full max-w-sm rounded-full" />}
          >
            <FleetToolbar count={results.length} />
          </Suspense>

          {results.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-ink-100 text-ink-400">
                <CarFront className="size-6" />
              </span>
              <h2 className="text-display-sm mt-5">
                Nothing matches those filters
              </h2>
              <p className="text-body-sm mt-2 max-w-sm">
                Try widening the vehicle type or transmission. Our team can also
                arrange something specific for your dates.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/cars">Clear filters</Link>
                </Button>
                <Button asChild>
                  <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                    <Phone />
                    Call us
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((car, i) => (
                <CarCard key={car.id} car={car} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
