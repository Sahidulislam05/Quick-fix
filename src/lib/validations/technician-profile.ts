import { z } from "zod";

export const technicianProfileSchema = z.object({
  bio: z
    .string()
    .max(500, { error: "বায়ো ৫০০ অক্ষরের বেশি হতে পারবে না" })
    .optional(),
  experienceYears: z
    .number({ error: "একটা সংখ্যা লিখো" })
    .min(0, { error: "০ বা তার বেশি হতে হবে" })
    .max(60, { error: "৬০-এর বেশি সম্ভব না" }),
  skills: z
    .array(z.string().min(1))
    .min(1, { error: "কমপক্ষে একটা স্কিল যোগ করো" }),
});

export type TechnicianProfileFormValues = z.infer<
  typeof technicianProfileSchema
>;
