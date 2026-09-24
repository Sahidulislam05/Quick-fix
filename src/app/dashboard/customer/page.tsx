"use client";

import { BookingList } from "@/components/features/booking-list";
import { PaymentList } from "@/components/features/payment-list";
import { ProfileForm } from "@/components/features/profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyBookings } from "@/hooks/use-bookings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMyPayments } from "@/hooks/use-payments";

export default function CustomerOverviewPage() {
  const { data: user } = useCurrentUser();
  const bookingsQuery = useMyBookings();
  const paymentsQuery = useMyPayments();

  const bookings = bookingsQuery.data ?? [];
  const activeBookings = bookings.filter(
    (b) =>
      b.status !== "COMPLETED" &&
      b.status !== "CANCELLED" &&
      b.status !== "DECLINED",
  );
  const totalSpent = (paymentsQuery.data ?? [])
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="তোমার বুকিং ও পেমেন্ট এক জায়গায়।"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total bookings" value={bookings.length} />
        <StatCard label="Active bookings" value={activeBookings.length} />
        <StatCard
          label="Total spent"
          value={`৳${totalSpent.toLocaleString("en-US")}`}
        />
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="mt-4">
          <BookingList />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <PaymentList />
        </TabsContent>
        <TabsContent value="profile" className="mt-4">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
