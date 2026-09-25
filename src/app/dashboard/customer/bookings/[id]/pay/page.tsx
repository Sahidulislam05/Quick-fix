"use client";

import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PriceTag } from "@/components/shared/price-tag";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/use-bookings";
import { useCreatePaymentSession } from "@/hooks/use-payments";

type PayPageProps = {
  params: Promise<{ id: string }>;
};

export default function PayBookingPage({ params }: PayPageProps) {
  const { id } = use(params);
  const bookingQuery = useBooking(id);
  const createPayment = useCreatePaymentSession();
  const [redirecting, setRedirecting] = useState(false);

  // ✅ ধাপ ২: ডাবল-ক্লিক প্রতিরোধ — মিউটেশন চলাকালীন আর redirect-এর অপেক্ষায়, দুই অবস্থাতেই বাটন disabled
  const isBusy = createPayment.isPending || redirecting;

  async function handlePay() {
    const session = await createPayment.mutateAsync(id).catch(() => null);
    if (!session) return; // এরর toast useCreatePaymentSession-এর onError-এই দেখানো হয়ে গেছে

    setRedirecting(true);
    // পুরো পেজ external SSLCommerz ডোমেইনে যাচ্ছে — router.push না, সরাসরি navigation
    window.location.href = session.gatewayPageURL;
  }

  if (bookingQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>;
  }

  if (bookingQuery.isError || !bookingQuery.data) {
    return <ErrorState onRetry={() => bookingQuery.refetch()} />;
  }

  const booking = bookingQuery.data;

  return (
    <div className="max-w-lg space-y-6">
      <Link
        href="/dashboard/customer"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <PageHeader
        title="Complete Payment"
        description="বুকিং কনফার্ম করতে পেমেন্ট সম্পন্ন করো।"
      />

      <div className="space-y-3 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium">{booking.service?.title ?? "Service"}</p>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(booking.scheduledDate), "d MMM yyyy, h:mm a")}
        </p>
        <p className="text-sm text-muted-foreground">{booking.address}</p>
        {booking.service?.price !== undefined && (
          <div className="pt-2">
            <PriceTag amount={booking.service.price} size="lg" />
          </div>
        )}
      </div>

      {/* ✅ ধাপ ১: শুধু ACCEPTED হলে Pay বাটন */}
      {booking.status === "ACCEPTED" && (
        <Button
          size="lg"
          className="w-full"
          disabled={isBusy}
          onClick={handlePay}
        >
          {isBusy && (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          )}
          Pay with SSLCommerz
        </Button>
      )}

      {booking.status === "PAID" && (
        <div className="rounded-lg border border-status-paid/30 bg-status-paid/10 p-4 text-sm text-status-paid">
          এই বুকিংটা ইতিমধ্যে পে করা হয়ে গেছে।
        </div>
      )}

      {booking.status !== "ACCEPTED" && booking.status !== "PAID" && (
        <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
          এই বুকিং এখনো পেমেন্টের জন্য প্রস্তুত না (স্ট্যাটাস: {booking.status}
          )। টেকনিশিয়ান accept করার পরই পে করা যাবে।
        </div>
      )}
    </div>
  );
}
