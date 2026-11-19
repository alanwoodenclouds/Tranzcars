"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = [
  { id: "All", label: "All vehicles" },
  { id: "car", label: "Cars" },
  { id: "bike", label: "Bikes" },
];

const TRANSMISSIONS = ["All", "Automatic", "Manual"];
const CAR_TYPES = ["All", "Hatchback", "Sedan", "SUV", "Compact SUV", "MUV"];
const BIKE_TYPES = ["All", "E-Scooter", "Motorcycle"];

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "seats-desc", label: "Most seats" },
];

function useFilterState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (!value || value === "All") params.delete(key);
        else params.set(key, value);
      }
      if ("category" in patch) params.delete("type");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  return {
    category: searchParams.get("category") ?? "All",
    transmission: searchParams.get("transmission") ?? "All",
    type: searchParams.get("type") ?? "All",
    q: searchParams.get("q") ?? "",
    sort: searchParams.get("sort") ?? "recommended",
    set,
    hasFilters: ["category", "transmission", "type", "q"].some((k) =>
      searchParams.get(k)
    ),
  };
}

/** Desktop sidebar. */
export function FleetFilters() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[184px] rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
        <FilterPanel />
      </div>
    </aside>
  );
}

/** Result count, sort control, and the mobile filter entry point. */
export function FleetToolbar({ count }: { count: number }) {
  const { sort, set, hasFilters } = useFilterState();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13.5px] font-semibold text-ink-600">
        <span className="text-numeric text-ink-900">{count}</span>{" "}
        {count === 1 ? "vehicle" : "vehicles"} available
      </p>

      <div className="flex min-w-0 items-center gap-2">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 lg:hidden">
              <SlidersHorizontal />
              Filters
              {hasFilters ? (
                <span className="size-1.5 rounded-full bg-brand-500" />
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[88vh] px-5 pb-6 pt-4">
            <SheetHeader>
              <SheetTitle>Filter the fleet</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex-1 overflow-y-auto">
              <FilterPanel onDone={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <label className="sr-only" htmlFor="fleet-sort">
          Sort vehicles
        </label>
        <Select
          id="fleet-sort"
          value={sort}
          onChange={(e) => set({ sort: e.target.value })}
          className="h-9 min-w-0 flex-1 text-[13px] sm:w-[168px] sm:flex-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

function FilterPanel({ onDone }: { onDone?: () => void }) {
  const { category, transmission, type, q, set, hasFilters } = useFilterState();
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    if (query === q) return;
    const id = window.setTimeout(() => set({ q: query || null }), 300);
    return () => window.clearTimeout(id);
  }, [query, q, set]);

  const typeOptions =
    category === "bike"
      ? BIKE_TYPES
      : category === "car"
        ? CAR_TYPES
        : ["All", ...CAR_TYPES.slice(1), ...BIKE_TYPES.slice(1)];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[15px] font-bold">Filters</p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() =>
              set({ category: null, transmission: null, type: null, q: null })
            }
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 hover:underline"
          >
            <X className="size-3" />
            Clear all
          </button>
        ) : null}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Swift, Thar, scooter…"
          aria-label="Search the fleet"
          className="h-11 w-full rounded-[var(--radius-md)] border border-hairline bg-surface pl-10 pr-3 text-sm font-medium placeholder:font-normal placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/12"
        />
      </div>

      <FilterGroup
        label="Vehicle"
        options={CATEGORIES.map((c) => c.id)}
        labels={Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))}
        value={category}
        onChange={(v) => set({ category: v })}
      />

      {category !== "bike" ? (
        <FilterGroup
          label="Transmission"
          options={TRANSMISSIONS}
          value={transmission}
          onChange={(v) => set({ transmission: v })}
        />
      ) : null}

      <FilterGroup
        label="Body type"
        options={typeOptions}
        value={type}
        onChange={(v) => set({ type: v })}
      />

      {onDone ? (
        <Button block onClick={onDone}>
          Show results
        </Button>
      ) : null}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  labels?: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                active
                  ? "bg-ink-900 text-white"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              )}
            >
              {labels?.[option] ?? option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
