"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyAvailability,
  setMyAvailability,
  updateMyTechnicianProfile,
  type UpdateTechnicianProfilePayload,
} from "@/api/technician";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { revalidateTechnicianPage } from "@/lib/revalidate-technician";
import type { AvailabilitySlot } from "@/types/technician";

export function useMyAvailability() {
  return useQuery({
    queryKey: queryKeys.technicians.myAvailability,
    queryFn: getMyAvailability,
  });
}

export function useUpdateTechnicianProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (payload: UpdateTechnicianProfilePayload) =>
      updateMyTechnicianProfile(payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      if (user) await revalidateTechnicianPage(user.id);
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
