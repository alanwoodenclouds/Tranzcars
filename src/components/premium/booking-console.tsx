"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, parseISO } from "date-fns";
import {
  ArrowRight,
  Bike,
  CalendarClock,
  Car,
  Check,
  Gauge,
  Home,
  Map,
  MapPin,
  Plane,
} from "lucide-react";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { buildCarsSearchParams, useBookingStore } from "@/store/useBookingStore";
import { assertSearchValid } from "@/store/useBookingsStore";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
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
 * Compact vertical booking card — location, schedule, Go.
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
  const [differentDropoff, setDifferentDropoff] = useState(
    Boolean(search.dropoffBranchId) &&
      search.dropoffBranchId !== search.pickupBranchId
  );
  const [pickupOpen, setPickupOpen] = useState(false);
  const [dropoffOpen, setDropoffOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState<string | null>(null);

  const cities = useMemo(
    () => Array.from(new Set(branches.map((b) => b.city))),
    [branches]
  );
  const branchList = city ? branches.filter((b) => b.city === city) : branches;
  const scheduleLabel = prettyRange(search);

  const labelFor = (branch: Branch) => `${branch.name}, ${branch.city}`;

  function selectPickup(branch: Branch, keepDropoff = false) {
    setSearch({
      pickupBranchId: branch.id,
      pickupLabel: labelFor(branch),
      ...(keepDropoff && differentDropoff
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

  function onPickupDate(value: string) {
    const patch: Record<string, string> = { pickupDate: value };
    if (value && (!search.dropoffDate || search.dropoffDate < value)) {
      patch.dropoffDate = iso(addDays(parseISO(value), 1));
    }
    setSearch(patch);
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
        "overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface shadow-e4",
        className
      )}
    >
      {/* Title + vehicle tabs */}
      <div className="px-5 pb-0 pt-6 text-center sm:px-7">
        <h2 className="font-display text-[1.35rem] font-bold tracking-tight text-brand-500 sm:text-[1.5rem]">
          Find the right {category === "bike" ? "bike" : "car"} now!
        </h2>

        <div
          role="tablist"
          aria-label="Vehicle type"
          className="mt-5 grid grid-cols-2 gap-0"
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
                onClick={() => onCategory(value)}
                className={cn(
                  "relative flex flex-col items-center gap-2 pb-3.5 pt-1 transition-colors",
                  active ? "text-ink-900" : "text-ink-400 hover:text-ink-600"
                )}
              >
                <Icon
                  className={cn(
                    "size-9",
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

      <div className="space-y-3 px-5 py-5 sm:px-7">
        {/* Different drop-off toggle */}
        <label className="flex cursor-pointer items-center gap-3">
          <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={differentDropoff}
              onChange={(e) => onDifferentDropoff(e.target.checked)}
            />
            <span className="absolute inset-0 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring" />
            <span className="absolute left-0.5 size-5 rounded-full bg-white shadow-e1 transition-transform peer-checked:translate-x-5" />
          </span>
          <span className="text-[13.5px] font-medium text-ink-700">
            Return {category === "bike" ? "bike" : "car"} to another location
          </span>
        </label>

        {/* Pickup */}
        <Sheet open={pickupOpen} onOpenChange={setPickupOpen}>
          <SheetTrigger asChild>
            <button type="button" className={fieldClass}>
              <MapPin className="size-[18px] shrink-0 text-ink-400" />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left text-[15px]",
                  search.pickupLabel
                    ? "font-semibold text-ink-900"
                    : "font-medium text-ink-400"
                )}
              >
                {search.pickupLabel || "Choose pick up location"}
              </span>
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

        {/* Drop-off (when toggle on) */}
        {differentDropoff ? (
          <Sheet open={dropoffOpen} onOpenChange={setDropoffOpen}>
            <SheetTrigger asChild>
              <button type="button" className={fieldClass}>
                <MapPin className="size-[18px] shrink-0 text-ink-400" />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-left text-[15px]",
                    search.dropoffLabel
                      ? "font-semibold text-ink-900"
                      : "font-medium text-ink-400"
                  )}
                >
                  {search.dropoffLabel || "Choose drop off location"}
                </span>
              </button>
            </SheetTrigger>
            <BranchSheet
              title="Drop-off location"
              description="End your trip at a different branch."
              cities={cities}
              city={city}
              setCity={setCity}
              branches={branchList}
              selectedId={search.dropoffBranchId}
              onSelect={selectDropoff}
            />
          </Sheet>
        ) : null}

        {/* Date & time */}
        <Sheet open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <SheetTrigger asChild>
            <button type="button" className={fieldClass}>
              <CalendarClock className="size-[18px] shrink-0 text-ink-400" />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left text-[15px]",
                  scheduleLabel
                    ? "font-semibold text-ink-900"
                    : "font-medium text-ink-400"
                )}
              >
                {scheduleLabel || "Choose date & time"}
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="px-5 pb-6 pt-4 sm:px-6">
            <SheetHeader>
              <SheetTitle>Trip schedule</SheetTitle>
              <p className="text-sm text-ink-500">
                Minimum {BUSINESS_RULES.minRentalHours}h rental.
              </p>
            </SheetHeader>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ScheduleField
                label="Trip starts"
                date={search.pickupDate}
                time={search.pickupTime}
                min={today}
                onDate={onPickupDate}
                onTime={(t) => setSearch({ pickupTime: t })}
              />
              <ScheduleField
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
            </div>
            <Button
              block
              size="lg"
              className="mt-5"
              onClick={() => setScheduleOpen(false)}
            >
              Done
            </Button>
          </SheetContent>
        </Sheet>

        {error ? (
          <p role="alert" className="text-[13px] font-semibold text-danger">
            {error}
          </p>
        ) : null}

        <Button
          onClick={onSearch}
          size="lg"
          block
          className="h-14 rounded-[var(--radius-md)] text-base font-bold"
        >
          Go
        </Button>
      </div>

      {/* Footer perks */}
      <div className="grid grid-cols-2 border-t border-hairline">
        <div className="flex items-center gap-2.5 border-r border-hairline px-4 py-4 sm:px-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Home className="size-4" />
          </span>
          <span className="min-w-0 text-left text-[12px] leading-snug text-ink-600">
            <span className="block font-semibold text-ink-800">
              Doorstep delivery
            </span>
            Available in your city
          </span>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-4 sm:px-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-jade-50 text-jade-600">
            <Gauge className="size-4" />
          </span>
          <span className="min-w-0 text-left text-[12px] leading-snug text-ink-600">
            <span className="block font-semibold text-ink-800">
              Choose your
            </span>
            KM Package
          </span>
        </div>
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

const fieldClass =
  "flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-ink-200 bg-surface px-4 py-[15px] transition-colors hover:border-ink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function ScheduleField({
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
    <div className="rounded-[var(--radius-md)] border border-hairline bg-surface-sunken p-3.5">
      <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
        {label}
      </span>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="date"
          value={date}
          min={min}
          onChange={(e) => onDate(e.target.value)}
          aria-label={`${label} date`}
          className="min-w-0 flex-1 rounded-md border border-hairline bg-surface px-2.5 py-2 text-sm font-semibold text-ink-900 outline-none focus:border-brand-300"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => onTime(e.target.value)}
          aria-label={`${label} time`}
          className="w-[6.5rem] shrink-0 rounded-md border border-hairline bg-surface px-2.5 py-2 text-sm font-semibold text-ink-900 outline-none focus:border-brand-300"
        />
      </div>
    </div>
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
