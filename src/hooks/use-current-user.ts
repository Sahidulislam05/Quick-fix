"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/user";
import { getAccessToken } from "@/lib/auth-token";
import { queryKeys } from "@/lib/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: getMe,
    enabled: !!getAccessToken(), // টোকেন না থাকলে রিকোয়েস্টই পাঠাবে না
    retry: false,
  });
}
