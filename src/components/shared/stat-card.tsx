import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 sm:p-6">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="font-heading text-2xl font-bold">{value}</p>
    </div>
  );
}
