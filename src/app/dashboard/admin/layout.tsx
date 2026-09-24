// src/app/dashboard/admin/layout.tsx
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}
