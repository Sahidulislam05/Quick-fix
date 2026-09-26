"use client";

import { Button } from "@/components/ui/button";
import { BOOKING_ACTIONS_BY_STATUS, type BookingStatus } from "@/constants/booking";
import { useUpdateBookingStatus } from "@/hooks/use-bookings";
import type { Booking } from "@/types/booking";

type TransitionStatus = Extract<BookingStatus, "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED">;

const ACTION_TO_STATUS: Record<string, TransitionStatus> = {
  ACCEPT: "ACCEPTED",
  DECLINE: "DECLINED",
  START: "IN_PROGRESS",
  COMPLETE: "COMPLETED",
};

export function TechnicianBookingActions({ booking }: { booking: Booking }) {
  const updateStatus = useUpdateBookingStatus();
  const actions = BOOKING_ACTIONS_BY_STATUS[booking.status]?.TECHNICIAN ?? [];
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {actions.map((item) => {
        const nextStatus = ACTION_TO_STATUS[item.action];
        if (!nextStatus) return null;
        return (
          <Button
            key={item.action}
            size="sm"
            variant={item.action === "DECLINE" ? "outline" : "default"}
            disabled={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ id: booking.id, status: nextStatus })}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}