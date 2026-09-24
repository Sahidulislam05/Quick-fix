export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type ActiveStatus = "ACTIVE" | "BLOCKED";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  activeStatus: ActiveStatus;
  createdAt: string;
  updatedAt: string;
};
