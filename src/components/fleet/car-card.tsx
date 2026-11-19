"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cog, Fuel, Gauge, Users } from "lucide-react";
import type { Car } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TripScheduleDialog } from "@/components/booking/trip-schedule-dialog";
import { useBookingStore } from "@/store/useBookingStore";
import { isSearchComplete } from "@/store/useBookingsStore";
import { formatINR } from "@/utils";

export function CarCard({ car, priority }: { car: Car; priority?: boolean }) {
  const isBike = car.category === "bike";
  const router = useRouter();
  const search = useBookingStore((s) => s.search);
  const setSearch = useBookingStore((s) => s.setSearch);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const tripReady = isSearchComplete(search);

  function remember() {
    setSearch({
      selectedCarSlug: car.slug,
      selectedCarId: car.id,
      ...(car.category ? { category: car.category } : {}),
    });
  }

  function goDetail() {
    remember();
    router.push(`/cars/${car.slug}`);
  }

  function onSelect() {
    remember();
    if (tripReady) {
      goDetail();
      return;
    }
    setScheduleOpen(true);
  }

  const specs = [
    { icon: Users, label: isBike ? `${car.seats} rider${car.seats > 1 ? "s" : ""}` : `${car.seats} seats` },
    { icon: Cog, label: car.transmission },
    { icon: Fuel, label: car.fuel },
    { icon: Gauge, label: `${car.kmPerDay} km/day` },
  ];

  return (
    <article className="group interactive relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface shadow-e1 hover:-translate-y-1 hover:border-ink-200 hover:shadow-e3">
      <Link
        href={`/cars/${car.slug}`}
        onClick={remember}
        className="relative block aspect-[16/11] overflow-hidden bg-ink-100"
      >
        <Image
          src={car.image}
          alt={`${car.name} self-drive ${isBike ? "bike" : "car"} rental in Kochi`}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge tone="dark" size="sm">
            {isBike ? "Bike" : car.type}
          </Badge>
          {car.popular ? (
            <Badge tone="brand" size="sm" className="bg-brand-500 text-white">
              Popular
            </Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          <Link href={`/cars/${car.slug}`} onClick={remember}>
            <h3 className="text-title transition-colors group-hover:text-brand-600">
              {car.name}
            </h3>
          </Link>
          {car.tripHint ? (
            <p className="text-caption mt-1">{car.tripHint}</p>
          ) : null}

          <ul className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-2">
            {specs.map((spec) => (
              <li
                key={spec.label}
                className="text-caption flex items-center gap-1.5 font-medium text-ink-600"
              >
                <spec.icon className="size-3.5 shrink-0 text-ink-400" />
                <span className="truncate">{spec.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-hairline pt-4">
          <div>
            <p className="text-numeric font-display text-xl font-extrabold text-ink-900">
              {formatINR(car.pricePerDay)}
              <span className="text-caption font-semibold text-ink-500">
                {" "}
                / day
              </span>
            </p>
            <p className="text-caption text-ink-400">Fuel excluded</p>
          </div>
          <Button size="sm" onClick={onSelect} className="relative z-10">
            {tripReady ? "Select" : "Set dates"}
          </Button>
        </div>
      </div>

      <TripScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        carName={car.name}
        continueLabel="Continue to vehicle"
        onContinue={() => {
          setScheduleOpen(false);
          goDetail();
        }}
      />
    </article>
  );
}
