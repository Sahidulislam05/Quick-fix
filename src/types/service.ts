import type { Category } from "./category";
import type { TechnicianProfile } from "./technician";

export type Service = {
  id: string;
  categoryId: string;
  category?: Category;
  technicianId: string;
  technician?: TechnicianProfile;
  title: string;
  description: string;
  price: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
