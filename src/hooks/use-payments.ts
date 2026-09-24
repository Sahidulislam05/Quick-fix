"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPaymentSession,
  getMyPayments,
  getPaymentById,
} from "@/api/payment";
import { STALE_TIME } from "@/constants/query";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

export function useMyPayments() {
  return useQuery({
    queryKey: queryKeys.payments.mine,
    queryFn: getMyPayments,
    staleTime: STALE_TIME.OWN_DATA,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });
}

export function useCreatePaymentSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.mine });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Payment could not be started",
      );
    },
  });
}
