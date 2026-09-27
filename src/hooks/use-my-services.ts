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
import { useCurrentUser } from "@/hooks/use-current-user";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { revalidatePublicPages } from "@/lib/revalidate-public";
import { revalidateTechnicianPage } from "@/lib/revalidate-technician";

export function useMyServices() {
  return useQuery({
    queryKey: queryKeys.services.mine,
    queryFn: getMyServices,
  });
}

async function revalidateServicePages(technicianId?: string) {
  if (technicianId) await revalidateTechnicianPage(technicianId);
  await revalidatePublicPages();
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (payload: ServicePayload) => createService(payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.mine });
      await revalidateServicePages(user?.id);
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
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ServicePayload>;
    }) => updateService(id, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.mine });
      await revalidateServicePages(user?.id);
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
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.mine });
      await revalidateServicePages(user?.id);
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
