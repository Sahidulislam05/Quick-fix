import { apiClient } from "@/lib/api-client";
import type { CreatePaymentSessionResponse, Payment } from "@/types/payment";

export async function createPaymentSession(bookingId: string) {
  const res = await apiClient<{ data: CreatePaymentSessionResponse }>(
    "/payments/create",
    { method: "POST", body: { bookingId } },
  );
  return res.data;
}

export async function getMyPayments() {
  const res = await apiClient<{ data: Payment[] }>("/payments");
  return res.data;
}

export async function getPaymentById(id: string) {
  const res = await apiClient<{ data: Payment }>(`/payments/${id}`);
  return res.data;
}