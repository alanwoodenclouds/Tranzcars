"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, format, subDays } from "date-fns";
import { CARS } from "@/content/site";

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type DemoBooking = {
  id: string;
  carId: string;
  carSlug: string;
  carName: string;
  carImage: string;
  pickupBranchId: string;
  pickupLabel: string;
  dropoffBranchId: string;
  dropoffLabel: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  days: number;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  mobile: string;
};

type BookingsState = {
  bookings: DemoBooking[];
  seededForMobile: string[];
  addBooking: (booking: Omit<DemoBooking, "id" | "createdAt"> & { id?: string }) => DemoBooking;
  cancelBooking: (id: string) => void;
  getById: (id: string) => DemoBooking | undefined;
  listForMobile: (mobile: string) => DemoBooking[];
  seedForMobile: (mobile: string) => void;
};

function uid() {
  return `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function buildSeedBookings(mobile: string): DemoBooking[] {
  const thar = CARS[0];
  const swift = CARS[2];
  const today = new Date();
  return [
    {
      id: uid(),
      carId: thar.id,
      carSlug: thar.slug,
      carName: thar.name,
      carImage: thar.image,
      pickupBranchId: "cok-airport",
      pickupLabel: "Cochin Airport (COK), Kochi",
      dropoffBranchId: "cok-airport",
      dropoffLabel: "Cochin Airport (COK), Kochi",
      pickupDate: format(subDays(today, 20), "yyyy-MM-dd"),
      pickupTime: "10:00",
      dropoffDate: format(subDays(today, 17), "yyyy-MM-dd"),
      dropoffTime: "10:00",
      days: 3,
      subtotal: thar.pricePerDay * 3,
      delivery: 0,
      discount: 0,
      total: thar.pricePerDay * 3,
      status: "completed",
      createdAt: subDays(today, 21).toISOString(),
      mobile,
    },
    {
      id: uid(),
      carId: swift.id,
      carSlug: swift.slug,
      carName: swift.name,
      carImage: swift.image,
      pickupBranchId: "kalamassery",
      pickupLabel: "Kalamassery Office, Kochi",
      dropoffBranchId: "kalamassery",
      dropoffLabel: "Kalamassery Office, Kochi",
      pickupDate: format(addDays(today, 5), "yyyy-MM-dd"),
      pickupTime: "09:00",
      dropoffDate: format(addDays(today, 7), "yyyy-MM-dd"),
      dropoffTime: "09:00",
      days: 2,
      subtotal: swift.pricePerDay * 2,
      delivery: 0,
      discount: 0,
      total: swift.pricePerDay * 2,
      status: "upcoming",
      createdAt: subDays(today, 2).toISOString(),
      mobile,
    },
  ];
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: [],
      seededForMobile: [],
      addBooking: (partial) => {
        const booking: DemoBooking = {
          ...partial,
          id: partial.id ?? uid(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return booking;
      },
      cancelBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id && b.status === "upcoming"
              ? { ...b, status: "cancelled" as const }
              : b
          ),
        })),
      getById: (id) => get().bookings.find((b) => b.id === id),
      listForMobile: (mobile) =>
        get().bookings.filter((b) => b.mobile === mobile),
      seedForMobile: (mobile) => {
        const { seededForMobile, bookings } = get();
        if (seededForMobile.includes(mobile)) return;
        const hasAny = bookings.some((b) => b.mobile === mobile);
        if (hasAny) {
          set({ seededForMobile: [...seededForMobile, mobile] });
          return;
        }
        const seeds = buildSeedBookings(mobile);
        set({
          bookings: [...seeds, ...bookings],
          seededForMobile: [...seededForMobile, mobile],
        });
      },
    }),
    { name: "tranzcars-bookings" }
  )
);

export type TripSearchFields = {
  pickupBranchId: string;
  dropoffBranchId: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
};

function toDateTime(date: string, time: string) {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Shared validation for search-first booking. Returns error message or null. */
export function assertSearchValid(
  search: TripSearchFields,
  minHours = 24
): string | null {
  if (!search.pickupBranchId) return "Choose a pickup location.";
  if (!search.dropoffBranchId) return "Choose a drop-off location.";
  if (!search.pickupDate || !search.pickupTime)
    return "Select pickup date and time.";
  if (!search.dropoffDate || !search.dropoffTime)
    return "Select drop-off date and time.";
  const pickup = toDateTime(search.pickupDate, search.pickupTime);
  const dropoff = toDateTime(search.dropoffDate, search.dropoffTime);
  if (!pickup || !dropoff) return "Enter valid pickup and drop-off date-times.";
  const minMs = minHours * 60 * 60 * 1000;
  if (dropoff.getTime() - pickup.getTime() < minMs) {
    return `Minimum rental is ${minHours} hours. Adjust drop-off date or time.`;
  }
  return null;
}

export function isSearchComplete(search: TripSearchFields) {
  return assertSearchValid(search) === null;
}

