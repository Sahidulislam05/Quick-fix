import { apiClient } from "@/lib/api-client";
import type { Role } from "@/types/user";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Extract<Role, "CUSTOMER" | "TECHNICIAN">; // অ্যাডমিন সেলফ-রেজিস্টার করে না
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const res = await apiClient<{ data: { user: { id: string } } }>(
    "/users/register",
    {
      method: "POST",
      body: payload,
    },
  );
  return res.data.user;
}

export async function loginUser(payload: LoginPayload) {
  const res = await apiClient<{ data: { accessToken: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: payload,
    },
  );
  return res.data;
}

export async function refreshAccessToken() {
  const res = await apiClient<{ data: { accessToken: string } }>(
    "/auth/refresh-token",
    {
      method: "POST",
    },
  );
  return res.data.accessToken;
}
