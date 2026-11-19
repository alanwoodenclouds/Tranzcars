import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CarFront, ChevronLeft } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { SyncSelectedCar } from "@/components/checkout/sync-selected-car";
import { getCarBySlug, getSettings } from "@/lib/api/server";
import { Button } from "@/components/ui/button";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description: "Confirm your TranzCars booking. OTP verification happens here.",
  path: "/checkout",
  noIndex: true,
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const slug = typeof params.car === "string" ? params.car : "";

  if (!slug) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-ink-100 text-ink-400">
            <CarFront className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold">
            No vehicle selected
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
            Choose a car or bike from the fleet, then come back to check out.
          </p>
          <Button asChild className="mt-6">
            <Link href="/cars">Browse the fleet</Link>
          </Button>
        </div>
      </div>
    );
  }

  const [car, settings] = await Promise.all([getCarBySlug(slug), getSettings()]);
  if (!car) notFound();

  return (
    <div className="container-page pb-20 pt-6">
      <Link
        href={`/cars/${car.slug}`}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
      >
        <ChevronLeft className="size-4" />
        Back to {car.name}
      </Link>

      <div className="mt-5 max-w-2xl">
        <h1 className="text-display-lg">Review & confirm</h1>
        <p className="text-lead mt-3">
          Everything below is what you pay. Verification happens with a single
          OTP right before payment.
        </p>
      </div>

      <div className="mt-9">
        <SyncSelectedCar carId={car.id} carSlug={car.slug} />
        <CheckoutForm
          car={car}
          deliveryCharge={
            (settings as { delivery_charge?: number }).delivery_charge ?? 1500
          }
        />
      </div>
    </div>
  );
}
