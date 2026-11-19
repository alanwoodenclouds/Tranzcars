"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarRange,
  CheckCircle2,
  Info,
  MapPin,
  PencilLine,
  ShieldCheck,
} from "lucide-react";
import type { Car } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { useBookingStore } from "@/store/useBookingStore";
import { isSearchComplete } from "@/store/useBookingsStore";
import { quoteTrip, tripDays } from "@/lib/booking/pricing";
import { formatINR } from "@/utils";
import { Button } from "@/components/ui/button";
import { BookCarButton } from "@/components/booking/book-car-button";
import { TripScheduleDialog } from "@/components/booking/trip-schedule-dialog";

function shortDate(value: string) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM");
  } catch {
    return value;
  }
}

/** Sticky price + trip panel on the vehicle detail page. */
export function BookingPanel({
  car,
  deliveryCharge,
}: {
  car: Car;
  deliveryCharge: number;
}) {
  const search = useBookingStore((s) => s.search);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const ready = isSearchComplete(search);
  const days = tripDays(search);
  const quote = quoteTrip({
    pricePerDay: car.pricePerDay,
    days: days || 1,
    deliveryCharge,
    pickupBranchId: search.pickupBranchId,
  });

  return (
    <div className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface">
        <div className="border-b border-hairline p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-numeric font-display text-3xl font-extrabold text-ink-900">
                {formatINR(car.pricePerDay)}
                <span className="text-sm font-semibold text-ink-500"> / day</span>
              </p>
              <p className="mt-1 text-[12.5px] text-ink-500">
                {car.kmPerDay} km included daily · fuel excluded
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jade-50 px-2.5 py-1 text-[11.5px] font-bold text-jade-600">
              <ShieldCheck className="size-3.5" />
              Insured
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
              Your trip
            </p>
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-600 hover:underline"
            >
              <PencilLine className="size-3.5" />
              {ready ? "Change" : "Set trip"}
            </button>
          </div>

          {ready ? (
            <ul className="mt-3.5 space-y-2.5">
              <li className="flex items-start gap-2.5 text-[13.5px] text-ink-700">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>
                  {search.pickupLabel}
                  {search.dropoffBranchId !== search.pickupBranchId ? (
                    <> → {search.dropoffLabel}</>
                  ) : null}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-[13.5px] text-ink-700">
                <CalendarRange className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>
                  {shortDate(search.pickupDate)}, {search.pickupTime} →{" "}
                  {shortDate(search.dropoffDate)}, {search.dropoffTime}
                </span>
              </li>
            </ul>
          ) : (
            <p className="mt-3.5 flex items-start gap-2.5 rounded-[var(--radius-md)] bg-warning-soft px-3.5 py-3 text-[13px] font-medium text-warning">
              <Info className="mt-0.5 size-4 shrink-0" />
              Add pick-up, drop-off and times to see your total and book.
            </p>
          )}

          {ready ? (
            <dl className="mt-5 space-y-2.5 border-t border-hairline pt-5 text-[13.5px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">
                  {formatINR(car.pricePerDay)} × {quote.days}{" "}
                  {quote.days === 1 ? "day" : "days"}
                </dt>
                <dd className="text-numeric font-semibold text-ink-900">
                  {formatINR(quote.subtotal)}
                </dd>
              </div>
              {quote.delivery > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Doorstep delivery</dt>
                  <dd className="text-numeric font-semibold text-ink-900">
                    {formatINR(quote.delivery)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-t border-hairline pt-3">
                <dt className="font-bold text-ink-900">Estimated total</dt>
                <dd className="text-numeric font-display text-lg font-extrabold text-ink-900">
                  {formatINR(quote.total)}
                </dd>
              </div>
            </dl>
          ) : null}

          <BookCarButton
            carSlug={car.slug}
            carName={car.name}
            carId={car.id}
            block
            size="lg"
            className="mt-5"
          >
            {car.category === "bike" ? "Book this bike" : "Book this car"}
          </BookCarButton>

          <ul className="mt-4 space-y-2">
            {[
              "Free cancellation up to 24h before pick-up",
              `OTP verification only at checkout`,
              `Minimum rental ${BUSINESS_RULES.minRentalHours} hours`,
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-[12.5px] text-ink-500"
              >
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-jade-500" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button asChild variant="ghost" block className="mt-3">
        <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
          Questions? Call {BUSINESS_RULES.phoneDisplay}
        </a>
      </Button>

      <TripScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        carName={car.name}
        continueLabel="Save trip"
        onContinue={() => setScheduleOpen(false)}
      />
    </div>
  );
}
