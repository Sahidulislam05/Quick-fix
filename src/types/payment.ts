export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type Payment = {
  id: string;
  bookingId: string;
  tranId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
};

export type CreatePaymentSessionResponse = {
  tranId: string;
  gatewayPageURL: string;
};
