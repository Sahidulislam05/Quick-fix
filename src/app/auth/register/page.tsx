"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_HOME } from "@/constants/navigation";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/lib/validations/auth";

const ROLE_OPTIONS = [
  {
    value: "CUSTOMER",
    label: "Customer",
    description: "আমি সার্ভিস বুক করতে চাই",
  },
  {
    value: "TECHNICIAN",
    label: "Technician",
    description: "আমি সার্ভিস দিতে চাই",
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const loginMutation = useLogin();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });

  const selectedRole = form.watch("role");
  const isSubmitting = registerMutation.isPending || loginMutation.isPending;

  async function onSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...payload } = values;
    const created = await registerMutation
      .mutateAsync(payload)
      .catch(() => null);
    if (!created) return; // এরর টোস্ট useRegister-এর onError-এই দেখানো হয়ে গেছে

    // রেজিস্টার টোকেন দেয় না (Part 3-এ যাচাই করা), তাই সাথে সাথে লগইন করাচ্ছি
    const user = await loginMutation
      .mutateAsync({ email: values.email, password: values.password })
      .catch(() => null);

    if (!user) {
      toast.info("অ্যাকাউন্ট তৈরি হয়েছে, এবার লগইন করো।");
      router.push("/auth/login");
      return;
    }

    toast.success(`স্বাগতম, ${user.name}!`);
    router.push(ROLE_HOME[user.role]);
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          QuickFix-এ নতুন? নিচের ফর্মটা পূরণ করো।
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                form.setValue("role", option.value, { shouldValidate: true })
              }
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                selectedRole === option.value
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-muted",
              )}
            >
              <span className="block text-sm font-semibold">
                {option.label}
              </span>
              <span className="block text-xs text-muted-foreground">
                {option.description}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" className="h-10" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="h-10"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            className="h-10"
            {...form.register("phone")}
          />
          {form.formState.errors.phone && (
            <p className="text-xs text-destructive">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="h-10"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            className="h-10"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          )}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
