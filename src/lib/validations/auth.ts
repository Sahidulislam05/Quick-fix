import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "সঠিক ইমেইল লিখো" }),
  password: z.string().min(1, { error: "পাসওয়ার্ড দিতে হবে" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, { error: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
    email: z.email({ error: "সঠিক ইমেইল লিখো" }),
    phone: z.string().regex(/^01[3-9]\d{8}$/, {
      error: "সঠিক বাংলাদেশি নম্বর লিখো (01XXXXXXXXX)",
    }),
    password: z.string().min(6, { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "TECHNICIAN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটো মিলছে না",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
