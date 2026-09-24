"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { useCreateReview } from "@/hooks/use-reviews";
import { revalidateTechnicianPage } from "@/lib/revalidate-technician";
import { cn } from "@/lib/utils";
import { reviewSchema, type ReviewFormValues } from "@/lib/validations/review";
import type { Booking } from "@/types/booking";

type ReviewDialogProps = {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReviewDialog({
  booking,
  open,
  onOpenChange,
}: ReviewDialogProps) {
  const createReview = useCreateReview();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const rating = form.watch("rating");

  async function onSubmit(values: ReviewFormValues) {
    const review = await createReview
      .mutateAsync({
        bookingId: booking.id,
        rating: values.rating,
        comment: values.comment,
      })
      .catch(() => null);
    if (!review) return;

    await revalidateTechnicianPage(booking.technicianId);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a review</DialogTitle>
          <DialogDescription>
            {booking.service?.title ?? "এই সার্ভিস"} নিয়ে তোমার অভিজ্ঞতা শেয়ার
            করো।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} stars`}
                  onClick={() =>
                    form.setValue("rating", n, { shouldValidate: true })
                  }
                >
                  <Star
                    className={cn(
                      "size-7 transition-colors",
                      n <= rating
                        ? "fill-rating text-rating"
                        : "text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-xs text-destructive">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review-comment">Comment</Label>
            <Textarea
              id="review-comment"
              placeholder="কাজের মান, সময়ানুবর্তিতা নিয়ে লেখো..."
              {...form.register("comment")}
            />
            {form.formState.errors.comment && (
              <p className="text-xs text-destructive">
                {form.formState.errors.comment.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={createReview.isPending}
            >
              {createReview.isPending && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              Submit review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
