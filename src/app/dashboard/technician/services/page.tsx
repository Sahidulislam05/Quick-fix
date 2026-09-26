import { MyServicesList } from "@/components/features/my-services-list";
import { PageHeader } from "@/components/shared/page-header";

export default function TechnicianServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Services"
        description="সার্ভিস তৈরি, এডিট বা ডিঅ্যাক্টিভেট করো।"
      />
      <MyServicesList />
    </div>
  );
}
