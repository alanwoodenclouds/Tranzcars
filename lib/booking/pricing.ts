import type { BookingSearch } from "@/lib/booking/store";

type TripDates = Pick<
  BookingSearch,
  "pickupDate" | "pickupTime" | "dropoffDate" | "dropoffTime"
>;

/** Billable days for a trip. Returns 0 when the trip isn't set yet. */
export function tripDays(search: TripDates) {
  if (!search.pickupDate || !search.dropoffDate) return 0;
  const start = new Date(
    `${search.pickupDate}T${search.pickupTime || "10:00"}`
  ).getTime();
  const end = new Date(
    `${search.dropoffDate}T${search.dropoffTime || "10:00"}`
  ).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  return Math.max(1, Math.ceil((end - start) / 86_400_000));
}

export const isDeliveryBranch = (branchId: string) =>
  branchId.includes("delivery");

export function quoteTrip({
  pricePerDay,
  days,
  deliveryCharge,
  pickupBranchId,
  discount = 0,
}: {
  pricePerDay: number;
  days: number;
  deliveryCharge: number;
  pickupBranchId: string;
  discount?: number;
}) {
  const billableDays = Math.max(1, days);
  const subtotal = pricePerDay * billableDays;
  const delivery = isDeliveryBranch(pickupBranchId) ? deliveryCharge : 0;
  return {
    days: billableDays,
    subtotal,
    delivery,
    discount,
    total: Math.max(0, subtotal + delivery - discount),
  };
}
