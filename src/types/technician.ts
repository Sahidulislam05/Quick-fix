import type { User } from "./user";

export type DayOfWeek =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export type AvailabilitySlot = {
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
};

export type TechnicianProfileData = {
  id: string;
  userId: string;
  bio: string | null;
  experienceYears: number;
  skills: string[];
  avgRating: number;
  totalReviews: number;
  availability?: AvailabilitySlot[];
  createdAt: string;
  updatedAt: string;
};

export type TechnicianProfile = User & {
  technicianProfile: TechnicianProfileData | null;
};
