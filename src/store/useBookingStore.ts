"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingSearch = {
  pickupBranchId: string;
  pickupLabel: string;
  dropoffBranchId: string;
  dropoffLabel: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  selectedCarId?: string;
  selectedCarSlug?: string;
  /** Fleet category for search — car | bike */
  category?: "car" | "bike";
};

type BookingState = {
  search: BookingSearch;
  setSearch: (partial: Partial<BookingSearch>) => void;
  resetSearch: () => void;
};

const defaultSearch: BookingSearch = {
  pickupBranchId: "",
  pickupLabel: "",
  dropoffBranchId: "",
  dropoffLabel: "",
  pickupDate: "",
  pickupTime: "10:00",
  dropoffDate: "",
  dropoffTime: "10:00",
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      search: defaultSearch,
      setSearch: (partial) =>
        set((state) => ({ search: { ...state.search, ...partial } })),
      resetSearch: () => set({ search: defaultSearch }),
    }),
    { name: "tranzcars-booking" }
  )
);

export function buildCarsSearchParams(search: BookingSearch) {
  const params = new URLSearchParams();
  if (search.pickupBranchId) params.set("pickup", search.pickupBranchId);
  if (search.dropoffBranchId) params.set("dropoff", search.dropoffBranchId);
  if (search.pickupDate) params.set("from", search.pickupDate);
  if (search.dropoffDate) params.set("to", search.dropoffDate);
  if (search.pickupTime) params.set("fromTime", search.pickupTime);
  if (search.dropoffTime) params.set("toTime", search.dropoffTime);
  if (search.category) params.set("category", search.category);
  return params.toString();
}
