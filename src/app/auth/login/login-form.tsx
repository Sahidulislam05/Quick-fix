"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_HOME } from "@/constants/navigation";
import { useLogin } from "@/hooks/use-auth";
import { type LoginFormValues, loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    const user = await loginMutation.mutateAsync(values).catch(() => null);
    if (!user) return; // এরর টোস্ট useLogin-এর onError-এই দেখানো হয়ে গেছে

    toast.success(`স্বাগতম, ${user.name}!`);
    const redirectTo = searchParams.get("redirect");
    router.push(
      redirectTo?.startsWith("/dashboard") ? redirectTo : ROLE_HOME[user.role],
    );
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold">Log in</h1>
        <p className="text-sm text-muted-foreground">QuickFix-এ আবার স্বাগতম।</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          )}
          Log in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
