"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getServiceById,
  getServices,
  type ServiceFilters,
} from "@/api/service";
import { STALE_TIME } from "@/constants/query";
import { queryKeys } from "@/lib/query-keys";

export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => getServices(filters),
    staleTime: STALE_TIME.PUBLIC_LISTS,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => getServiceById(id),
    staleTime: STALE_TIME.PUBLIC_LISTS,
    enabled: !!id,
  });
}
