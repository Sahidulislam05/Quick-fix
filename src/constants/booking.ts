export const BOOKING_STATUSES = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

type StatusMeta = {
  label: string;
  badge: string;
  dot: string;
};

export const BOOKING_STATUS_META: Record<BookingStatus, StatusMeta> = {
  REQUESTED: {
    label: "Requested",
    badge:
      "bg-status-requested/15 text-status-requested border-status-requested/30",
    dot: "bg-status-requested",
  },
  ACCEPTED: {
    label: "Accepted",
    badge:
      "bg-status-accepted/15 text-status-accepted border-status-accepted/30",
    dot: "bg-status-accepted",
  },
  DECLINED: {
    label: "Declined",
    badge:
      "bg-status-declined/15 text-status-declined border-status-declined/30",
    dot: "bg-status-declined",
  },
  PAID: {
    label: "Paid",
    badge: "bg-status-paid/15 text-status-paid border-status-paid/30",
    dot: "bg-status-paid",
  },
  IN_PROGRESS: {
    label: "In progress",
    badge:
      "bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30",
    dot: "bg-status-in-progress",
  },
  COMPLETED: {
    label: "Completed",
    badge:
      "bg-status-completed/15 text-status-completed border-status-completed/30",
    dot: "bg-status-completed",
  },
  CANCELLED: {
    label: "Cancelled",
    badge:
      "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
    dot: "bg-status-cancelled",
  },
};

export type BookingActorRole = "CUSTOMER" | "TECHNICIAN";

export type BookingAction =
  | "ACCEPT"
  | "DECLINE"
  | "PAY"
  | "START"
  | "COMPLETE"
  | "CANCEL"
  | "REVIEW";

export const BOOKING_ACTIONS_BY_STATUS: Record<
  BookingStatus,
  Partial<Record<BookingActorRole, { action: BookingAction; label: string }[]>>
> = {
  REQUESTED: {
    TECHNICIAN: [
      { action: "ACCEPT", label: "Accept" },
      { action: "DECLINE", label: "Decline" },
    ],
    CUSTOMER: [{ action: "CANCEL", label: "Cancel" }],
  },
  ACCEPTED: {
    CUSTOMER: [
      { action: "PAY", label: "Pay Now" },
      { action: "CANCEL", label: "Cancel" },
    ],
  },
  DECLINED: {},
  PAID: {
    TECHNICIAN: [{ action: "START", label: "Start Job" }],
    CUSTOMER: [{ action: "CANCEL", label: "Cancel" }],
  },
  IN_PROGRESS: {
    TECHNICIAN: [{ action: "COMPLETE", label: "Complete Job" }],
  },
  COMPLETED: {
    CUSTOMER: [{ action: "REVIEW", label: "Leave Review" }],
  },
  CANCELLED: {},
};
