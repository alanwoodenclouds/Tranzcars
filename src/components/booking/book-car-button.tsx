"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import { isSearchComplete } from "@/store/useBookingsStore";
import { TripScheduleDialog } from "@/components/booking/trip-schedule-dialog";
import { Button, type ButtonProps } from "@/components/ui/button";

export function BookCarButton({
  carSlug,
  carName,
  carId,
  className,
  children = "Book this car",
  variant,
  size = "lg",
  block,
}: {
  carSlug: string;
  carName: string;
  carId?: string;
  className?: string;
  children?: React.ReactNode;
} & Pick<ButtonProps, "variant" | "size" | "block">) {
  const router = useRouter();
  const search = useBookingStore((s) => s.search);
  const setSearch = useBookingStore((s) => s.setSearch);
  const [open, setOpen] = useState(false);
  const tripReady = isSearchComplete(search);

  function remember() {
    setSearch({
      selectedCarSlug: carSlug,
      ...(carId ? { selectedCarId: carId } : {}),
    });
  }

  function goCheckout() {
    remember();
    router.push(`/checkout?car=${carSlug}`);
  }

  function onClick() {
    remember();
    if (isSearchComplete(search)) {
      goCheckout();
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        onClick={onClick}
        className={className}
        variant={variant}
        size={size}
        block={block}
      >
        {tripReady ? children : "Set trip to book"}
      </Button>
      <TripScheduleDialog
        open={open}
        onOpenChange={setOpen}
        carName={carName}
        continueLabel="Continue to checkout"
        onContinue={() => {
          setOpen(false);
          goCheckout();
        }}
      />
    </>
  );
}
