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
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingPanel } from "@/components/booking/booking-panel";
import { CarCard } from "@/components/fleet/car-card";
import { Reveal } from "@/components/motion/reveal";
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
    <div className="pb-20">
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

      <div className="container-page pt-5 sm:pt-6">
        <Link
          href={isBike ? "/cars?category=bike" : "/cars"}
          className="text-caption inline-flex items-center gap-1.5 font-semibold text-ink-600 transition-colors hover:text-ink-900"
        >
          <ChevronLeft className="size-4" />
          Back to fleet
        </Link>

        <div className="mt-4 grid gap-8 lg:mt-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.95fr)] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-0">
            <Reveal y={20}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] bg-ink-950 sm:aspect-[16/11]">
                <Image
                  src={car.image}
                  alt={`${car.name} self-drive ${isBike ? "bike" : "car"} for rent in Kochi, Kerala`}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent"
                />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="dark">{isBike ? "Bike" : car.type}</Badge>
                    {car.popular ? (
                      <Badge className="bg-brand-500 text-white">
                        Popular choice
                      </Badge>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[12.5px] font-bold text-white backdrop-blur-md ring-1 ring-white/15">
                    <ShieldCheck className="size-3.5" />
                    Insured
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-eyebrow text-brand-300">
                    Self-drive · Kochi
                  </p>
                  <h1 className="text-display-lg mt-2.5 text-white">{car.name}</h1>
                  <p className="text-body-sm mt-3 max-w-xl text-white/80">
                    {car.tripHint ? `${car.tripHint}. ` : ""}
                    {car.kmPerDay} km included every day — insurance and 24/7
                    roadside assistance in the rate.
                  </p>
                </div>
              </div>
            </Reveal>

            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-hairline sm:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-surface px-4 py-4 sm:px-5 sm:py-5">
                  <spec.icon className="size-[18px] text-brand-500" />
                  <dt className="text-meta mt-3">{spec.label}</dt>
                  <dd className="text-body mt-1 font-bold text-ink-900">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {car.features.length ? (
              <section className="mt-10">
                <h2 className="text-display-sm">What&apos;s on board</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {car.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-caption inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3.5 py-2 font-semibold text-ink-700"
                    >
                      <Sparkles className="size-3.5 text-brand-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-10 grid gap-0 overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface sm:grid-cols-2">
              <div className="border-b border-hairline p-5 sm:border-b-0 sm:border-r sm:p-6">
                <IdCard className="size-5 text-brand-500" />
                <h3 className="text-title mt-3">What to bring</h3>
                <p className="text-body-sm mt-2">
                  Original driving licence held {BUSINESS_RULES.licenceYears}+
                  years and Aadhaar or passport. Minimum age{" "}
                  {BUSINESS_RULES.eligibilityAge}+ (per rental terms).
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <Luggage className="size-5 text-brand-500" />
                <h3 className="text-title mt-3">Fuel & returns</h3>
                <p className="text-body-sm mt-2">
                  Return at the same fuel level you received. Extra km beyond{" "}
                  {car.kmPerDay}/day is billed at a published flat rate.
                </p>
              </div>
            </section>

            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[var(--radius-2xl)] bg-surface-sunken px-5 py-4 sm:px-6">
              <p className="text-body-sm min-w-0 flex-1 text-ink-600">
                Need this {isBike ? "bike" : "car"} at Cochin Airport tonight?
                The desk is open 24×7.
              </p>
              <Button asChild size="sm" variant="secondary">
                <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                  <Phone />
                  Call desk
                </a>
              </Button>
            </div>
          </div>

          <BookingPanel car={car} deliveryCharge={settings.delivery_charge} />
        </div>
      </div>

      {related.length ? (
        <section className="section-y-sm mt-10 border-t border-hairline bg-surface-sunken sm:mt-14">
          <div className="container-page">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <p className="text-eyebrow mb-2 flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-px w-6 bg-brand-400"
                  />
                  More from the fleet
                </p>
                <h2 className="text-display-sm min-w-0">
                  Other {isBike ? "bikes" : "cars"} you might like
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="self-start sm:self-auto"
              >
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
          </div>
        </section>
      ) : null}
    </div>
  );
}
