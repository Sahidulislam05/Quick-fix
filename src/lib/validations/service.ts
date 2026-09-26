import { z } from "zod";

export const serviceSchema = z.object({
  categoryId: z.string().min(1, { error: "একটা ক্যাটাগরি বেছে নাও" }),
  title: z.string().min(3, { error: "কমপক্ষে ৩ অক্ষরের টাইটেল লেখো" }),
  description: z.string().min(10, { error: "কমপক্ষে ১০ অক্ষরের বর্ণনা লেখো" }),
  price: z
    .number({ error: "একটা মূল্য লিখো" })
    .positive({ error: "মূল্য ০-এর বেশি হতে হবে" }),
  location: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
