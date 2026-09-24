"use client";

import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getServices } from "@/api/service";
import { ServiceCard } from "@/components/features/service-card";
import {
  ServiceFilterPanel,
  type ServiceFilterValues,
} from "@/components/features/service-filter-panel";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { STALE_TIME } from "@/constants/query";
import { queryKeys } from "@/lib/query-keys";
import type { PaginationMeta } from "@/types/api";
import type { Category } from "@/types/category";
import type { Service } from "@/types/service";

type ServicesPageClientProps = {
  initialCategories: Category[];
  initialServices: Service[];
  initialMeta: PaginationMeta;
};

export function ServicesPageClient({
  initialCategories,
  initialServices,
  initialMeta,
}: ServicesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  // ✅ URL-ই সত্যের একমাত্র উৎস — আলাদা কোনো filter state নেই
  const filters: ServiceFilterValues = {
    search: searchParams.get("search") ?? "",
    categoryId: searchParams.get("categoryId") ?? "",
    location: searchParams.get("location") ?? "",
    minRating: searchParams.get("minRating") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  };
  const page = Number(searchParams.get("page") ?? "1");

  function updateFilters(next: Partial<ServiceFilterValues>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...next };

    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // ফিল্টার বদলালে প্রথম পেজে ফিরে যাও

    router.replace(`/services?${params.toString()}`, { scroll: false });
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.replace(`/services?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // backend-সাপোর্টেড ফিল্টার (categoryId, location, search) + pagination — এগুলোই সার্ভারে যায়
  const apiFilters = {
    page,
    limit: 12,
    categoryId: filters.categoryId || undefined,
    location: filters.location || undefined,
    search: filters.search || undefined,
  };
  const isDefaultView =
    page === 1 && !filters.categoryId && !filters.location && !filters.search;

  const servicesQuery = useQuery({
    queryKey: queryKeys.services.list(apiFilters),
    queryFn: () => getServices(apiFilters),
    staleTime: STALE_TIME.PUBLIC_LISTS,
    initialData: isDefaultView
      ? { data: initialServices, meta: initialMeta }
      : undefined,
  });

  // ⚠️ backend price/rating দিয়ে ফিল্টার সাপোর্ট করে না, তাই এই দুটো ক্লায়েন্টে —
  // শুধু এই পেজে আসা রেজাল্টের উপর প্রয়োগ হয়, পুরো ডাটাসেটে না
  const visibleServices = useMemo(() => {
    const items = servicesQuery.data?.data ?? [];
    const minRating = filters.minRating ? Number(filters.minRating) : 0;
    const minPrice = filters.minPrice ? Number(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice
      ? Number(filters.maxPrice)
      : Number.POSITIVE_INFINITY;

    return items.filter((service) => {
      const rating = service.technician?.technicianProfile?.avgRating ?? 0;
      const price = Number(service.price);
      return rating >= minRating && price >= minPrice && price <= maxPrice;
    });
  }, [
    servicesQuery.data,
    filters.minRating,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const hasClientFilter = Boolean(
    filters.minRating || filters.minPrice || filters.maxPrice,
  );
  const meta = servicesQuery.data?.meta;

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        eyebrow="Services"
        title="Browse services"
        description="ক্যাটাগরি, লোকেশন বা নাম দিয়ে খুঁজে দেখো।"
        align="left"
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <ServiceFilterPanel
            categories={initialCategories}
            values={filters}
            onChange={updateFilters}
          />
        </aside>

        <div className="space-y-6">
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-sm text-muted-foreground">
              {meta ? `${meta.total} services found` : "Loading..."}
            </p>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                <SlidersHorizontal data-icon="inline-start" />
                Filters
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-4">
                <SheetHeader className="px-0">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <ServiceFilterPanel
                  categories={initialCategories}
                  values={filters}
                  onChange={(next) => {
                    updateFilters(next);
                    setSheetOpen(false);
                  }}
                  className="mt-4"
                />
              </SheetContent>
            </Sheet>
          </div>

          {hasClientFilter && (
            <p className="text-xs text-muted-foreground">
              এই পেজের {servicesQuery.data?.data.length ?? 0}টার মধ্যে{" "}
              {visibleServices.length}টা তোমার রেটিং/দামের ফিল্টারে মিলেছে।
            </p>
          )}

          {servicesQuery.isLoading && <CardGridSkeleton count={6} />}

          {servicesQuery.isError && (
            <ErrorState onRetry={() => servicesQuery.refetch()} />
          )}

          {servicesQuery.isSuccess && visibleServices.length === 0 && (
            <EmptyState
              title="No services found"
              description="ফিল্টার বদলে আবার চেষ্টা করো।"
            />
          )}

          {servicesQuery.isSuccess && visibleServices.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
