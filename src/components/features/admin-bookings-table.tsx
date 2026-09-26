"use client";

import { useState } from "react";
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
import { useAdminBookings } from "@/hooks/use-admin";

const PAGE_SIZE = 8;

export function AdminBookingsTable() {
  const bookingsQuery = useAdminBookings();
  const [page, setPage] = useState(1);

  if (bookingsQuery.isLoading) return <TableSkeleton rows={5} columns={5} />;
  if (bookingsQuery.isError)
    return <ErrorState onRetry={() => bookingsQuery.refetch()} />;

  const bookings = bookingsQuery.data ?? [];
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="প্ল্যাটফর্মে এখনো কোনো বুকিং হয়নি।"
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
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.service?.title ?? "Service"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {booking.customer?.name ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {booking.technician?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-right">
                  {booking.service?.price !== undefined && (
                    <PriceTag amount={booking.service.price} size="sm" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
