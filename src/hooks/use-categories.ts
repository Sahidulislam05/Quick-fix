"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/category";
import { STALE_TIME } from "@/constants/query";
import { queryKeys } from "@/lib/query-keys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: STALE_TIME.CATEGORIES,
  });
}
