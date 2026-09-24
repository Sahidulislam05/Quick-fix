"use client";

import { format } from "date-fns";
import { useState } from "react";
import { BookingActions } from "@/components/features/booking-actions";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
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
import { useMyBookings } from "@/hooks/use-bookings";

const PAGE_SIZE = 6;

export function BookingList() {
  const bookingsQuery = useMyBookings();
  const [page, setPage] = useState(1);

  if (bookingsQuery.isLoading) return <TableSkeleton rows={4} columns={4} />;
  if (bookingsQuery.isError)
    return <ErrorState onRetry={() => bookingsQuery.refetch()} />;

  const bookings = bookingsQuery.data ?? [];
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="একটা টেকনিশিয়ান বেছে প্রথম বুকিং দাও।"
      />
    );
  }

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* ডেস্কটপ: টেবিল */}
      <div className="hidden overflow-hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.service?.title ?? "Service"}
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
                  <BookingActions booking={booking} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* মোবাইল: কার্ড */}
      <div className="space-y-3 md:hidden">
        {pageItems.map((booking) => (
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
            <BookingActions booking={booking} />
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
