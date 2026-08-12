"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  BadgePercent,
  CalendarRange,
  Check,
  CheckCircle2,
  Lock,
  MapPin,
  PencilLine,
  ShieldCheck,
} from "lucide-react";
import type { Car } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpDialog } from "@/components/auth/otp-dialog";
import { TripScheduleDialog } from "@/components/booking/trip-schedule-dialog";
import { useAuthStore } from "@/lib/booking/auth-store";
import { useBookingStore } from "@/lib/booking/store";
import { isSearchComplete, useBookingsStore } from "@/lib/booking/bookings-store";
import { quoteTrip, tripDays } from "@/lib/booking/pricing";
import { formatINR } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function longDate(value: string) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "EEE, d MMM yyyy");
  } catch {
    return value;
  }
}

export function CheckoutForm({
  car,
  deliveryCharge,
}: {
  car: Car;
  deliveryCharge: number;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const search = useBookingStore((s) => s.search);
  const addBooking = useBookingsStore((s) => s.addBooking);
  const [otpOpen, setOtpOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponOff, setCouponOff] = useState(0);
  const [couponNote, setCouponNote] = useState("");
  const [docsOk, setDocsOk] = useState(false);
  const [note, setNote] = useState("");
  const [paying, setPaying] = useState(false);

  const tripReady = isSearchComplete(search);
  const days = useMemo(() => tripDays(search) || 1, [search]);
  const quote = quoteTrip({
    pricePerDay: car.pricePerDay,
    days,
    deliveryCharge,
    pickupBranchId: search.pickupBranchId,
    discount: couponOff,
  });

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (code === "SENIOR15") {
      setCouponOff(Math.round(quote.subtotal * 0.15));
      setCouponNote(`SENIOR15 applied — ${BUSINESS_RULES.seniorDiscountPercent}% off`);
      toast("Senior discount applied", "success");
    } else if (code === "LADY10") {
      setCouponOff(Math.round(quote.subtotal * 0.1));
      setCouponNote(`LADY10 applied — ${BUSINESS_RULES.ladyDiscountPercent}% off`);
      toast("Lady driver discount applied", "success");
    } else if (code) {
      setCouponOff(0);
      setCouponNote("That code isn’t valid. Try SENIOR15 or LADY10.");
    }
  }

  function completePay() {
    if (!user) return;
    setPaying(true);
    const booking = addBooking({
      carId: car.id,
      carSlug: car.slug,
      carName: car.name,
      carImage: car.image,
      pickupBranchId: search.pickupBranchId,
      pickupLabel: search.pickupLabel,
      dropoffBranchId: search.dropoffBranchId || search.pickupBranchId,
      dropoffLabel: search.dropoffLabel || search.pickupLabel,
      pickupDate: search.pickupDate,
      pickupTime: search.pickupTime,
      dropoffDate: search.dropoffDate,
      dropoffTime: search.dropoffTime,
      days: quote.days,
      subtotal: quote.subtotal,
      delivery: quote.delivery,
      discount: quote.discount,
      total: quote.total,
      status: "upcoming",
      mobile: user.mobile,
    });
    toast("Booking confirmed", "success");
    setNote(`Payment successful. Taking you to your trip…`);
    setTimeout(() => router.push(`/trips/${booking.id}`), 700);
  }

  function attemptPay() {
    if (!isSearchComplete(search)) {
      setScheduleOpen(true);
      setNote("Add pick-up, drop-off and times before paying.");
      return;
    }
    if (!user) {
      setOtpOpen(true);
      return;
    }
    if (!docsOk) {
      setNote("Please confirm you’ll carry your original licence and ID.");
      return;
    }
    completePay();
  }

  const steps = [
    { label: "Trip set", done: tripReady },
    { label: "Verified", done: Boolean(user) },
    { label: "Paid", done: false },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
      <div className="space-y-5">
        {/* Progress */}
        <ol className="flex items-center gap-2">
          {steps.map((step, i) => (
            <li key={step.label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                  step.done
                    ? "bg-success text-white"
                    : "bg-ink-100 text-ink-500"
                )}
              >
                {step.done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[12.5px] font-bold",
                  step.done ? "text-ink-900" : "text-ink-500"
                )}
              >
                {step.label}
              </span>
              {i < steps.length - 1 ? (
                <span className="h-px flex-1 bg-hairline" />
              ) : null}
            </li>
          ))}
        </ol>

        {!tripReady ? (
          <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-warning/25 bg-warning-soft p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
              <div>
                <p className="text-[14px] font-bold text-ink-900">
                  Your trip isn’t complete
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-600">
                  Pick-up and drop-off points plus both date-times are required
                  (minimum {BUSINESS_RULES.minRentalHours}h).
                </p>
              </div>
            </div>
            <Button
              onClick={() => setScheduleOpen(true)}
              className="shrink-0"
              size="sm"
            >
              Add trip details
            </Button>
          </div>
        ) : null}

        {/* Vehicle */}
        <section className="overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface">
          <div className="flex gap-4 p-4 sm:p-5">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-ink-100 sm:size-28">
              <Image
                src={car.image}
                alt={car.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Badge tone="neutral" size="sm">
                {car.category === "bike" ? "Bike" : car.type}
              </Badge>
              <h2 className="mt-2 font-display text-lg font-bold tracking-tight">
                {car.name}
              </h2>
              <p className="mt-1 text-[13px] text-ink-500">
                {car.transmission} · {car.fuel} · {car.kmPerDay} km/day included
              </p>
            </div>
          </div>
        </section>

        {/* Trip */}
        <section className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-[17px] font-bold tracking-tight">
              Trip details
            </h2>
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-600 hover:underline"
            >
              <PencilLine className="size-3.5" />
              {tripReady ? "Change" : "Set trip"}
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TripFact
              icon={MapPin}
              label="Pick-up"
              value={search.pickupLabel || "Not set"}
              sub={tripReady ? `${longDate(search.pickupDate)} · ${search.pickupTime}` : undefined}
            />
            <TripFact
              icon={MapPin}
              label="Drop-off"
              value={search.dropoffLabel || "Not set"}
              sub={tripReady ? `${longDate(search.dropoffDate)} · ${search.dropoffTime}` : undefined}
            />
          </div>

          {tripReady ? (
            <p className="mt-4 flex items-center gap-2 border-t border-hairline pt-4 text-[13px] font-semibold text-ink-700">
              <CalendarRange className="size-4 text-brand-500" />
              {quote.days} {quote.days === 1 ? "day" : "days"}
              <span className="font-medium text-ink-500">
                · {car.kmPerDay * quote.days} km included
              </span>
            </p>
          ) : null}
        </section>

        {/* Documents */}
        <section className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
          <h2 className="font-display text-[17px] font-bold tracking-tight">
            Driver & documents
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
            Age {BUSINESS_RULES.eligibilityAge}+ with an LMV licence held{" "}
            {BUSINESS_RULES.licenceYears}+ year. Bring the original licence and
            Aadhaar or passport to handover.
          </p>
          <label
            className={cn(
              "mt-4 flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3.5 transition-colors",
              docsOk
                ? "border-success/30 bg-success-soft"
                : "border-hairline bg-surface hover:bg-ink-50"
            )}
          >
            <input
              type="checkbox"
              checked={docsOk}
              onChange={(e) => setDocsOk(e.target.checked)}
              className="mt-0.5 size-4 rounded border-ink-300 accent-brand-500"
            />
            <span className="text-[13.5px] font-medium text-ink-800">
              I’ll present my original driving licence and photo ID at pick-up.
            </span>
          </label>
        </section>

        {/* Coupon */}
        <section className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-[17px] font-bold tracking-tight">
            <BadgePercent className="size-[18px] text-brand-500" />
            Have a code?
          </h2>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="SENIOR15 or LADY10"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              className="uppercase"
              aria-label="Promo code"
            />
            <Button type="button" variant="outline" onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          {couponNote ? (
            <p
              className={cn(
                "mt-2.5 text-[12.5px] font-semibold",
                couponOff > 0 ? "text-success" : "text-danger"
              )}
            >
              {couponNote}
            </p>
          ) : null}
        </section>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface shadow-e2">
          <div className="border-b border-hairline px-5 py-4">
            <h2 className="font-display text-[17px] font-bold tracking-tight">
              Price summary
            </h2>
          </div>

          <dl className="space-y-3 px-5 py-5 text-[13.5px]">
            <Row
              label={`${formatINR(car.pricePerDay)} × ${quote.days} ${quote.days === 1 ? "day" : "days"}`}
              value={formatINR(quote.subtotal)}
            />
            {quote.delivery > 0 ? (
              <Row label="Doorstep delivery" value={formatINR(quote.delivery)} />
            ) : null}
            {quote.discount > 0 ? (
              <Row
                label="Discount"
                value={`− ${formatINR(quote.discount)}`}
                tone="success"
              />
            ) : null}
            <Row label="Insurance & taxes" value="Included" tone="muted" />
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
              <dt className="font-bold text-ink-900">Total due now</dt>
              <dd className="text-numeric font-display text-2xl font-extrabold text-ink-900">
                {formatINR(quote.total)}
              </dd>
            </div>
          </dl>

          <div className="px-5 pb-5">
            <Button
              block
              size="lg"
              loading={paying}
              onClick={attemptPay}
              disabled={paying}
            >
              {!paying ? <Lock /> : null}
              {paying
                ? "Confirming…"
                : !tripReady
                  ? "Set trip to continue"
                  : user
                    ? "Pay securely"
                    : "Verify & pay"}
            </Button>

            {user ? (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-jade-600">
                <CheckCircle2 className="size-3.5" />
                Signed in as {user.mobile}
              </p>
            ) : (
              <p className="mt-3 text-center text-[12px] text-ink-500">
                You’ll verify with a mobile OTP before payment.
              </p>
            )}

            {note ? (
              <p
                className="mt-3 rounded-[var(--radius-md)] bg-surface-sunken px-3 py-2.5 text-[12.5px] text-ink-600"
                role="status"
              >
                {note}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5 border-t border-hairline bg-surface-sunken px-5 py-4">
            <ShieldCheck className="size-4 shrink-0 text-jade-500" />
            <p className="text-[12px] leading-relaxed text-ink-500">
              Demo checkout — no card is charged and no real payment is taken.
            </p>
          </div>
        </div>
      </aside>

      <OtpDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        onVerified={() => {
          setNote("Verified. Confirm your documents, then pay.");
          toast("Signed in — you can complete payment", "success");
        }}
      />

      <TripScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        carName={car.name}
        continueLabel="Save trip"
        onContinue={() => {
          setScheduleOpen(false);
          setNote("Trip saved. You’re ready to pay.");
        }}
      />
    </div>
  );
}

function TripFact({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand-500" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
          {label}
        </p>
        <p className="mt-1 text-[13.5px] font-bold text-ink-900">{value}</p>
        {sub ? <p className="text-[12.5px] text-ink-500">{sub}</p> : null}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "muted";
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd
        className={cn(
          "text-numeric text-right font-semibold",
          tone === "success" && "text-success",
          tone === "muted" && "text-ink-500",
          !tone && "text-ink-900"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
