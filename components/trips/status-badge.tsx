import { CalendarClock, CheckCircle2, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/booking/bookings-store";

const MAP: Record<
  BookingStatus,
  { label: string; tone: BadgeProps["tone"]; icon: React.ElementType }
> = {
  upcoming: { label: "Upcoming", tone: "info", icon: CalendarClock },
  completed: { label: "Completed", tone: "success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", tone: "neutral", icon: XCircle },
};

export function StatusBadge({
  status,
  size = "md",
}: {
  status: BookingStatus;
  size?: BadgeProps["size"];
}) {
  const config = MAP[status];
  const Icon = config.icon;
  return (
    <Badge tone={config.tone} size={size}>
      <Icon />
      {config.label}
    </Badge>
  );
}
