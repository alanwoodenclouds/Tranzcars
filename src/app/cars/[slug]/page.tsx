import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronLeft,
  Cog,
  Fuel,
  Gauge,
  IdCard,
  Luggage,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingPanel } from "@/components/booking/booking-panel";
import { CarCard } from "@/components/fleet/car-card";
import {
  JsonLd,
  breadcrumbJsonLd,
  carProductJsonLd,
} from "@/components/seo/json-ld";
import { BUSINESS_RULES, CARS } from "@/content/site";
import { getCarBySlug, getCars, getSettings } from "@/lib/api/server";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CARS.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Vehicle not found", robots: { index: false } };
  const kind = car.category === "bike" ? "bike" : "car";
  const description = `Rent the ${car.name} self-drive ${kind} in Kochi from ₹${car.pricePerDay}/day — ${car.transmission}, ${car.seats} seats, ${car.kmPerDay} free km a day. Airport delivery available.`;
  return buildPageMetadata({
    title: `Rent ${car.name} in Kochi`,
    description,
    path: `/cars/${car.slug}`,
    image: car.image,
    keywords: [
      `${car.name} rental Kochi`,
      `self drive ${car.name}`,
      `${car.type} rental Kerala`,
      `${kind} rental Kochi Airport`,
    ],
  });
}

export default async function CarDetailPage({ params }: Props) {
  const { slug } = await params;
  const [car, settings] = await Promise.all([getCarBySlug(slug), getSettings()]);
  if (!car) notFound();

  const isBike = car.category === "bike";
  const related = (await getCars({ category: car.category }))
    .filter((c) => c.slug !== car.slug)
    .slice(0, 3);

  const specs = [
    { icon: Cog, label: "Transmission", value: car.transmission },
    {
      icon: Users,
      label: isBike ? "Riders" : "Seats",
      value: String(car.seats),
    },
    { icon: Fuel, label: "Fuel", value: car.fuel },
    { icon: Gauge, label: "Free km / day", value: String(car.kmPerDay) },
  ];

  return (
    <div className="container-page pb-20 pt-6">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Fleet", path: "/cars" },
            { name: car.name, path: `/cars/${car.slug}` },
          ]),
          carProductJsonLd(car),
        ]}
      />
      <Link
        href={isBike ? "/cars?category=bike" : "/cars"}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
      >
        <ChevronLeft className="size-4" />
        Back to fleet
      </Link>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-[var(--radius-2xl)] bg-ink-100">
            <Image
              src={car.image}
              alt={`${car.name} self-drive ${isBike ? "bike" : "car"} for rent in Kochi, Kerala`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-x-4 top-4 flex gap-2">
              <Badge tone="dark">{isBike ? "Bike" : car.type}</Badge>
              {car.popular ? (
                <Badge className="bg-brand-500 text-white">Popular choice</Badge>
              ) : null}
            </div>
          </div>

          <div className="mt-7">
            <h1 className="text-display-lg">{car.name}</h1>
            <p className="text-lead mt-3 max-w-xl">
              {car.tripHint
                ? `${car.tripHint}. `
                : ""}
              {car.kmPerDay} km included every day, insurance and 24/7 roadside
              assistance built into the price.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-hairline sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-surface p-4 sm:p-5">
                <spec.icon className="size-[18px] text-brand-500" />
                <dt className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-ink-900">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          {car.features.length ? (
            <section className="mt-10">
              <h2 className="font-display text-xl font-bold tracking-tight">
                What&apos;s on board
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <li
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-[13px] font-semibold text-ink-700"
                  >
                    <Sparkles className="size-3.5 text-brand-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
              <IdCard className="size-5 text-brand-500" />
              <h3 className="mt-3 font-display text-[15px] font-bold">
                What to bring
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                Original driving licence held {BUSINESS_RULES.licenceYears}+ years
                and Aadhaar or passport. Minimum age{" "}
                {BUSINESS_RULES.eligibilityAge}+ (per rental terms).
              </p>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
              <Luggage className="size-5 text-brand-500" />
              <h3 className="mt-3 font-display text-[15px] font-bold">
                Fuel & returns
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                Return at the same fuel level you received. Extra km beyond{" "}
                {car.kmPerDay}/day is billed at a published flat rate.
              </p>
            </div>
          </section>
        </div>

        <BookingPanel car={car} deliveryCharge={settings.delivery_charge} />
      </div>

      {related.length ? (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-display-sm">
              Other {isBike ? "bikes" : "cars"} you might like
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={isBike ? "/cars?category=bike" : "/cars?category=car"}>
                See all
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CarCard key={item.id} car={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
