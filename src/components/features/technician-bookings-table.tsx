"use client";

import { format } from "date-fns";
import { TechnicianBookingActions } from "@/components/features/technician-booking-actions";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PriceTag } from "@/components/shared/price-tag";
import { TableSkeleton } from "@/components/shared/skeletons";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTechnicianBookings } from "@/hooks/use-bookings";

export function TechnicianBookingsTable() {
  const bookingsQuery = useTechnicianBookings();

  if (bookingsQuery.isLoading) return <TableSkeleton rows={5} columns={5} />;
  if (bookingsQuery.isError)
    return <ErrorState onRetry={() => bookingsQuery.refetch()} />;

  const bookings = bookingsQuery.data ?? [];
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="কাস্টমার বুকিং দিলে এখানে দেখা যাবে।"
      />
    );
  }

  const sorted = [...bookings].sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  );

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.service?.title ?? "Service"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {booking.customer?.name ?? "Customer"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(
                    new Date(booking.scheduledDate),
                    "d MMM yyyy, h:mm a",
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  {booking.service?.price !== undefined && (
                    <PriceTag amount={booking.service.price} size="sm" />
                  )}
                </TableCell>
                <TableCell>
                  <TechnicianBookingActions booking={booking} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {sorted.map((booking) => (
          <div
            key={booking.id}
            className="space-y-3 rounded-xl border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">
                  {booking.service?.title ?? "Service"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.customer?.name ?? "Customer"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(
                    new Date(booking.scheduledDate),
                    "d MMM yyyy, h:mm a",
                  )}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            {booking.service?.price !== undefined && (
              <PriceTag amount={booking.service.price} size="sm" />
            )}
            <TechnicianBookingActions booking={booking} />
          </div>
        ))}
      </div>
    </>
  );
}
