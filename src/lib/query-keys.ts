export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
  },
  technicians: {
    list: (filters: Record<string, unknown>) =>
      ["technicians", "list", filters] as const,
    detail: (id: string) => ["technicians", id] as const,
    myAvailability: ["technicians", "me", "availability"] as const,
  },
  services: {
    list: (filters: Record<string, unknown>) =>
      ["services", "list", filters] as const,
    detail: (id: string) => ["services", id] as const,
    mine: ["services", "mine"] as const,
  },
  bookings: {
    mine: ["bookings", "mine"] as const, // কাস্টমারের লিস্ট
    technicianMine: ["bookings", "technician-mine"] as const,
    detail: (id: string) => ["bookings", id] as const,
    admin: ["bookings", "admin"] as const,
  },
  payments: {
    mine: ["payments", "mine"] as const,
    detail: (id: string) => ["payments", id] as const,
  },
  users: {
    me: ["users", "me"] as const,
    admin: (filters: Record<string, unknown>) =>
      ["users", "admin", filters] as const,
  },
};
