import { TechnicianBookingsTable } from "@/components/features/technician-bookings-table";
import { PageHeader } from "@/components/shared/page-header";

export default function TechnicianBookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description="ইনকামিং বুকিং রিকোয়েস্ট পরিচালনা করো।" />
      <TechnicianBookingsTable />
    </div>
  );
}