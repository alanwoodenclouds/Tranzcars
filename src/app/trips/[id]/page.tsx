"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
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
import { useAuthStore } from "@/store/useAuthStore";
import {
  type DemoBooking,
  useBookingsStore,
} from "@/store/useBookingsStore";
import { formatINR } from "@/utils";
import { toast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { SignInGate } from "@/components/auth/sign-in-gate";
import { StatusBadge } from "@/components/trips/status-badge";
import type { PortalTrip } from "@/lib/api/portal";

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
  const local = useBookingsStore((s) => s.bookings.find((b) => b.id === id));
  const cancelLocal = useBookingsStore((s) => s.cancelBooking);
  const [booking, setBooking] = useState<DemoBooking | null>(local || null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    if (!user?.token || user.token.startsWith("mock-")) {
      setBooking(local || null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const row = (await res.json()) as PortalTrip;
        setBooking({ ...row });
      } else if (local) {
        setBooking(local);
      } else {
        setBooking(null);
      }
    } catch {
      setBooking(local || null);
    } finally {
      setLoading(false);
    }
  }, [user?.token, id, local]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) {
    return (
      <SignInGate
        title="Sign in to view this trip"
        description="Booking details are available after you sign in."
      />
    );
  }

  if (loading && !booking) {
    return (
      <div className="container-page py-20 text-center text-sm text-ink-500">
        Loading trip…
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-ink-100 text-ink-400">
            <SearchX className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold">Trip not found</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
            This booking isn’t in your history.
          </p>
          <Button asChild className="mt-6">
            <Link href="/trips">Back to my trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function onCancel() {
    setCancelling(true);
    try {
      if (user?.token && !user.token.startsWith("mock-")) {
        const res = await fetch(`/api/bookings/${booking!.id}/cancel`, {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { detail?: string };
          throw new Error(err.detail || "Could not cancel");
        }
        const updated = (await res.json()) as PortalTrip;
        setBooking({ ...updated, status: "cancelled" });
      } else {
        cancelLocal(booking!.id);
        setBooking({ ...booking!, status: "cancelled" });
      }
      toast("Booking cancelled", "info");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Cancel failed", "error");
    } finally {
      setCancelling(false);
    }
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
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              {booking.carName}
            </h1>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="mt-6 space-y-4 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-brand-600" />
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                  Trip window
                </dt>
                <dd className="mt-1 text-[14px] text-ink-700">
                  {longDate(booking.pickupDate)} {booking.pickupTime} →{" "}
                  {longDate(booking.dropoffDate)} {booking.dropoffTime}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                  Pickup / drop-off
                </dt>
                <dd className="mt-1 text-[14px] text-ink-700">
                  {booking.pickupLabel || "—"}
                  {booking.dropoffLabel && booking.dropoffLabel !== booking.pickupLabel
                    ? ` → ${booking.dropoffLabel}`
                    : ""}
                </dd>
              </div>
            </div>
          </dl>
          {booking.status === "upcoming" ? (
            <Button
              variant="outline"
              className="mt-5"
              loading={cancelling}
              onClick={() => void onCancel()}
            >
              Cancel booking
            </Button>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
            <h2 className="font-display text-base font-bold">Fare</h2>
            <ul className="mt-3 space-y-2 text-[13.5px] text-ink-600">
              <li className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(booking.subtotal)}</span>
              </li>
              <li className="flex justify-between">
                <span>Delivery</span>
                <span>{formatINR(booking.delivery)}</span>
              </li>
              {booking.discount > 0 ? (
                <li className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-{formatINR(booking.discount)}</span>
                </li>
              ) : null}
              <li className="flex justify-between border-t border-hairline pt-2 font-semibold text-ink-900">
                <span>Total</span>
                <span>{formatINR(booking.total)}</span>
              </li>
            </ul>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5 text-[13px] text-ink-500">
            <p className="flex items-start gap-2">
              <Headphones className="mt-0.5 size-4 shrink-0" />
              Need help? Call {BUSINESS_RULES.phoneDisplay}.
            </p>
            <p className="mt-3 flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              Free cancellation up to 24 hours before pick-up.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
