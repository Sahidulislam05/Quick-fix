"use client";

import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";

export function ApiTestClient() {
  const categoriesQuery = useCategories();
  const servicesQuery = useServices({ page: 1, limit: 10 });

  return (
    <section className="space-y-6">
      <h1 className="text-xl font-bold">৩) ক্লায়েন্ট-সাইড (TanStack Query)</h1>

      <div className="space-y-1">
        <h2 className="text-sm font-semibold">useCategories()</h2>
        {categoriesQuery.isLoading && <p className="text-sm">লোড হচ্ছে...</p>}
        {categoriesQuery.isError && (
          <p className="text-sm text-destructive">
            এরর: {(categoriesQuery.error as Error).message}
          </p>
        )}
        {categoriesQuery.data && (
          <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">
            {JSON.stringify(categoriesQuery.data, null, 2)}
          </pre>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-semibold">
          useServices({"{ page: 1, limit: 10 }"})
        </h2>
        {servicesQuery.isLoading && <p className="text-sm">লোড হচ্ছে...</p>}
        {servicesQuery.isError && (
          <p className="text-sm text-destructive">
            এরর: {(servicesQuery.error as Error).message}
          </p>
        )}
        {servicesQuery.data && (
          <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">
            {JSON.stringify(servicesQuery.data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
