"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  ChevronLeft,
  Clock3,
  Headphones,
  MapPin,
  Phone,
  SearchX,
} from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { useAuthStore } from "@/lib/booking/auth-store";
import { useBookingsStore } from "@/lib/booking/bookings-store";
import { formatINR } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { SignInGate } from "@/components/auth/sign-in-gate";
import { StatusBadge } from "@/components/trips/status-badge";

type Props = { params: Promise<{ id: string }> };

function longDate(value: string) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "EEE, d MMM yyyy");
  } catch {
    return value;
  }
}

export default function TripDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const booking = useBookingsStore((s) => s.bookings.find((b) => b.id === id));
  const cancelBooking = useBookingsStore((s) => s.cancelBooking);

  if (!user) {
    return (
      <SignInGate
        title="Sign in to view this trip"
        description="Booking details are tied to the mobile number used at checkout."
      />
    );
  }

  if (!booking || booking.mobile !== user.mobile) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-ink-100 text-ink-400">
            <SearchX className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold">Trip not found</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
            This booking isn’t in your history. It may belong to another number.
          </p>
          <Button asChild className="mt-6">
            <Link href="/trips">Back to my trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  function onCancel() {
    cancelBooking(booking!.id);
    toast("Booking cancelled", "info");
    router.refresh();
  }

  return (
    <div className="container-page pb-20 pt-6">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
      >
        <ChevronLeft className="size-4" />
        My trips
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-2xl)] bg-ink-100">
            <Image
              src={booking.carImage}
              alt={booking.carName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 62vw"
            />
            <div className="absolute left-4 top-4">
              <StatusBadge status={booking.status} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow mb-2">
                Booking {booking.id.slice(-6).toUpperCase()}
              </p>
              <h1 className="text-display-md">{booking.carName}</h1>
            </div>
            <p className="text-numeric font-display text-2xl font-extrabold">
              {formatINR(booking.total)}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Leg
              title="Pick-up"
              place={booking.pickupLabel}
              date={longDate(booking.pickupDate)}
              time={booking.pickupTime}
            />
            <Leg
              title="Drop-off"
              place={booking.dropoffLabel}
              date={longDate(booking.dropoffDate)}
              time={booking.dropoffTime}
            />
          </div>

          <section className="mt-6 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
            <h2 className="font-display text-[17px] font-bold tracking-tight">
              Payment
            </h2>
            <dl className="mt-4 space-y-2.5 text-[13.5px]">
              <Row
                label={`Rental · ${booking.days} ${booking.days === 1 ? "day" : "days"}`}
                value={formatINR(booking.subtotal)}
              />
              {booking.delivery > 0 ? (
                <Row label="Delivery" value={formatINR(booking.delivery)} />
              ) : null}
              {booking.discount > 0 ? (
                <Row
                  label="Discount"
                  value={`− ${formatINR(booking.discount)}`}
                />
              ) : null}
              <div className="flex justify-between gap-4 border-t border-hairline pt-3">
                <dt className="font-bold text-ink-900">Total paid</dt>
                <dd className="text-numeric font-display text-lg font-extrabold">
                  {formatINR(booking.total)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
            <h2 className="font-display text-[15px] font-bold tracking-tight">
              Manage this trip
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {booking.status === "upcoming" ? (
                <Button variant="outline" block onClick={onCancel}>
                  Cancel booking
                </Button>
              ) : null}
              <Button asChild block>
                <Link href="/cars">Book another ride</Link>
              </Button>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-400">
              Free cancellation up to 24 hours before pick-up.
            </p>
          </div>

          <div className="rounded-[var(--radius-xl)] bg-ink-900 p-5 text-white">
            <Headphones className="size-5 text-brand-400" />
            <p className="mt-3 text-[14px] font-bold">Need help on the road?</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
              Our Kochi desk answers 24/7 for breakdowns and extensions.
            </p>
            <Button asChild variant="outline" block className="mt-4 border-white/20 bg-transparent text-white hover:bg-white/10">
              <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                <Phone />
                {BUSINESS_RULES.phoneDisplay}
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Leg({
  title,
  place,
  date,
  time,
}: {
  title: string;
  place: string;
  date: string;
  time: string;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
        {title}
      </p>
      <p className="mt-2.5 flex items-start gap-2 text-[14px] font-bold text-ink-900">
        <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
        {place}
      </p>
      <p className="mt-2 flex items-center gap-2 text-[13px] text-ink-500">
        <Clock3 className="size-3.5 shrink-0 text-ink-400" />
        {date} · {time}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-numeric text-right font-semibold text-ink-900">
        {value}
      </dd>
    </div>
  );
}
