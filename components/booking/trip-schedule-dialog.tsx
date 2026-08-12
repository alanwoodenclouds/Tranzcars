"use client";

import { useEffect, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { Map, MapPin, Route } from "lucide-react";
import type { Branch } from "@/content/site";
import { BRANCHES, BUSINESS_RULES } from "@/content/site";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PickupMapPicker } from "@/components/booking/pickup-map-picker";
import { useBookingStore } from "@/lib/booking/store";
import { assertSearchValid } from "@/lib/booking/bookings-store";

const iso = (d: Date) => format(d, "yyyy-MM-dd");

/** Blocking step for the search-first flow: complete the trip, then continue. */
export function TripScheduleDialog({
  open,
  onOpenChange,
  carName,
  onContinue,
  continueLabel = "Continue to checkout",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carName: string;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const search = useBookingStore((s) => s.search);
  const setSearch = useBookingStore((s) => s.setSearch);
  const [mapOpen, setMapOpen] = useState(false);
  const [error, setError] = useState("");
  const [sameAsPickup, setSameAsPickup] = useState(true);

  useEffect(() => {
    if (!open) return;
    setError("");
    setSameAsPickup(
      !search.dropoffBranchId ||
        search.dropoffBranchId === search.pickupBranchId
    );
  }, [open, search.dropoffBranchId, search.pickupBranchId]);

  const labelFor = (branch: Branch) => `${branch.name}, ${branch.city}`;

  function selectPickup(branch: Branch) {
    setSearch({
      pickupBranchId: branch.id,
      pickupLabel: labelFor(branch),
      ...(sameAsPickup || !search.dropoffBranchId
        ? { dropoffBranchId: branch.id, dropoffLabel: labelFor(branch) }
        : {}),
    });
    setError("");
  }

  function selectDropoff(id: string) {
    const branch = BRANCHES.find((b) => b.id === id);
    if (!branch) return;
    setSameAsPickup(false);
    setSearch({
      dropoffBranchId: branch.id,
      dropoffLabel: labelFor(branch),
    });
    setError("");
  }

  function onSameAsPickup(checked: boolean) {
    setSameAsPickup(checked);
    const branch = BRANCHES.find((b) => b.id === search.pickupBranchId);
    if (checked && branch) {
      setSearch({
        dropoffBranchId: branch.id,
        dropoffLabel: labelFor(branch),
      });
    }
  }

  function onPickupDate(value: string) {
    const patch: Record<string, string> = { pickupDate: value };
    if (value && (!search.dropoffDate || search.dropoffDate < value)) {
      patch.dropoffDate = iso(addDays(parseISO(value), 1));
    }
    setSearch(patch);
    setError("");
  }

  function handleContinue() {
    const message = assertSearchValid(search, BUSINESS_RULES.minRentalHours);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    onContinue();
  }

  const today = iso(new Date());

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="border-b border-hairline px-6 pb-5 pt-6">
            <DialogHeader>
              <DialogTitle>Set your trip</DialogTitle>
              <p className="text-sm text-ink-500">
                We need pick-up, drop-off and times before booking the{" "}
                <span className="font-semibold text-ink-800">{carName}</span>.
              </p>
            </DialogHeader>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <Field label="Pick-up location" htmlFor="trip-pickup">
              <div className="flex gap-2">
                <Select
                  id="trip-pickup"
                  wrapperClassName="flex-1"
                  value={search.pickupBranchId}
                  onChange={(e) => {
                    const branch = BRANCHES.find((b) => b.id === e.target.value);
                    if (branch) selectPickup(branch);
                  }}
                >
                  <option value="">Choose a location</option>
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}, {b.city}
                    </option>
                  ))}
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMapOpen(true)}
                  className="shrink-0"
                >
                  <Map />
                  Map
                </Button>
              </div>
            </Field>

            <Field
              label="Drop-off location"
              htmlFor="trip-dropoff"
              hint={
                search.pickupLabel || search.dropoffLabel
                  ? undefined
                  : "Most travellers return to the same branch."
              }
            >
              <div className="space-y-2.5">
                <Select
                  id="trip-dropoff"
                  value={search.dropoffBranchId}
                  disabled={sameAsPickup}
                  onChange={(e) => selectDropoff(e.target.value)}
                >
                  <option value="">Choose a location</option>
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}, {b.city}
                    </option>
                  ))}
                </Select>
                <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-ink-600">
                  <input
                    type="checkbox"
                    checked={sameAsPickup}
                    onChange={(e) => onSameAsPickup(e.target.checked)}
                    className="size-4 rounded border-ink-300 accent-brand-500"
                  />
                  Return to the pick-up point
                </label>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trip starts" htmlFor="trip-start-date">
                <div className="flex gap-2">
                  <Input
                    id="trip-start-date"
                    type="date"
                    min={today}
                    value={search.pickupDate}
                    onChange={(e) => onPickupDate(e.target.value)}
                    required
                  />
                  <Input
                    type="time"
                    aria-label="Pick-up time"
                    value={search.pickupTime}
                    onChange={(e) => setSearch({ pickupTime: e.target.value })}
                    className="w-[104px] shrink-0"
                    required
                  />
                </div>
              </Field>

              <Field label="Trip ends" htmlFor="trip-end-date">
                <div className="flex gap-2">
                  <Input
                    id="trip-end-date"
                    type="date"
                    min={search.pickupDate || today}
                    value={search.dropoffDate}
                    onChange={(e) => {
                      setSearch({ dropoffDate: e.target.value });
                      setError("");
                    }}
                    required
                  />
                  <Input
                    type="time"
                    aria-label="Drop-off time"
                    value={search.dropoffTime}
                    onChange={(e) => setSearch({ dropoffTime: e.target.value })}
                    className="w-[104px] shrink-0"
                    required
                  />
                </div>
              </Field>
            </div>

            {search.pickupLabel ? (
              <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-surface-sunken px-3.5 py-3 text-[13px] text-ink-600">
                <Route className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>
                  {search.pickupLabel}
                  {" → "}
                  {search.dropoffLabel || "drop-off pending"}
                </span>
              </p>
            ) : null}

            {error ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-[var(--radius-md)] bg-danger-soft px-3.5 py-3 text-[13px] font-semibold text-danger"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex gap-2 border-t border-hairline px-6 py-4">
            <Button
              variant="outline"
              block
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button block onClick={handleContinue}>
              {continueLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PickupMapPicker
        open={mapOpen}
        onOpenChange={setMapOpen}
        selectedId={search.pickupBranchId}
        onSelect={selectPickup}
      />
    </>
  );
}
