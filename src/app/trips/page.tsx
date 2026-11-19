"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowRight, CalendarRange, MapPin, Ticket } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  type BookingStatus,
  useBookingsStore,
} from "@/store/useBookingsStore";
import { formatINR } from "@/utils";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/section";
import { Segmented } from "@/components/ui/segmented";
import { SignInGate } from "@/components/auth/sign-in-gate";
import { StatusBadge } from "@/components/trips/status-badge";

const TABS: { value: BookingStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

function shortDate(value: string) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM");
  } catch {
    return value;
  }
}

export default function TripsPage() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingsStore((s) => s.bookings);
  const [tab, setTab] = useState<BookingStatus>("upcoming");

  const mine = useMemo(
    () =>
      user
        ? bookings.filter((b) =>
            user.mobile ? b.mobile === user.mobile : true
          )
        : [],
    [bookings, user]
  );
  const filtered = mine.filter((b) => b.status === tab);

  if (!user) {
    return (
      <SignInGate
        title="Your trips live here"
        description="Sign in to see upcoming rentals, past trips and receipts."
      />
    );
  }

  return (
    <div className="container-page pb-20 pt-8 sm:pt-10">
      <PageHeading
        eyebrow={user.name ? user.name : user.mobile || user.email || "Account"}
        title="My trips"
        action={
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/cars">
              Book another ride
              <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="mt-8">
        <Segmented
          aria-label="Trip status"
          value={tab}
          onChange={setTab}
          options={TABS}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-ink-100 text-ink-400">
            <Ticket className="size-6" />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">
            No {tab === "completed" ? "past" : tab} trips
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-500">
            {tab === "upcoming"
              ? "Once you book a car or bike it will show up here with pick-up details."
              : "Nothing to show in this tab yet."}
          </p>
          <Button asChild className="mt-6">
            <Link href="/cars">Find a ride</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((b) => (
            <li key={b.id}>
              <Link
                href={`/trips/${b.id}`}
                className="interactive group flex overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface hover:-translate-y-0.5"
              >
                <div className="relative w-28 shrink-0 bg-ink-100 sm:w-36">
                  <Image
                    src={b.carImage}
                    alt={b.carName}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-[16px] font-bold leading-snug tracking-tight transition-colors group-hover:text-brand-600">
                      {b.carName}
                    </h2>
                    <StatusBadge status={b.status} size="sm" />
                  </div>

                  <p className="mt-2.5 flex items-center gap-1.5 truncate text-[13.5px] leading-snug text-ink-500">
                    <MapPin className="size-3.5 shrink-0 text-ink-400" />
                    {b.pickupLabel}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] leading-snug text-ink-500">
                    <CalendarRange className="size-3.5 shrink-0 text-ink-400" />
                    {shortDate(b.pickupDate)} → {shortDate(b.dropoffDate)} ·{" "}
                    {b.days} {b.days === 1 ? "day" : "days"}
                  </p>

                  <p className="text-numeric mt-3.5 font-display text-[17px] font-extrabold leading-none text-ink-900">
                    {formatINR(b.total)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
