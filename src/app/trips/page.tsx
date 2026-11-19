"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowRight, CalendarRange, MapPin, Ticket } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  type BookingStatus,
  type DemoBooking,
  useBookingsStore,
} from "@/store/useBookingsStore";
import { formatINR } from "@/utils";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/section";
import { Segmented } from "@/components/ui/segmented";
import { SignInGate } from "@/components/auth/sign-in-gate";
import { StatusBadge } from "@/components/trips/status-badge";
import type { PortalTrip } from "@/lib/api/portal";

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

function asDemo(trip: PortalTrip): DemoBooking {
  return { ...trip };
}

export default function TripsPage() {
  const user = useAuthStore((s) => s.user);
  const localBookings = useBookingsStore((s) => s.bookings);
  const [tab, setTab] = useState<BookingStatus>("upcoming");
  const [remote, setRemote] = useState<DemoBooking[] | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRemote = useCallback(async () => {
    if (!user?.token || user.token.startsWith("mock-")) {
      setRemote(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${user.token}` },
        cache: "no-store",
      });
      if (!res.ok) {
        setRemote([]);
        return;
      }
      const rows = (await res.json()) as PortalTrip[];
      setRemote(rows.map(asDemo));
    } catch {
      setRemote([]);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    void loadRemote();
  }, [loadRemote]);

  const mine = useMemo(() => {
    if (remote) return remote;
    if (!user) return [];
    return localBookings.filter((b) =>
      user.mobile ? b.mobile === user.mobile : true
    );
  }, [remote, localBookings, user]);

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

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading trips…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Ticket className="size-6" />
          </span>
          <h2 className="mt-5 font-display text-lg font-bold">No {tab} trips</h2>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-500">
            When you book a car, it will show up here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/cars">Browse cars</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((booking) => (
            <li key={booking.id}>
              <Link
                href={`/trips/${booking.id}`}
                className="interactive flex gap-4 rounded-[var(--radius-xl)] border border-hairline bg-surface p-3 sm:p-4"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-ink-100 sm:size-24">
                  <Image
                    src={booking.carImage}
                    alt={booking.carName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-[15px] font-bold leading-snug sm:text-base">
                      {booking.carName}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-500">
                    <CalendarRange className="size-3.5 shrink-0" />
                    {shortDate(booking.pickupDate)} → {shortDate(booking.dropoffDate)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-ink-500">
                    <MapPin className="size-3.5 shrink-0" />
                    {booking.pickupLabel || "Pickup"}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold text-ink-800">
                    {formatINR(booking.total)}
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
