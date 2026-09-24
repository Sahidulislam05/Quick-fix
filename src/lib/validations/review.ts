import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, { error: "একটা রেটিং বেছে নাও" }).max(5),
  comment: z.string().min(5, { error: "কমপক্ষে ৫ অক্ষরের একটা মন্তব্য লেখো" }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
