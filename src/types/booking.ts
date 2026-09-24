import type { BookingStatus } from "@/constants/booking";

export type Booking = {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledDate: string; // ISO string
  address: string;
  cancelReason?: string | null;
  createdAt: string;
  service?: { id: string; title: string; price: number | string };
  technician?: { id: string; name: string };
};
