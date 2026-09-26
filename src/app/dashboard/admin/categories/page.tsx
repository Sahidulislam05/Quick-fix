import { AdminCategoriesList } from "@/components/features/admin-categories-list";
import { PageHeader } from "@/components/shared/page-header";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="ক্যাটাগরি তৈরি বা এডিট করো — পরিবর্তন সাথে সাথে পাবলিক পেজেও দেখা যাবে।"
      />
      <AdminCategoriesList />
    </div>
  );
}
