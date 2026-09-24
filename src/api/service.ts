import { apiClient } from "@/lib/api-client";
import type { PaginationMeta } from "@/types/api";
import type { Service } from "@/types/service";

export type ServiceFilters = {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  location?: string;
};

export async function getServices(filters: ServiceFilters = {}) {
  const res = await apiClient<{ data: Service[]; meta: PaginationMeta }>(
    "/services",
    {
      params: filters,
    },
  );
  return { data: res.data, meta: res.meta };
}

export async function getServiceById(id: string) {
  const res = await apiClient<{ data: Service }>(`/services/${id}`);
  return res.data;
}

export async function getMyServices() {
  const res = await apiClient<{ data: Service[] }>("/services/my-services");
  return res.data;
}

export type ServicePayload = {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  location: string;
};

export async function createService(payload: ServicePayload) {
  const res = await apiClient<{ data: { service: Service } }>("/services", {
    method: "POST",
    body: payload,
  });
  return res.data.service;
}

export async function updateService(
  id: string,
  payload: Partial<ServicePayload>,
) {
  const res = await apiClient<{ data: Service }>(`/services/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function deleteService(id: string) {
  await apiClient(`/services/${id}`, { method: "DELETE" });
}
