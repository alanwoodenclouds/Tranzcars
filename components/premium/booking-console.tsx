"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, nextFriday, parseISO } from "date-fns";
import {
  ArrowRight,
  Bike,
  CalendarRange,
  Car,
  Check,
  ChevronRight,
  Map,
  MapPin,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { buildCarsSearchParams, useBookingStore } from "@/lib/booking/store";
import { assertSearchValid } from "@/lib/booking/bookings-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PickupMapPicker } from "@/components/booking/pickup-map-picker";

const iso = (d: Date) => format(d, "yyyy-MM-dd");

function prettyDate(value: string) {
  if (!value) return "";
  try {
    return format(parseISO(value), "EEE, d MMM");
  } catch {
    return value;
  }
}

function tripNights(search: {
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
}) {
  if (!search.pickupDate || !search.dropoffDate) return 0;
  const a = new Date(`${search.pickupDate}T${search.pickupTime || "10:00"}`);
  const b = new Date(`${search.dropoffDate}T${search.dropoffTime || "10:00"}`);
  const ms = b.getTime() - a.getTime();
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

/**
 * Primary search surface. Everything downstream is gated on a valid trip, so
 * this bar carries smart defaults, inline validation and quick presets.
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

  const [category, setCategory] = useState<"car" | "bike">(
    search.category ?? "car"
  );
  const [pickupOpen, setPickupOpen] = useState(false);
  const [dropoffOpen, setDropoffOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState<string | null>(null);

  const sameAsPickup =
    !search.dropoffBranchId || search.dropoffBranchId === search.pickupBranchId;

  const cities = useMemo(
    () => Array.from(new Set(branches.map((b) => b.city))),
    [branches]
  );
  const branchList = city ? branches.filter((b) => b.city === city) : branches;
  const nights = tripNights(search);

  const labelFor = (branch: Branch) => `${branch.name}, ${branch.city}`;

  function selectPickup(branch: Branch, keepDropoff = false) {
    setSearch({
      pickupBranchId: branch.id,
      pickupLabel: labelFor(branch),
      ...(keepDropoff && !sameAsPickup
        ? {}
        : { dropoffBranchId: branch.id, dropoffLabel: labelFor(branch) }),
    });
    setError("");
    setPickupOpen(false);
  }

  function selectDropoff(branch: Branch) {
    setSearch({
      dropoffBranchId: branch.id,
      dropoffLabel: labelFor(branch),
    });
    setError("");
    setDropoffOpen(false);
  }

  function onCategory(next: "car" | "bike") {
    setCategory(next);
    setSearch({ category: next });
  }

  /** Pickup date drives a sensible default return date. */
  function onPickupDate(value: string) {
    const patch: Record<string, string> = { pickupDate: value };
    if (value && (!search.dropoffDate || search.dropoffDate < value)) {
      patch.dropoffDate = iso(addDays(parseISO(value), 1));
    }
    setSearch(patch);
    setError("");
  }

  function applyPreset(preset: "tomorrow" | "weekend" | "airport") {
    if (preset === "airport") {
      const airport =
        branches.find((b) => b.id === "cok-airport") ??
        branches.find((b) => b.type === "airport");
      if (airport) selectPickup(airport, true);
      return;
    }
    if (preset === "tomorrow") {
      const start = addDays(new Date(), 1);
      setSearch({
        pickupDate: iso(start),
        pickupTime: "10:00",
        dropoffDate: iso(addDays(start, 1)),
        dropoffTime: "10:00",
      });
    }
    if (preset === "weekend") {
      const friday = nextFriday(new Date());
      setSearch({
        pickupDate: iso(friday),
        pickupTime: "17:00",
        dropoffDate: iso(addDays(friday, 2)),
        dropoffTime: "19:00",
      });
    }
    setError("");
  }

  function onSearch() {
    const draft = { ...search, category };
    if (!draft.dropoffBranchId && draft.pickupBranchId) {
      draft.dropoffBranchId = draft.pickupBranchId;
      draft.dropoffLabel = draft.pickupLabel;
    }
    const message = assertSearchValid(draft, BUSINESS_RULES.minRentalHours);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setSearch(draft);
    router.push(`/cars?${buildCarsSearchParams(draft)}`);
  }

  const today = iso(new Date());

  return (
    <div
      className={cn(
        "rounded-[var(--radius-2xl)] border border-hairline bg-surface p-3 shadow-e3 sm:p-4",
        className
      )}
    >
      {/* Category + presets */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          aria-label="Vehicle type"
          value={category}
          onChange={onCategory}
          options={[
            { value: "car", label: "Cars", icon: <Car className="size-4" /> },
            { value: "bike", label: "Bikes", icon: <Bike className="size-4" /> },
          ]}
        />

        <div className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto px-1">
          <PresetChip icon={Plane} onClick={() => applyPreset("airport")}>
            Airport pickup
          </PresetChip>
          <PresetChip icon={Sparkles} onClick={() => applyPreset("tomorrow")}>
            Tomorrow
          </PresetChip>
          <PresetChip icon={CalendarRange} onClick={() => applyPreset("weekend")}>
            This weekend
          </PresetChip>
        </div>
      </div>

      {/* Search bar */}
      <div className="grid overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface-sunken lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:rounded-full">
        {/* Pickup location */}
        <Sheet open={pickupOpen} onOpenChange={setPickupOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="group flex min-w-0 items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface/70 lg:py-3"
            >
              <MapPin className="size-[18px] shrink-0 text-brand-500" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
                  Pick-up
                </span>
                <span
                  className={cn(
                    "block truncate text-sm font-semibold",
                    search.pickupLabel ? "text-ink-900" : "text-ink-400"
                  )}
                >
                  {search.pickupLabel || "Where from?"}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-300 lg:hidden" />
            </button>
          </SheetTrigger>
          <BranchSheet
            title="Pick-up location"
            description="Airports, offices and doorstep delivery across Kerala."
            cities={cities}
            city={city}
            setCity={setCity}
            branches={branchList}
            selectedId={search.pickupBranchId}
            onSelect={(b) => selectPickup(b, true)}
            onOpenMap={() => {
              setPickupOpen(false);
              setMapOpen(true);
            }}
          />
        </Sheet>

        {/* Drop-off location */}
        <Sheet open={dropoffOpen} onOpenChange={setDropoffOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 items-center gap-3 border-t border-hairline px-4 py-3.5 text-left transition-colors hover:bg-surface/70 lg:border-l lg:border-t-0 lg:py-3"
            >
              <MapPin className="size-[18px] shrink-0 text-ink-400" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
                  Drop-off
                </span>
                <span
                  className={cn(
                    "block truncate text-sm font-semibold",
                    sameAsPickup ? "text-ink-500" : "text-ink-900"
                  )}
                >
                  {sameAsPickup
                    ? "Same as pick-up"
                    : search.dropoffLabel || "Where to?"}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-300 lg:hidden" />
            </button>
          </SheetTrigger>
          <BranchSheet
            title="Drop-off location"
            description="Return to the same branch or end your trip elsewhere."
            cities={cities}
            city={city}
            setCity={setCity}
            branches={branchList}
            selectedId={sameAsPickup ? undefined : search.dropoffBranchId}
            onSelect={selectDropoff}
          />
        </Sheet>

        {/* Pickup date + time */}
        <DateTimeSegment
          label="Trip starts"
          date={search.pickupDate}
          time={search.pickupTime}
          min={today}
          onDate={onPickupDate}
          onTime={(t) => setSearch({ pickupTime: t })}
        />

        {/* Dropoff date + time */}
        <DateTimeSegment
          label="Trip ends"
          date={search.dropoffDate}
          time={search.dropoffTime}
          min={search.pickupDate || today}
          onDate={(v) => {
            setSearch({ dropoffDate: v });
            setError("");
          }}
          onTime={(t) => setSearch({ dropoffTime: t })}
        />

        <div className="border-t border-hairline p-2 lg:border-l lg:border-t-0 lg:p-1.5">
          <Button
            onClick={onSearch}
            size="lg"
            block
            className="lg:h-[52px] lg:w-[52px] lg:px-0"
            aria-label={category === "bike" ? "Search bikes" : "Search cars"}
          >
            <Search className="lg:size-5" />
            <span className="lg:hidden">
              Search {category === "bike" ? "bikes" : "cars"}
            </span>
          </Button>
        </div>
      </div>

      {/* Feedback row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1">
        {error ? (
          <p
            role="alert"
            className="text-[13px] font-semibold text-danger"
          >
            {error}
          </p>
        ) : nights ? (
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-700">
            <Check className="size-4 text-success" />
            {nights} {nights === 1 ? "day" : "days"}
            {category === "car" ? (
              <span className="font-medium text-ink-500">
                · {nights * BUSINESS_RULES.kmPerDay} free km included
              </span>
            ) : null}
          </p>
        ) : (
          <p className="text-[13px] text-ink-500">
            Minimum {BUSINESS_RULES.minRentalHours}h rental · no sign-in needed
            to browse
          </p>
        )}
        {!sameAsPickup ? (
          <button
            type="button"
            onClick={() =>
              setSearch({
                dropoffBranchId: search.pickupBranchId,
                dropoffLabel: search.pickupLabel,
              })
            }
            className="text-[13px] font-semibold text-brand-600 hover:underline"
          >
            Return to pick-up point
          </button>
        ) : null}
      </div>

      <PickupMapPicker
        open={mapOpen}
        onOpenChange={setMapOpen}
        branches={branches}
        selectedId={search.pickupBranchId}
        onSelect={(branch) => {
          selectPickup(branch, true);
          setMapOpen(false);
        }}
      />
    </div>
  );
}

function DateTimeSegment({
  label,
  date,
  time,
  min,
  onDate,
  onTime,
}: {
  label: string;
  date: string;
  time: string;
  min?: string;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
}) {
  return (
    <div className="relative border-t border-hairline px-4 py-3.5 transition-colors focus-within:bg-surface hover:bg-surface/70 lg:border-l lg:border-t-0 lg:py-3">
      <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
        {label}
      </span>
      <div className="mt-0.5 flex items-center gap-2">
        <label className="relative min-w-0 flex-1 cursor-pointer">
          <span
            className={cn(
              "block truncate text-sm font-semibold",
              date ? "text-ink-900" : "text-ink-400"
            )}
          >
            {date ? prettyDate(date) : "Add date"}
          </span>
          <input
            type="date"
            value={date}
            min={min}
            onChange={(e) => onDate(e.target.value)}
            aria-label={`${label} date`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <span aria-hidden className="text-ink-200">
          |
        </span>
        <input
          type="time"
          value={time}
          onChange={(e) => onTime(e.target.value)}
          aria-label={`${label} time`}
          className="w-[4.75rem] shrink-0 rounded-md bg-transparent text-sm font-semibold text-ink-900 outline-none"
        />
      </div>
    </div>
  );
}

function PresetChip({
  children,
  icon: Icon,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
    >
      <Icon className="size-3.5" />
      {children}
    </button>
  );
}

function BranchSheet({
  title,
  description,
  cities,
  city,
  setCity,
  branches,
  selectedId,
  onSelect,
  onOpenMap,
}: {
  title: string;
  description?: string;
  cities: string[];
  city: string | null;
  setCity: (c: string | null) => void;
  branches: Branch[];
  selectedId?: string;
  onSelect: (b: Branch) => void;
  onOpenMap?: () => void;
}) {
  const TYPE_LABEL: Record<Branch["type"], string> = {
    airport: "Airport",
    office: "Branch office",
    railway: "Railway station",
    delivery: "Doorstep delivery",
  };

  return (
    <SheetContent side="bottom" className="px-5 pb-6 pt-4 sm:px-6">
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        {description ? (
          <p className="text-sm text-ink-500">{description}</p>
        ) : null}
      </SheetHeader>

      <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
        <CityChip active={!city} onClick={() => setCity(null)}>
          All Kerala
        </CityChip>
        {cities.map((c) => (
          <CityChip key={c} active={city === c} onClick={() => setCity(c)}>
            {c}
          </CityChip>
        ))}
      </div>

      <ul className="-mx-2 mt-2 flex-1 overflow-y-auto">
        {branches.map((b) => {
          const active = b.id === selectedId;
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSelect(b)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left transition-colors",
                  active ? "bg-brand-50" : "hover:bg-ink-50"
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full",
                    active
                      ? "bg-brand-500 text-white"
                      : "bg-ink-100 text-ink-500"
                  )}
                >
                  {b.type === "airport" ? (
                    <Plane className="size-4" />
                  ) : (
                    <MapPin className="size-4" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink-900">
                    {b.name}
                  </span>
                  <span className="block text-xs text-ink-500">
                    {b.city} · {TYPE_LABEL[b.type]}
                  </span>
                </span>
                {active ? (
                  <Check className="size-4 shrink-0 text-brand-600" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {onOpenMap ? (
        <Button
          variant="outline"
          block
          onClick={onOpenMap}
          className="mt-3 shrink-0"
        >
          <Map />
          Choose on map
          <ArrowRight />
        </Button>
      ) : null}
    </SheetContent>
  );
}

function CityChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
        active
          ? "bg-ink-900 text-white"
          : "bg-ink-100 text-ink-600 hover:bg-ink-200"
      )}
    >
      {children}
    </button>
  );
}
