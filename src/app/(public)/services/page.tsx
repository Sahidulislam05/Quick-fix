import type { Metadata } from "next";
import { Suspense } from "react";
import { serverFetch } from "@/lib/server-fetch";
import type { Category } from "@/types/category";
import type { Service } from "@/types/service";
import { ServicesPageClient } from "./services-client";

export const metadata: Metadata = {
  title: "Browse Services",
  description: "প্লাম্বিং, ইলেকট্রিক্যাল, ক্লিনিং সহ বিভিন্ন হোম সার্ভিস ব্রাউজ করো।",
};

export default async function ServicesPage() {
  const [categoriesResult, servicesResult] = await Promise.all([
    serverFetch<{ categories: Category[] }>("/categories").catch(() => null),
    serverFetch<Service[]>("/services?page=1&limit=12").catch(() => null),
  ]);

  return (
    <Suspense>
      <ServicesPageClient
        initialCategories={categoriesResult?.data.categories ?? []}
        initialServices={servicesResult?.data ?? []}
        initialMeta={
          servicesResult?.meta ?? {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 1,
          }
        }
      />
    </Suspense>
  );
}
