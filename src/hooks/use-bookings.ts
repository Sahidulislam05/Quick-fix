"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
  getTechnicianBookings,
  updateBookingStatus,
} from "@/api/booking";
import type { BookingStatus } from "@/constants/booking";
import { STALE_TIME } from "@/constants/query";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

export function useMyBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.mine,
    queryFn: getMyBookings,
    staleTime: STALE_TIME.OWN_DATA,
  });
}

export function useTechnicianBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.technicianMine,
    queryFn: getTechnicianBookings,
    staleTime: STALE_TIME.OWN_DATA,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // নতুন বুকিং হলে কাস্টমারের লিস্ট পুরনো হয়ে গেলো
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      toast.success("Booking request sent!");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Booking failed");
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelBooking(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.detail(variables.id),
      });
      toast.success("Booking cancelled");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not cancel booking",
      );
    },
  });
}

type UpdateStatusVars = {
  id: string;
  status: Extract<
    BookingStatus,
    "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
  >;
};

const STATUS_SUCCESS_MESSAGE: Record<UpdateStatusVars["status"], string> = {
  ACCEPTED: "Booking accepted",
  DECLINED: "Booking declined",
  IN_PROGRESS: "Job marked as started",
  COMPLETED: "Job marked as completed",
};

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusVars) =>
      updateBookingStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.technicianMine,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.detail(variables.id),
      });
      toast.success(STATUS_SUCCESS_MESSAGE[variables.status]);
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update booking",
      );
    },
  });
}
