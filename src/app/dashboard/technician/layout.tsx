import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function TechnicianDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell role="TECHNICIAN">{children}</DashboardShell>;
}
