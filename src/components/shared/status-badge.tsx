import { BOOKING_STATUS_META, type BookingStatus } from "@/constants/booking";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: BookingStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = BOOKING_STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
