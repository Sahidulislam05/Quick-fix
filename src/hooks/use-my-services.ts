"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createService,
  deleteService,
  getMyServices,
  updateService,
  type ServicePayload,
} from "@/api/service";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

// ⚠️ /services/my-services ফ্ল্যাট ধরে নিচ্ছি (নিজের getMyServices-এর মূল অনুমান, bookings/payments-এর প্যাটার্নের সাথে মিলিয়ে)
export function useMyServices() {
  return useQuery({
    queryKey: queryKeys.services.mine,
    queryFn: getMyServices,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServicePayload) => createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.mine });
      toast.success("সার্ভিস তৈরি হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "সার্ভিস তৈরি করা যায়নি",
      );
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ServicePayload>;
    }) => updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.mine });
      toast.success("সার্ভিস আপডেট হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "সার্ভিস আপডেট করা যায়নি",
      );
    },
  });
}

export function useDeactivateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.mine });
      toast.success("সার্ভিস ডিঅ্যাক্টিভেট হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "সার্ভিস ডিঅ্যাক্টিভেট করা যায়নি",
      );
    },
  });
}
