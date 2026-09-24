"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getTechnicianById,
  getTechnicians,
  type TechnicianFilters,
} from "@/api/technician";
import { STALE_TIME } from "@/constants/query";
import { queryKeys } from "@/lib/query-keys";

export function useTechnicians(filters: TechnicianFilters = {}) {
  return useQuery({
    queryKey: queryKeys.technicians.list(filters),
    queryFn: () => getTechnicians(filters),
    staleTime: STALE_TIME.PUBLIC_LISTS,
  });
}

export function useTechnician(id: string) {
  return useQuery({
    queryKey: queryKeys.technicians.detail(id),
    queryFn: () => getTechnicianById(id),
    staleTime: STALE_TIME.PUBLIC_LISTS,
    enabled: !!id,
  });
}
