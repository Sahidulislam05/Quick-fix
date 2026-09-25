"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // "fail" | "cancel" | null — backend পাঠালে
  const bookingId = searchParams.get("bookingId") ?? searchParams.get("booking_id");

  const isFailure = status === "fail";
  const title = isFailure ? "Payment failed" : "Payment cancelled";
  const description = isFailure
    ? "পেমেন্টটা সম্পন্ন করা যায়নি। কার্ড বা ব্যালেন্স চেক করে আবার চেষ্টা করো।"
    : "তুমি পেমেন্টটা বাতিল করেছ। বুকিংটা এখনো ACCEPTED অবস্থায় আছে, চাইলে আবার পে করতে পারো।";

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
      <div className="flex justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="size-8" />
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {bookingId && (
          <Button
            size="lg"
            className="w-full"
            render={<Link href={`/dashboard/customer/bookings/${bookingId}/pay`} />}
          >
            Try again
          </Button>
        )}
        <Button size="lg" variant="outline" className="w-full" render={<Link href="/dashboard/customer" />}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}