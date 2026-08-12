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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

type Value = {
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
};

type Props = Value & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (next: Value) => void;
};

/** Centered dual-month date range modal. */
export function DateRangeDialog({
  open,
  onOpenChange,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  onConfirm,
}: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() =>
    startOfMonth(pickupDate ? parseISO(pickupDate) : new Date())
  );
  const [start, setStart] = useState<Date | null>(
    pickupDate ? parseISO(pickupDate) : null
  );
  const [end, setEnd] = useState<Date | null>(
    dropoffDate ? parseISO(dropoffDate) : null
  );
  const [startTime, setStartTime] = useState(pickupTime || "10:00");
  const [endTime, setEndTime] = useState(dropoffTime || "10:00");
  const [picking, setPicking] = useState<"start" | "end">("start");

  useEffect(() => {
    if (!open) return;
    const s = pickupDate ? parseISO(pickupDate) : null;
    const e = dropoffDate ? parseISO(dropoffDate) : null;
    setStart(s);
    setEnd(e);
    setStartTime(pickupTime || "10:00");
    setEndTime(dropoffTime || "10:00");
    setPicking(s && !e ? "end" : "start");
    setView(startOfMonth(s ?? startOfDay(new Date())));
  }, [open, pickupDate, dropoffDate, pickupTime, dropoffTime]);

  function onDayClick(day: Date) {
    if (isBefore(day, today)) return;

    if (picking === "start" || !start || (start && end)) {
      setStart(day);
      setEnd(null);
      setPicking("end");
      return;
    }

    if (isBefore(day, start) || isSameDay(day, start)) {
      setStart(day);
      setEnd(null);
      setPicking("end");
      return;
    }

    setEnd(day);
    setPicking("start");
  }

  function confirm() {
    if (!start) return;
    const endDate = end ?? addDays(start, 1);
    onConfirm({
      pickupDate: iso(start),
      pickupTime: startTime,
      dropoffDate: iso(endDate),
      dropoffTime: endTime,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(720px,calc(100%-1.5rem))] gap-0 p-0">
        <div className="border-b border-hairline px-5 py-4 sm:px-6">
          <DialogHeader>
            <DialogTitle>Select date range</DialogTitle>
            <p className="text-sm text-ink-500">
              Minimum {BUSINESS_RULES.minRentalHours}h rental ·{" "}
              {picking === "end" && start && !end
                ? "Now pick your return date"
                : "Pick start, then return"}
            </p>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              disabled={isSameMonth(view, today) || isBefore(view, today)}
              onClick={() => setView((v) => addMonths(v, -1))}
              className="grid size-9 place-items-center rounded-full text-ink-600 hover:bg-ink-100 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="hidden flex-1 grid-cols-2 gap-8 sm:grid">
              <p className="text-center text-[15px] font-bold text-ink-900">
                {format(view, "MMMM yyyy")}
              </p>
              <p className="text-center text-[15px] font-bold text-ink-900">
                {format(addMonths(view, 1), "MMMM yyyy")}
              </p>
            </div>
            <p className="flex-1 text-center text-[15px] font-bold text-ink-900 sm:hidden">
              {format(view, "MMMM yyyy")}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView((v) => addMonths(v, 1))}
              className="grid size-9 place-items-center rounded-full text-ink-600 hover:bg-ink-100"
            >
              <ChevronRight className="size-5" />
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <TimeSelect
              label="Pick-up time"
              value={startTime}
              onChange={setStartTime}
            />
            <TimeSelect
              label="Return time"
              value={endTime}
              onChange={setEndTime}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-hairline px-5 py-4 sm:px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={!start}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TimeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-[var(--radius-md)] border border-ink-200 bg-surface px-3 text-sm font-semibold text-ink-900 outline-none focus:border-brand-300"
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
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
      <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-bold uppercase tracking-wide text-ink-400">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
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
                "relative mx-auto flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
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
