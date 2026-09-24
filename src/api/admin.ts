import { apiClient } from "@/lib/api-client";
import type { PaginationMeta } from "@/types/api";
import type { Booking } from "@/types/booking";
import type { ActiveStatus, User } from "@/types/user";

export type AdminUserFilters = {
  page?: number;
  limit?: number;
};

export async function getAllUsers(filters: AdminUserFilters = {}) {
  const res = await apiClient<{ data: User[]; meta: PaginationMeta }>(
    "/admin/users",
    {
      params: filters,
    },
  );
  return { data: res.data, meta: res.meta };
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
  const res = await apiClient<{ data: Booking[] }>("/admin/bookings");
  return res.data;
}
