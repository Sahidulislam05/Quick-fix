"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllBookingsAdmin,
  getAllUsers,
  setUserActiveStatus,
} from "@/api/admin";
import {
  createCategory,
  updateCategory,
  type CategoryPayload,
} from "@/api/category";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { revalidatePublicPages } from "@/lib/revalidate-public";
import type { ActiveStatus } from "@/types/user";

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.users.admin({ limit: 100 }),
    queryFn: getAllUsers,
  });
}

export function useSetUserActiveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      activeStatus,
    }: {
      userId: string;
      activeStatus: ActiveStatus;
    }) => setUserActiveStatus(userId, activeStatus),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
      toast.success(
        variables.activeStatus === "BLOCKED" ? "User banned" : "User unbanned",
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update user",
      );
    },
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.admin,
    queryFn: getAllBookingsAdmin,
  });
}

export function useCreateCategoryAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      await revalidatePublicPages();
      toast.success("ক্যাটাগরি তৈরি হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "ক্যাটাগরি তৈরি করা যায়নি",
      );
    },
  });
}

export function useUpdateCategoryAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CategoryPayload>;
    }) => updateCategory(id, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      await revalidatePublicPages();
      toast.success("ক্যাটাগরি আপডেট হয়েছে");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "ক্যাটাগরি আপডেট করা যায়নি",
      );
    },
  });
}
