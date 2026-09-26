"use client";

import { AdminBookingsTable } from "@/components/features/admin-bookings-table";
import { AdminUsersTable } from "@/components/features/admin-users-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminBookings, useAdminUsers } from "@/hooks/use-admin";

const REVENUE_STATUSES = new Set(["PAID", "IN_PROGRESS", "COMPLETED"]);
const ACTIVE_STATUSES = new Set([
  "REQUESTED",
  "ACCEPTED",
  "PAID",
  "IN_PROGRESS",
]);

export default function AdminOverviewPage() {
  const usersQuery = useAdminUsers();
  const bookingsQuery = useAdminBookings();

  const users = usersQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];

  const activeBookings = bookings.filter((b) =>
    ACTIVE_STATUSES.has(b.status),
  ).length;
  const revenue = bookings
    .filter((b) => REVENUE_STATUSES.has(b.status))
    .reduce((sum, b) => sum + Number(b.service?.price ?? 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overview"
        description="প্ল্যাটফর্মের ইউজার ও বুকিং পরিচালনা করো।"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Active bookings" value={activeBookings} />
        <StatCard
          label="Revenue"
          value={`৳${revenue.toLocaleString("en-US")}`}
        />
      </div>
      <p className="-mt-6 text-xs text-muted-foreground">
        * Revenue হিসাব হয়েছে PAID/IN_PROGRESS/COMPLETED বুকিংয়ের যোগফল থেকে —
        admin-এর জন্য আলাদা কোনো payments-লিস্ট এন্ডপয়েন্ট নেই।
      </p>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <AdminUsersTable />
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <AdminBookingsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
