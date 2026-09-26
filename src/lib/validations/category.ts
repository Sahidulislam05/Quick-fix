import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, { error: "কমপক্ষে ২ অক্ষরের নাম লেখো" }),
  description: z.string().min(5, { error: "কমপক্ষে ৫ অক্ষরের বর্ণনা লেখো" }),
  icon: z.string().min(1, { error: "একটা ইমোজি/আইকন দাও" }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
