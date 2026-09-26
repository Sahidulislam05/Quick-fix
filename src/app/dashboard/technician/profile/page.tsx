import { AvailabilityScheduler } from "@/components/features/availability-scheduler";
import { TechnicianProfileForm } from "@/components/features/technician-profile-form";
import { PageHeader } from "@/components/shared/page-header";

export default function TechnicianProfilePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Profile & Availability"
        description="তোমার প্রোফাইল তথ্য ও সাপ্তাহিক শিডিউল আপডেট করো।"
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <TechnicianProfileForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Weekly availability</h2>
        <AvailabilityScheduler />
      </section>
    </div>
  );
}
