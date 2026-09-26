"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyAvailability,
  setMyAvailability,
  updateMyTechnicianProfile,
  type UpdateTechnicianProfilePayload,
} from "@/api/technician";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { AvailabilitySlot } from "@/types/technician";

// ⚠️ /technician/availability ফ্ল্যাট ধরে নিচ্ছি (bookings/payments/services-এর প্যাটার্ন অনুসরণ করে)
export function useMyAvailability() {
  return useQuery({
    queryKey: queryKeys.technicians.myAvailability,
    queryFn: getMyAvailability,
  });
}

export function useUpdateTechnicianProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTechnicianProfilePayload) =>
      updateMyTechnicianProfile(payload),
    onSuccess: () => {
      // নিজের প্রোফাইল /technicians/:id (public) দিয়েই পড়ি, তাই ওই পুরো গ্রুপ invalidate
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      toast.success("প্রোফাইল আপডেট হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "প্রোফাইল আপডেট করা যায়নি",
      );
    },
  });
}

export function useSetAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slots: AvailabilitySlot[]) => setMyAvailability(slots),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicians.myAvailability,
      });
      toast.success("Availability আপডেট হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Availability সেভ করা যায়নি",
      );
    },
  });
}
