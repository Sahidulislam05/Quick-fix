import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell role="CUSTOMER">{children}</DashboardShell>;
}
