"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCancelBooking } from "@/hooks/use-bookings";

type CancelBookingDialogProps = {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CancelBookingDialog({
  bookingId,
  open,
  onOpenChange,
}: CancelBookingDialogProps) {
  const [reason, setReason] = useState("");
  const cancelBooking = useCancelBooking();

  async function handleConfirm() {
    const result = await cancelBooking
      .mutateAsync({
        id: bookingId,
        reason: reason.trim() || "Cancelled by customer",
      })
      .catch(() => null);
    if (!result) return;
    onOpenChange(false);
    setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            এই বুকিংটা বাতিল হয়ে যাবে, এটা ফিরিয়ে নেওয়া যাবে না।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="cancel-reason">Reason (optional)</Label>
          <Textarea
            id="cancel-reason"
            placeholder="কেন বাতিল করছো?"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep booking
          </Button>
          <Button
            variant="destructive"
            disabled={cancelBooking.isPending}
            onClick={handleConfirm}
          >
            {cancelBooking.isPending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            Yes, cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
