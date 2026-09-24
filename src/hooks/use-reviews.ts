"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReview } from "@/api/review";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      toast.success("রিভিউ জমা হয়েছে, ধন্যবাদ!");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "রিভিউ জমা দেওয়া যায়নি",
      );
    },
  });
}
