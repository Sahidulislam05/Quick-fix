import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  LayoutDashboard,
  Tags,
  UserCog,
  Wrench,
} from "lucide-react";
import type { Role } from "@/types/user";

export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
] as const;

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
  ],
  TECHNICIAN: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    {
      label: "Bookings",
      href: "/dashboard/technician/bookings",
      icon: ClipboardList,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/services",
      icon: Wrench,
    },
    {
      label: "Profile & Availability",
      href: "/dashboard/technician/profile",
      icon: UserCog,
    },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Categories", href: "/dashboard/admin/categories", icon: Tags },
  ],
};

export const DASHBOARD_ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Customer",
  TECHNICIAN: "Technician",
  ADMIN: "Admin",
};

export const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
};
