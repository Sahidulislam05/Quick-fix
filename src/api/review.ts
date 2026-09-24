import { apiClient } from "@/lib/api-client";
import type { Review } from "@/types/review";

export type CreateReviewPayload = {
  bookingId: string;
  rating: number;
  comment: string;
};

export async function createReview(payload: CreateReviewPayload) {
  const res = await apiClient<{ data: Review }>("/reviews", {
    method: "POST",
    body: payload,
  });
  return res.data;
}
