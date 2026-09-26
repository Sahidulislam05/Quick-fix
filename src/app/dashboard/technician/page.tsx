"use client";

import { format } from "date-fns";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PriceTag } from "@/components/shared/price-tag";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useTechnicianBookings } from "@/hooks/use-bookings";

const EARNING_STATUSES = new Set(["PAID", "IN_PROGRESS", "COMPLETED"]);

export default function TechnicianOverviewPage() {
  const bookingsQuery = useTechnicianBookings();
  const bookings = bookingsQuery.data ?? [];

  const pendingCount = bookings.filter((b) => b.status === "REQUESTED").length;
  const totalEarnings = bookings
    .filter((b) => EARNING_STATUSES.has(b.status))
    .reduce((sum, b) => sum + Number(b.service?.price ?? 0), 0);

  const upcoming = bookings
    .filter((b) => b.status === "ACCEPTED" || b.status === "PAID" || b.status === "IN_PROGRESS")
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader title="Technician Overview" description="আপকামিং জব, আয় ও পেন্ডিং রিকোয়েস্ট এক নজরে।" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming jobs" value={upcoming.length} />
        <StatCard label="Pending requests" value={pendingCount} />
        <StatCard label="Total earnings" value={`৳${totalEarnings.toLocaleString("en-US")}`} />
      </div>
      <p className="-mt-6 text-xs text-muted-foreground">
        * আয় হিসাব করা হয়েছে PAID/IN_PROGRESS/COMPLETED বুকিংয়ের যোগফল থেকে — কোনো আলাদা লেজার/ফাইন্যান্স
        এন্ডপয়েন্ট নেই।
      </p>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming jobs</h2>
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming jobs" description="নতুন বুকিং accept করলে এখানে দেখা যাবে।" />
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4"
              >
                <div>
                  <p className="font-medium">{booking.service?.title ?? "Service"}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.customer?.name ?? "Customer"} ·{" "}
                    {format(new Date(booking.scheduledDate), "d MMM yyyy, h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {booking.service?.price !== undefined && (
                    <PriceTag amount={booking.service.price} size="sm" />
                  )}
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}