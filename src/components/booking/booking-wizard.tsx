"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Map,
  MapPin,
  Plane,
} from "lucide-react";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const iso = (d: Date) => format(d, "yyyy-MM-dd");

const CITY_LABEL: Record<string, string> = {
  Kochi: "Cochin / Ernakulam",
  Trivandrum: "Trivandrum / Thiruvananthapuram",
  Kozhikode: "Kozhikode / Calicut",
};

const TYPE_LABEL: Record<Branch["type"], string> = {
  airport: "Airport",
  office: "Branch office",
  railway: "Railway station",
  delivery: "Doorstep delivery",
};

type Step = "city" | "location" | "dates" | "times";

export type BookingWizardResult = {
  pickupBranchId: string;
  pickupLabel: string;
  dropoffBranchId: string;
  dropoffLabel: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  initial?: Partial<BookingWizardResult>;
  /** Start at a specific step when editing */
  startStep?: Step;
  differentDropoff?: boolean;
  onComplete: (result: BookingWizardResult) => void;
  onOpenMap?: () => void;
};

const STEPS: Step[] = ["city", "location", "dates", "times"];

/**
 * Guided booking: City → Location → Dates → Times.
 */
export function BookingWizard({
  open,
  onOpenChange,
  branches,
  initial,
  startStep = "city",
  differentDropoff = false,
  onComplete,
  onOpenMap,
}: Props) {
  const cities = useMemo(
    () => Array.from(new Set(branches.map((b) => b.city))),
    [branches]
  );

  const [step, setStep] = useState<Step>(startStep);
  const [city, setCity] = useState<string | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [dropBranch, setDropBranch] = useState<Branch | null>(null);
  const [pickingDropoff, setPickingDropoff] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() => startOfMonth(new Date()));
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [pickingEnd, setPickingEnd] = useState(false);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");

  useEffect(() => {
    if (!open) return;

    const pickup = branches.find((b) => b.id === initial?.pickupBranchId) ?? null;
    const drop =
      branches.find((b) => b.id === initial?.dropoffBranchId) ?? pickup;

    setCity(pickup?.city ?? null);
    setBranch(pickup);
    setDropBranch(drop);
    setPickingDropoff(false);
    setFinishing(false);
    setPickupTime(initial?.pickupTime || "10:00");
    setDropoffTime(initial?.dropoffTime || "10:00");

    const s = initial?.pickupDate ? parseISO(initial.pickupDate) : null;
    const e = initial?.dropoffDate ? parseISO(initial.dropoffDate) : null;
    setStart(s);
    setEnd(e);
    setPickingEnd(Boolean(s && !e));
    setView(startOfMonth(s ?? new Date()));

    // Resolve start step from what's missing, unless explicitly editing dates/times
    if (startStep === "dates" || startStep === "times") {
      setStep(pickup ? startStep : "city");
    } else if (startStep === "location" && pickup?.city) {
      setStep("location");
    } else if (!pickup) {
      setStep("city");
    } else if (!s || !e) {
      setStep("dates");
    } else {
      setStep(startStep);
    }
  }, [open, initial, branches, startStep]);

  const cityBranches = useMemo(
    () => (city ? branches.filter((b) => b.city === city) : []),
    [branches, city]
  );

  const stepIndex = STEPS.indexOf(step);

  function goBack() {
    if (step === "location" && pickingDropoff) {
      setPickingDropoff(false);
      return;
    }
    if (stepIndex <= 0) {
      onOpenChange(false);
      return;
    }
    setStep(STEPS[stepIndex - 1]);
  }

  function selectCity(next: string) {
    setCity(next);
    setBranch(null);
    setDropBranch(null);
    setStep("location");
  }

  function selectLocation(b: Branch) {
    if (pickingDropoff) {
      setDropBranch(b);
      setPickingDropoff(false);
      setStep("dates");
      return;
    }
    setBranch(b);
    if (differentDropoff) {
      setDropBranch(null);
      setPickingDropoff(true);
      return;
    }
    setDropBranch(b);
    setStep("dates");
  }

  function onDayClick(day: Date) {
    if (isBefore(day, today)) return;
    if (!pickingEnd || !start || (start && end)) {
      setStart(day);
      setEnd(null);
      setPickingEnd(true);
      return;
    }
    if (isBefore(day, start) || isSameDay(day, start)) {
      setStart(day);
      setEnd(null);
      setPickingEnd(true);
      return;
    }
    setEnd(day);
    setPickingEnd(false);
  }

  function confirmDates() {
    if (!start) return;
    if (!end) setEnd(addDays(start, 1));
    setStep("times");
  }

  function finish() {
    if (!branch || !start || finishing) return;
    const endDate = end ?? addDays(start, 1);
    const drop = dropBranch ?? branch;
    setFinishing(true);
    onComplete({
      pickupBranchId: branch.id,
      pickupLabel: `${branch.name}, ${branch.city}`,
      dropoffBranchId: drop.id,
      dropoffLabel: `${drop.name}, ${drop.city}`,
      pickupDate: iso(start),
      pickupTime,
      dropoffDate: iso(endDate),
      dropoffTime,
    });
  }

  const titles: Record<Step, string> = {
    city: "Select your city",
    location: pickingDropoff
      ? "Select drop-off location"
      : "Select pick-up location",
    dates: "Select date range",
    times: "Select time",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 p-0",
          step === "dates" || step === "times"
            ? "max-w-md sm:max-w-[720px]"
            : "max-w-md sm:max-w-lg"
        )}
      >
        <div className="border-b border-hairline px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 pr-8">
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-ink-100"
            >
              <ArrowLeft className="size-4" />
            </button>
            <DialogHeader className="pr-0">
              <DialogTitle>{titles[step]}</DialogTitle>
              <p className="text-sm text-ink-500">
                Step {stepIndex + 1} of {STEPS.length}
                {city && step !== "city" ? ` · ${CITY_LABEL[city] ?? city}` : ""}
              </p>
            </DialogHeader>
          </div>

          {/* Slim progress bar */}
          <div className="mt-4 flex gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s}
                aria-hidden
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= stepIndex ? "bg-brand-500" : "bg-ink-100"
                )}
              />
            ))}
          </div>
        </div>

        <div
          className={cn(
            "overflow-y-auto px-5 py-4 sm:px-6",
            step === "dates" || step === "times"
              ? "max-h-[min(70vh,560px)]"
              : "max-h-[min(60vh,480px)]"
          )}
        >
          {step === "city" ? (
            <ul className="-mx-2">
              {cities.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => selectCity(c)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-3.5 text-left transition-colors hover:bg-ink-50",
                      city === c && "bg-brand-50"
                    )}
                  >
                    <span className="text-[15px] font-semibold text-ink-900">
                      {CITY_LABEL[c] ?? c}
                    </span>
                    <ChevronRight className="size-4 text-ink-300" />
                  </button>
                  <div className="mx-3 border-b border-hairline last:border-0" />
                </li>
              ))}
            </ul>
          ) : null}

          {step === "location" ? (
            <>
              <ul className="-mx-2">
                {cityBranches.map((b) => {
                  const active = pickingDropoff
                    ? dropBranch?.id === b.id
                    : branch?.id === b.id;
                  return (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => selectLocation(b)}
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
              {onOpenMap && !pickingDropoff ? (
                <Button
                  variant="outline"
                  block
                  className="mt-3"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenMap();
                  }}
                >
                  <Map />
                  Choose on map
                </Button>
              ) : null}
            </>
          ) : null}

          {step === "dates" ? (
            <div>
              <p className="mb-3 text-[13px] text-ink-500">
                Minimum {BUSINESS_RULES.minRentalHours}h rental ·{" "}
                {pickingEnd && start && !end
                  ? "Now pick return date"
                  : "Pick start, then return"}
              </p>

              <div className="mb-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={isSameMonth(view, today) || isBefore(view, today)}
                  onClick={() => setView((v) => addMonths(v, -1))}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-ink-100 disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div className="hidden flex-1 grid-cols-2 gap-6 sm:grid">
                  <p className="text-center text-[14px] font-bold text-ink-900">
                    {format(view, "MMMM yyyy")}
                  </p>
                  <p className="text-center text-[14px] font-bold text-ink-900">
                    {format(addMonths(view, 1), "MMMM yyyy")}
                  </p>
                </div>
                <p className="flex-1 text-center text-[14px] font-bold text-ink-900 sm:hidden">
                  {format(view, "MMMM yyyy")}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setView((v) => addMonths(v, 1))}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-ink-100"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <MonthGrid
                  month={view}
                  today={today}
                  start={start}
                  end={end}
                  onDayClick={onDayClick}
                />
                <MonthGrid
                  month={addMonths(view, 1)}
                  today={today}
                  start={start}
                  end={end}
                  onDayClick={onDayClick}
                  className="hidden sm:block"
                />
              </div>

              <Button
                block
                size="lg"
                className="mt-5"
                disabled={!start}
                onClick={confirmDates}
              >
                Continue
              </Button>
            </div>
          ) : null}

          {step === "times" ? (
            finishing ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Loader2 className="size-7 animate-spin" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-ink-900">
                    Searching available{" "}
                    {initial?.category === "bike" ? "bikes" : "cars"}…
                  </p>
                  <p className="mt-1 text-sm text-ink-500">
                    Matching your location and dates
                  </p>
                </div>
              </div>
            ) : (
            <div className="space-y-4">
              <p className="text-[13px] text-ink-500">
                {start ? format(start, "EEE, d MMM") : "—"}
                {" → "}
                {end
                  ? format(end, "EEE, d MMM")
                  : start
                    ? format(addDays(start, 1), "EEE, d MMM")
                    : "—"}
              </p>

              <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
                <div>
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
                    Pick-up time
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_OPTIONS.filter((_, i) => i % 2 === 0).map((t) => (
                      <button
                        key={`p-${t}`}
                        type="button"
                        onClick={() => setPickupTime(t)}
                        className={cn(
                          "rounded-[var(--radius-sm)] border px-2 py-2.5 text-[13px] font-semibold transition-colors",
                          pickupTime === t
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-hairline text-ink-700 hover:bg-ink-50"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
                    Return time
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_OPTIONS.filter((_, i) => i % 2 === 0).map((t) => (
                      <button
                        key={`d-${t}`}
                        type="button"
                        onClick={() => setDropoffTime(t)}
                        className={cn(
                          "rounded-[var(--radius-sm)] border px-2 py-2.5 text-[13px] font-semibold transition-colors",
                          dropoffTime === t
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-hairline text-ink-700 hover:bg-ink-50"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                block
                size="lg"
                className="mt-2"
                loading={finishing}
                onClick={finish}
              >
                {finishing ? "Searching…" : "Done"}
              </Button>
            </div>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MonthGrid({
  month,
  today,
  start,
  end,
  onDayClick,
  className,
}: {
  month: Date;
  today: Date;
  start: Date | null;
  end: Date | null;
  onDayClick: (d: Date) => void;
  className?: string;
}) {
  const days = useMemo(() => {
    const startDate = startOfWeek(startOfMonth(month));
    const endDate = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [month]);

  return (
    <div className={className}>
      <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wide text-ink-400">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const disabled = isBefore(day, today);
          const isStart = start ? isSameDay(day, start) : false;
          const isEnd = end ? isSameDay(day, end) : false;
          const inRange =
            start &&
            end &&
            isWithinInterval(day, { start, end }) &&
            !isStart &&
            !isEnd;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled || !inMonth}
              onClick={() => onDayClick(day)}
              className={cn(
                "mx-auto flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                !inMonth && "invisible",
                disabled && "cursor-not-allowed text-ink-300",
                !disabled &&
                  inMonth &&
                  !isStart &&
                  !isEnd &&
                  !inRange &&
                  "text-ink-800 hover:bg-ink-100",
                inRange && "bg-brand-50 text-brand-700",
                (isStart || isEnd) &&
                  "bg-brand-500 text-white hover:bg-brand-600"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
