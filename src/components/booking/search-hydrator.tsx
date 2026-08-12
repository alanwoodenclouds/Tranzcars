"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BRANCHES } from "@/content/site";
import { useBookingStore } from "@/store/useBookingStore";

function labelFor(id: string) {
  const b = BRANCHES.find((x) => x.id === id);
  return b ? `${b.name}, ${b.city}` : "";
}

/** Mirrors /cars URL params into the booking store. Renders nothing. */
export function SearchHydrator() {
  const params = useSearchParams();
  const setSearch = useBookingStore((s) => s.setSearch);

  useEffect(() => {
    const pickup = params.get("pickup");
    const dropoff = params.get("dropoff");
    const from = params.get("from");
    const to = params.get("to");
    const fromTime = params.get("fromTime");
    const toTime = params.get("toTime");
    const category = params.get("category");

    if (!pickup && !dropoff && !from && !to && !category) return;

    const current = useBookingStore.getState().search;

    setSearch({
      ...(pickup
        ? {
            pickupBranchId: pickup,
            pickupLabel: labelFor(pickup) || current.pickupLabel,
            dropoffBranchId: dropoff || pickup,
            dropoffLabel: labelFor(dropoff || pickup) || current.dropoffLabel,
          }
        : dropoff
          ? {
              dropoffBranchId: dropoff,
              dropoffLabel: labelFor(dropoff) || current.dropoffLabel,
            }
          : {}),
      ...(from ? { pickupDate: from } : {}),
      ...(to ? { dropoffDate: to } : {}),
      ...(fromTime ? { pickupTime: fromTime } : {}),
      ...(toTime ? { dropoffTime: toTime } : {}),
      ...(category === "bike" || category === "car" ? { category } : {}),
    });
  }, [params, setSearch]);

  return null;
}
