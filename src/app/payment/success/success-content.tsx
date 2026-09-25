"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getMyPayments } from "@/api/payment";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/use-bookings";
import { queryKeys } from "@/lib/query-keys";

// SSLCommerz/backend ঠিক কোন query param পাঠায় নিশ্চিত না — কয়েকটা সম্ভাব্য নাম চেষ্টা করছি
function readBookingId(searchParams: URLSearchParams) {
  return (
    searchParams.get("bookingId") ??
    searchParams.get("booking_id") ??
    searchParams.get("id")
  );
}

function readTranId(searchParams: URLSearchParams) {
  return searchParams.get("tranId") ?? searchParams.get("tran_id");
}

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const directBookingId = readBookingId(searchParams);
  const tranId = readTranId(searchParams);

  // bookingId সরাসরি URL-এ না পেলে, tranId দিয়ে নিজের payments লিস্ট থেকে খুঁজে বের করার চেষ্টা
  const fallbackQuery = useQuery({
    queryKey: ["payment-success-fallback", tranId],
    queryFn: async () => {
      const payments = await getMyPayments();
      return payments.find((payment) => payment.tranId === tranId) ?? null;
    },
    enabled: !directBookingId && !!tranId,
  });

  const resolvedBookingId =
    directBookingId ?? fallbackQuery.data?.bookingId ?? null;
  const bookingQuery = useBooking(resolvedBookingId ?? "");

  // ✅ ধাপ ৫: cache invalidate — dashboard-এ ফিরলে যেন সবসময় ফ্রেশ ডাটা দেখে
  useEffect(() => {
    if (bookingQuery.data?.status === "PAID") {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.mine });
    }
  }, [bookingQuery.data?.status, queryClient]);

  const isLookingUp =
    (!!tranId && !directBookingId && fallbackQuery.isLoading) ||
    (!!resolvedBookingId && bookingQuery.isLoading);

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
      <div className="flex justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-status-completed/15 text-status-completed">
          <CheckCircle2 className="size-8" />
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold">Payment successful</h1>
        <p className="text-sm text-muted-foreground">
          তোমার পেমেন্ট সম্পন্ন হয়েছে, ধন্যবাদ!
        </p>
      </div>

      {isLookingUp && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          বুকিং কনফার্ম করা হচ্ছে...
        </p>
      )}

      {bookingQuery.data && (
        <div className="space-y-2 rounded-lg border bg-muted/50 p-4 text-left text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {bookingQuery.data.service?.title ?? "Booking"}
            </span>
            <StatusBadge status={bookingQuery.data.status} />
          </div>
          {bookingQuery.data.service?.price !== undefined && (
            <PriceTag amount={bookingQuery.data.service.price} size="sm" />
          )}
          {bookingQuery.data.status !== "PAID" && (
            <p className="text-xs text-muted-foreground">
              স্ট্যাটাস আপডেট হতে কিছুক্ষণ সময় লাগতে পারে — ড্যাশবোর্ডে গিয়ে
              একটু পর আবার দেখো।
            </p>
          )}
        </div>
      )}

      {!resolvedBookingId && !isLookingUp && (
        <p className="text-xs text-muted-foreground">
          বুকিংয়ের বিস্তারিত এই পেজে দেখানো যায়নি, কিন্তু পেমেন্ট সম্পন্ন
          হয়েছে। ড্যাশবোর্ডে গিয়ে স্ট্যাটাস চেক করো।
        </p>
      )}

      <Button
        size="lg"
        className="w-full"
        render={<Link href="/dashboard/customer" />}
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
