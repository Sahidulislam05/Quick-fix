"use client";

import { format } from "date-fns";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PriceTag } from "@/components/shared/price-tag";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyPayments } from "@/hooks/use-payments";

export function PaymentList() {
  const paymentsQuery = useMyPayments();

  if (paymentsQuery.isLoading) return <TableSkeleton rows={4} columns={4} />;
  if (paymentsQuery.isError)
    return <ErrorState onRetry={() => paymentsQuery.refetch()} />;

  const payments = paymentsQuery.data ?? [];
  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments yet"
        description="বুকিং পে করার পর এখানে দেখা যাবে।"
      />
    );
  }

  const sorted = [...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-mono text-xs">
                {payment.tranId}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(payment.createdAt), "d MMM yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={payment.status === "PAID" ? "default" : "secondary"}
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <PriceTag amount={payment.amount} size="sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
