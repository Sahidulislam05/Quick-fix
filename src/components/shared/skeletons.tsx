import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// [0, 1, 2, ...] বানায়। মানটাই key হিসেবে ব্যবহার করছি,
// কারণ map-এর index-কে সরাসরি key বানালে Biome অভিযোগ করে
const range = (count: number) => Array.from({ length: count }, (_, i) => i);

/** সার্ভিস/টেকনিশিয়ান কার্ডের ঢাঁচা */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}

/** কার্ডের গ্রিড (একসাথে অনেকগুলো) */
export function CardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {range(count).map((id) => (
        <CardSkeleton key={id} />
      ))}
    </div>
  );
}

/** ড্যাশবোর্ডের ওভারভিউ কার্ড */
export function StatCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 sm:p-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/** টেবিলের ঢাঁচা */
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex gap-4 border-b bg-muted/50 px-4 py-3">
        {range(columns).map((id) => (
          <Skeleton key={id} className="h-3 flex-1" />
        ))}
      </div>
      {range(rows).map((row) => (
        <div
          key={row}
          className="flex gap-4 border-b px-4 py-4 last:border-b-0"
        >
          {range(columns).map((col) => (
            <Skeleton key={col} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
