"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Plane } from "lucide-react";
import type { Branch } from "@/content/site";
import { BRANCHES } from "@/content/site";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const MapInner = dynamic(() => import("./pickup-map-inner"), {
  ssr: false,
  loading: () => (
    <Skeleton className="grid h-[320px] w-full place-items-center rounded-[var(--radius-lg)] text-sm text-ink-500">
      Loading map…
    </Skeleton>
  ),
});

function BranchList({
  branches,
  draftId,
  onSelectId,
}: {
  branches: Branch[];
  draftId: string;
  onSelectId: (id: string) => void;
}) {
  return (
    <ul className="max-h-[320px] space-y-1 overflow-y-auto rounded-[var(--radius-lg)] bg-surface-sunken p-2">
      {branches.map((b) => {
        const active = draftId === b.id;
        return (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => onSelectId(b.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left transition-colors",
                active ? "bg-surface shadow-e1" : "hover:bg-surface/70"
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  active ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-500"
                )}
              >
                {b.type === "airport" ? (
                  <Plane className="size-4" />
                ) : (
                  <MapPin className="size-4" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink-900">
                  {b.name}
                </span>
                <span className="text-xs capitalize text-ink-500">
                  {b.city} · {b.type}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function PickupMapPicker({
  open,
  onOpenChange,
  branches = BRANCHES,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches?: Branch[];
  selectedId?: string;
  onSelect: (branch: Branch) => void;
}) {
  const [draftId, setDraftId] = useState(selectedId || "");
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (open) {
      setDraftId(selectedId || "");
      setMapError(false);
    }
  }, [open, selectedId]);

  useEffect(() => {
    if (!open || mapError) return;
    const onChunkError = (event: ErrorEvent) => {
      const msg = event.message || "";
      if (msg.includes("Failed to load chunk") || msg.includes("leaflet")) {
        setMapError(true);
      }
    };
    window.addEventListener("error", onChunkError);
    return () => window.removeEventListener("error", onChunkError);
  }, [open, mapError]);

  const draft = useMemo(
    () => branches.find((b) => b.id === draftId) ?? null,
    [branches, draftId]
  );

  function confirm() {
    if (!draft) return;
    onSelect(draft);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="border-b border-hairline px-6 pb-5 pt-6">
          <DialogHeader>
            <DialogTitle>Choose a location on the map</DialogTitle>
            <p className="text-sm text-ink-500">
              Tap any TranzCars pickup point across Kerala.
            </p>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {mapError ? (
            <BranchList
              branches={branches}
              draftId={draftId}
              onSelectId={setDraftId}
            />
          ) : open ? (
            <MapInner
              branches={branches}
              selectedId={draftId}
              onSelectId={setDraftId}
              onError={() => setMapError(true)}
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-hairline px-6 py-4">
          <p className="min-w-0 truncate text-[13px] text-ink-500">
            {draft ? (
              <>
                Selected:{" "}
                <span className="font-bold text-ink-900">{draft.name}</span>
              </>
            ) : (
              "Select a marker to continue"
            )}
          </p>
          <Button disabled={!draft} onClick={confirm} className="shrink-0">
            Use this location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
