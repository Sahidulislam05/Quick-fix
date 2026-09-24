"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMyProfile, type UpdateMyProfilePayload } from "@/api/user";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) => updateMyProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.me, user);
      toast.success("প্রোফাইল আপডেট হয়েছে");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "প্রোফাইল আপডেট করা যায়নি");
    },
  });
}