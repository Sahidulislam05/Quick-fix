"use client";

import { useState } from "react";
import { CancelBookingDialog } from "@/components/features/cancel-booking-dialog";
import { ReviewDialog } from "@/components/features/review-dialog";
import { Button } from "@/components/ui/button";
import { BOOKING_ACTIONS_BY_STATUS } from "@/constants/booking";
import type { Booking } from "@/types/booking";

export function BookingActions({ booking }: { booking: Booking }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const actions = BOOKING_ACTIONS_BY_STATUS[booking.status]?.CUSTOMER ?? [];
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {actions.map((item) => {
        if (item.action === "PAY") {
          return (
            <Button key={item.action} size="sm" disabled title="Part 9-এ চালু হবে">
              {item.label}
            </Button>
          );
        }
        if (item.action === "CANCEL") {
          return (
            <Button key={item.action} size="sm" variant="outline" onClick={() => setCancelOpen(true)}>
              {item.label}
            </Button>
          );
        }
        if (item.action === "REVIEW") {
          return (
            <Button key={item.action} size="sm" variant="outline" onClick={() => setReviewOpen(true)}>
              {item.label}
            </Button>
          );
        }
        return null;
      })}

      <CancelBookingDialog bookingId={booking.id} open={cancelOpen} onOpenChange={setCancelOpen} />
      <ReviewDialog booking={booking} open={reviewOpen} onOpenChange={setReviewOpen} />
    </div>
  );
}