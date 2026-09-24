"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type LoginPayload,
  loginUser,
  type RegisterPayload,
  registerUser,
} from "@/api/auth";
import { getMe } from "@/api/user";
import { ApiError } from "@/lib/api-error";
import { clearSession, setAccessToken, setStoredRole } from "@/lib/auth-token";
import { queryKeys } from "@/lib/query-keys";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Registration failed",
      );
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { accessToken } = await loginUser(payload);
      setAccessToken(accessToken);

      const user = await getMe();

      if (user.activeStatus === "BLOCKED") {
        clearSession();
        throw new ApiError(
          "তোমার অ্যাকাউন্টটি ব্লক করা হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করো।",
          403,
        );
      }

      setStoredRole(user.role);
      queryClient.setQueryData(queryKeys.users.me, user);
      return user;
    },
    onError: (error) => {
      clearSession();
      toast.error(error instanceof ApiError ? error.message : "Login failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearSession();
    queryClient.removeQueries({ queryKey: queryKeys.users.me });
    queryClient.clear();
  };
}
