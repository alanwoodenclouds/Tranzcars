"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/useBookingStore";

/** Persists selected car into booking store when landing on checkout */
export function SyncSelectedCar({
  carId,
  carSlug,
}: {
  carId: string;
  carSlug: string;
}) {
  const setSearch = useBookingStore((s) => s.setSearch);

  useEffect(() => {
    setSearch({ selectedCarId: carId, selectedCarSlug: carSlug });
  }, [carId, carSlug, setSearch]);

  return null;
}
