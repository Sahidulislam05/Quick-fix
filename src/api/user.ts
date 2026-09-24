import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

export async function getMe() {
  const res = await apiClient<{ data: { profile: User } }>("/users/me");
  return res.data.profile;
}

export type UpdateMyProfilePayload = {
  name?: string;
  phone?: string;
};

export async function updateMyProfile(payload: UpdateMyProfilePayload) {
  const res = await apiClient<{ data: { updatedProfile: User } }>(
    "/users/my-profile",
    {
      method: "PUT",
      body: payload,
    },
  );
  return res.data.updatedProfile;
}
