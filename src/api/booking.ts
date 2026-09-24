import type { BookingStatus } from "@/constants/booking";
import { apiClient } from "@/lib/api-client";
import type { Booking } from "@/types/booking";

export type CreateBookingPayload = {
  serviceId: string;
  scheduledDate: string;
  address: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  const res = await apiClient<{ data: { booking: Booking } }>("/bookings", {
    method: "POST",
    body: payload,
  });
  return res.data.booking;
}

export async function getMyBookings() {
  const res = await apiClient<{ data: Booking[] }>("/bookings");
  return res.data;
}

export async function getBookingById(id: string) {
  const res = await apiClient<{ data: Booking }>(`/bookings/${id}`);
  return res.data;
}

export async function cancelBooking(id: string, cancelReason: string) {
  const res = await apiClient<{ data: Booking }>(`/bookings/${id}/cancel`, {
    method: "PATCH",
    body: { cancelReason },
  });
  return res.data;
}

export async function getTechnicianBookings() {
  const res = await apiClient<{ data: Booking[] }>("/technician/bookings");
  return res.data;
}

export async function updateBookingStatus(
  id: string,
  status: Extract<
    BookingStatus,
    "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
  >,
) {
  const res = await apiClient<{ data: Booking }>(`/technician/bookings/${id}`, {
    method: "PATCH",
    body: { status },
  });
  return res.data;
}
