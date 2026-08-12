"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  CalendarRange,
  ChevronDown,
  MapPin,
  PencilLine,
} from "lucide-react";
import type { Branch } from "@/content/site";
import { BUSINESS_RULES } from "@/content/site";
import { useBookingStore } from "@/lib/booking/store";
import { isSearchComplete } from "@/lib/booking/bookings-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookingConsole } from "@/components/premium/booking-console";

function shortDate(value: string) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM");
  } catch {
    return value;
  }
}

/**
 * Sticky trip context for the fleet page. Collapsed when the trip is valid,
 * auto-expanded (and clearly flagged) when something is still missing.
 */
export function TripBar({ branches }: { branches: Branch[] }) {
  const search = useBookingStore((s) => s.search);
  const ready = isSearchComplete(search);
  const [expanded, setExpanded] = useState(false);
  const [touched, setTouched] = useState(false);

  // Open automatically until the traveller has a bookable trip.
  useEffect(() => {
    if (!touched) setExpanded(!ready);
  }, [ready, touched]);

  function toggle() {
    setTouched(true);
    setExpanded((v) => !v);
  }

  return (
    <div className="sticky top-16 z-30 -mx-5 border-b border-hairline bg-surface/85 px-5 backdrop-blur-xl sm:top-[72px] sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
      <div className="mx-auto max-w-[1200px] py-3">
        <div className="flex items-center gap-3">
          {ready ? (
            <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-[12.5px] font-semibold text-ink-800">
                <MapPin className="size-3.5 text-brand-500" />
                <span className="max-w-[15ch] truncate sm:max-w-none">
                  {search.pickupLabel}
                </span>
                {search.dropoffBranchId !== search.pickupBranchId ? (
                  <>
                    <span className="text-ink-400">→</span>
                    <span className="max-w-[15ch] truncate sm:max-w-none">
                      {search.dropoffLabel}
                    </span>
                  </>
                ) : null}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-[12.5px] font-semibold text-ink-800">
                <CalendarRange className="size-3.5 text-brand-500" />
                {shortDate(search.pickupDate)}, {search.pickupTime} —{" "}
                {shortDate(search.dropoffDate)}, {search.dropoffTime}
              </span>
            </div>
          ) : (
            <p className="flex min-w-0 flex-1 items-center gap-2 text-[13px] font-semibold text-warning">
              <AlertCircle className="size-4 shrink-0" />
              <span className="truncate">
                Add pick-up, drop-off and times to unlock booking
              </span>
            </p>
          )}

          <Button
            variant={ready ? "outline" : "primary"}
            size="sm"
            onClick={toggle}
            className="shrink-0"
            aria-expanded={expanded}
          >
            {ready ? (
              <>
                <PencilLine />
                <span className="hidden sm:inline">Change trip</span>
                <span className="sm:hidden">Edit</span>
              </>
            ) : (
              <>
                <span>Set trip</span>
                <ChevronDown
                  className={cn(
                    "transition-transform",
                    expanded && "rotate-180"
                  )}
                />
              </>
            )}
          </Button>
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-[var(--ease-out-quint)]",
            expanded
              ? "grid-rows-[1fr] pt-3 opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <BookingConsole branches={branches} className="shadow-e2" />
            <p className="mt-2 px-1 text-[12px] text-ink-400">
              Minimum {BUSINESS_RULES.minRentalHours}h rental. Searching updates
              the fleet below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
