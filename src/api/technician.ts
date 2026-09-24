import { apiClient } from "@/lib/api-client";
import type { PaginationMeta } from "@/types/api";
import type { AvailabilitySlot, TechnicianProfile } from "@/types/technician";

export type TechnicianFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function getTechnicians(filters: TechnicianFilters = {}) {
  const res = await apiClient<{
    data: TechnicianProfile[];
    meta: PaginationMeta;
  }>("/technicians", { params: filters });
  return { data: res.data, meta: res.meta };
}

export async function getTechnicianById(id: string) {
  const res = await apiClient<{ data: TechnicianProfile }>(
    `/technicians/${id}`,
  );
  return res.data;
}

export type UpdateTechnicianProfilePayload = {
  bio?: string;
  experienceYears?: number;
  skills?: string[];
};

export async function updateMyTechnicianProfile(
  payload: UpdateTechnicianProfilePayload,
) {
  const res = await apiClient<{ data: TechnicianProfile }>(
    "/technician/profile",
    {
      method: "PUT",
      body: payload,
    },
  );
  return res.data;
}

export async function getMyAvailability() {
  const res = await apiClient<{ data: AvailabilitySlot[] }>(
    "/technician/availability",
  );
  return res.data;
}

export async function setMyAvailability(slots: AvailabilitySlot[]) {
  const res = await apiClient<{ data: AvailabilitySlot[] }>(
    "/technician/availability",
    {
      method: "PUT",
      body: { slots },
    },
  );
  return res.data;
}
