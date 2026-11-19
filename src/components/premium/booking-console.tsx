"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  Bike,
  CalendarClock,
  Car,
  ChevronRight,
  Gauge,
  Home,
  Loader2,
  MapPin,
} from "lucide-react";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { buildCarsSearchParams, useBookingStore } from "@/store/useBookingStore";
import { assertSearchValid } from "@/store/useBookingsStore";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookingWizard,
  type BookingWizardResult,
} from "@/components/booking/booking-wizard";
import { PickupMapPicker } from "@/components/booking/pickup-map-picker";

function prettyDate(value: string) {
  if (!value) return "";
  try {
    return format(parseISO(value), "EEE, d MMM");
  } catch {
    return value;
  }
}

function prettyRange(search: {
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
}) {
  if (!search.pickupDate || !search.dropoffDate) return "";
  return `${prettyDate(search.pickupDate)} ${search.pickupTime || ""} → ${prettyDate(search.dropoffDate)} ${search.dropoffTime || ""}`.trim();
}

/**
 * Booking card — fields open a guided City → Location → Dates → Time wizard.
 */
export function BookingConsole({
  branches,
  className,
}: {
  branches: Branch[];
  className?: string;
}) {
  const router = useRouter();
  const search = useBookingStore((s) => s.search);
  const setSearch = useBookingStore((s) => s.setSearch);
  const hasHydrated = useBookingStore((s) => s._hasHydrated);

  const [category, setCategory] = useState<"car" | "bike">(
    search.category ?? "car"
  );
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<
    "city" | "location" | "dates" | "times"
  >("city");
  const [mapOpen, setMapOpen] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  // After localStorage rehydrate, sync local UI from persisted search.
  useEffect(() => {
    if (!hasHydrated) return;
    setCategory(search.category ?? "car");
    setDifferentDropoff(
      Boolean(search.dropoffBranchId) &&
        search.dropoffBranchId !== search.pickupBranchId
    );
  }, [
    hasHydrated,
    search.category,
    search.dropoffBranchId,
    search.pickupBranchId,
  ]);

  const scheduleLabel = hasHydrated ? prettyRange(search) : "";
  const pickupLabel = hasHydrated ? search.pickupLabel : "";
  const dropoffLabel = hasHydrated ? search.dropoffLabel : "";
  const hasLocation = hasHydrated && Boolean(search.pickupBranchId);
  const hasSchedule =
    hasHydrated && Boolean(search.pickupDate && search.dropoffDate);

  function openWizard(step: "city" | "location" | "dates" | "times" = "city") {
    setWizardStep(step);
    setWizardOpen(true);
  }

  function runSearch(draft: typeof search) {
    const next = { ...draft, category: draft.category ?? category };
    if (!next.dropoffBranchId && next.pickupBranchId) {
      next.dropoffBranchId = next.pickupBranchId;
      next.dropoffLabel = next.pickupLabel;
    }
    const message = assertSearchValid(next, BUSINESS_RULES.minRentalHours);
    if (message) {
      setError(message);
      setSearching(false);
      setWizardOpen(false);
      return;
    }
    setError("");
    setSearch(next);
    setSearching(true);
    window.setTimeout(() => {
      router.push(`/cars?${buildCarsSearchParams(next)}`);
    }, 1100);
  }

  function onDifferentDropoff(on: boolean) {
    setDifferentDropoff(on);
    if (on) {
      if (
        !search.dropoffBranchId ||
        search.dropoffBranchId === search.pickupBranchId
      ) {
        setSearch({ dropoffBranchId: "", dropoffLabel: "" });
      }
      return;
    }
    setSearch({
      dropoffBranchId: search.pickupBranchId,
      dropoffLabel: search.pickupLabel,
    });
  }

  function onWizardComplete(result: BookingWizardResult) {
    const draft = { ...search, ...result, category };
    setSearch(draft);
    runSearch(draft);
  }

  function onSearch() {
    if (!hasLocation) {
      openWizard("city");
      return;
    }
    if (!hasSchedule) {
      openWizard("dates");
      return;
    }
    runSearch({ ...search, category });
  }

  const goLabel = searching
    ? "Searching…"
    : !hasLocation
      ? "Choose location"
      : !hasSchedule
        ? "Choose dates"
        : "Go";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-ink-200/80 bg-surface shadow-[0_28px_60px_-28px_rgba(0,0,0,0.65)] sm:rounded-[var(--radius-2xl)]",
        className
      )}
    >
      <div className="px-4 pb-0 pt-5 text-center sm:px-7 sm:pt-6">
        <h2 className="font-display text-[1.2rem] font-bold tracking-tight text-brand-500 sm:text-[1.5rem]">
          Find the right {category === "bike" ? "bike" : "car"} now!
        </h2>

        <div
          role="tablist"
          aria-label="Vehicle type"
          className="mt-4 grid grid-cols-2 gap-0 sm:mt-5"
        >
          {(
            [
              { value: "car" as const, label: "Cars", Icon: Car },
              { value: "bike" as const, label: "Bikes", Icon: Bike },
            ] as const
          ).map(({ value, label, Icon }) => {
            const active = category === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setCategory(value);
                  setSearch({ category: value });
                }}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 pb-3 pt-1 transition-colors sm:gap-2 sm:pb-3.5",
                  active ? "text-ink-900" : "text-ink-400 hover:text-ink-600"
                )}
              >
                <Icon
                  className={cn(
                    "size-8 sm:size-9",
                    active ? "text-brand-500" : "text-ink-300"
                  )}
                  strokeWidth={1.5}
                />
                <span className="sr-only">{label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[3px] rounded-full transition-colors",
                    active ? "bg-brand-500" : "bg-ink-100"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5 px-4 py-4 sm:space-y-3 sm:px-7 sm:py-5">
        <label className="flex cursor-pointer items-center gap-2.5 sm:gap-3">
          <span className="relative inline-flex h-5 w-9 shrink-0 items-center sm:h-6 sm:w-11">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={differentDropoff}
              onChange={(e) => onDifferentDropoff(e.target.checked)}
            />
            <span className="absolute inset-0 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring" />
            <span className="absolute left-0.5 size-4 rounded-full bg-white shadow-e1 transition-transform peer-checked:translate-x-4 sm:size-5 sm:peer-checked:translate-x-5" />
          </span>
          <span className="text-[12.5px] font-medium leading-snug text-ink-700 sm:text-[13.5px]">
            Return {category === "bike" ? "bike" : "car"} to another location
          </span>
        </label>

        <button
          type="button"
          onClick={() => openWizard(hasLocation ? "location" : "city")}
          className={fieldClass}
        >
          <MapPin className="size-4 shrink-0 text-ink-400 sm:size-[18px]" />
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left text-[14px] sm:text-[15px]",
              pickupLabel
                ? "font-semibold text-ink-900"
                : "font-medium text-ink-400"
            )}
          >
            {pickupLabel || "Choose pick up location"}
          </span>
          <ChevronRight className="size-4 shrink-0 text-ink-300" />
        </button>

        {differentDropoff && dropoffLabel ? (
          <button
            type="button"
            onClick={() => openWizard("location")}
            className={fieldClass}
          >
            <MapPin className="size-4 shrink-0 text-ink-400 sm:size-[18px]" />
            <span className="min-w-0 flex-1 truncate text-left text-[14px] font-semibold text-ink-900 sm:text-[15px]">
              {dropoffLabel}
            </span>
            <ChevronRight className="size-4 shrink-0 text-ink-300" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => openWizard(hasLocation ? "dates" : "city")}
          className={fieldClass}
        >
          <CalendarClock className="size-4 shrink-0 text-ink-400 sm:size-[18px]" />
          <span
            className={cn(
              "min-w-0 flex-1 text-left text-[13px] leading-snug sm:truncate sm:text-[15px]",
              scheduleLabel
                ? "font-semibold text-ink-900"
                : "font-medium text-ink-400"
            )}
          >
            {scheduleLabel || "Choose date & time"}
          </span>
          <ChevronRight className="size-4 shrink-0 text-ink-300" />
        </button>

        {error ? (
          <p role="alert" className="text-[13px] font-semibold text-danger">
            {error}
          </p>
        ) : null}

        <Button
          onClick={onSearch}
          size="lg"
          block
          loading={searching}
          className="h-12 rounded-[var(--radius-md)] text-[15px] font-bold sm:h-14 sm:text-base"
        >
          {goLabel}
        </Button>
      </div>

      <div className="grid grid-cols-2 border-t border-hairline">
        <div className="flex items-start gap-2 border-r border-hairline px-3 py-3 sm:items-center sm:gap-2.5 sm:px-5 sm:py-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 sm:size-9">
            <Home className="size-3.5 sm:size-4" />
          </span>
          <span className="min-w-0 text-left text-[11px] leading-snug text-ink-600 sm:text-[12px]">
            <span className="block font-semibold text-ink-800">
              Doorstep delivery
            </span>
            Available in your city
          </span>
        </div>
        <div className="flex items-start gap-2 px-3 py-3 sm:items-center sm:gap-2.5 sm:px-5 sm:py-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-jade-50 text-jade-600 sm:size-9">
            <Gauge className="size-3.5 sm:size-4" />
          </span>
          <span className="min-w-0 text-left text-[11px] leading-snug text-ink-600 sm:text-[12px]">
            <span className="block font-semibold text-ink-800">Choose your</span>
            KM Package
          </span>
        </div>
      </div>

      <BookingWizard
        open={wizardOpen}
        onOpenChange={(open) => {
          if (searching) return;
          setWizardOpen(open);
        }}
        branches={branches}
        startStep={wizardStep}
        differentDropoff={differentDropoff}
        initial={{ ...search, category }}
        onComplete={onWizardComplete}
        onOpenMap={() => setMapOpen(true)}
      />

      <Dialog open={searching && !wizardOpen}>
        <DialogContent
          mobileSheet
          hideClose
          className="max-w-none gap-0 p-8 text-center sm:max-w-sm"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Loader2 className="size-7 animate-spin" />
          </span>
          <DialogTitle className="mt-4 font-display text-lg font-bold text-ink-900">
            Searching available {category === "bike" ? "bikes" : "cars"}…
          </DialogTitle>
          <p className="mt-1 text-sm text-ink-500">
            Matching your location and dates
          </p>
        </DialogContent>
      </Dialog>

      <PickupMapPicker
        open={mapOpen}
        onOpenChange={setMapOpen}
        branches={branches}
        selectedId={search.pickupBranchId}
        onSelect={(b) => {
          setSearch({
            pickupBranchId: b.id,
            pickupLabel: `${b.name}, ${b.city}`,
            ...(differentDropoff
              ? {}
              : {
                  dropoffBranchId: b.id,
                  dropoffLabel: `${b.name}, ${b.city}`,
                }),
          });
          setMapOpen(false);
          openWizard("dates");
        }}
      />
    </div>
  );
}

const fieldClass =
  "flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border border-ink-200 bg-surface px-3.5 py-3.5 transition-colors hover:border-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-3 sm:px-4 sm:py-[15px]";
