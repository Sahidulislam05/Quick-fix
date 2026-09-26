import { apiClient } from "@/lib/api-client";
import { unwrapList } from "@/lib/unwrap-list";
import type { Booking } from "@/types/booking";
import type { ActiveStatus, User } from "@/types/user";

export async function getAllUsers() {
  const res = await apiClient<{ data: unknown }>("/admin/users", {
    params: { limit: 100 },
  });
  return unwrapList<User>(res.data, "users");
}

export async function setUserActiveStatus(
  userId: string,
  activeStatus: ActiveStatus,
) {
  const res = await apiClient<{ data: User }>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: { activeStatus },
  });
  return res.data;
}

export async function getAllBookingsAdmin() {
  const res = await apiClient<{ data: unknown }>("/admin/bookings");
  return unwrapList<Booking>(res.data, "bookings");
}
