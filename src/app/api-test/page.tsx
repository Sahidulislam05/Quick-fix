import { serverFetch } from "@/lib/server-fetch";
import { fetchTechniciansForSSG } from "@/lib/technicians-ssg";
import type { Category } from "@/types/category";
import { ApiTestClient } from "./api-test-client";

export default async function ApiTestPage() {
  let categories: Category[] = [];
  let categoryError: string | null = null;
  try {
    const result = await serverFetch<{ categories: Category[] }>("/categories");
    categories = result.data.categories;
  } catch (error) {
    categoryError = error instanceof Error ? error.message : "Unknown error";
  }

  let techniciansRaw: unknown = null;
  let technicianError: string | null = null;
  try {
    techniciansRaw = await fetchTechniciansForSSG({ limit: 3 });
  } catch (error) {
    technicianError = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <section className="space-y-2">
        <h1 className="text-xl font-bold">১) ক্যাটাগরি (serverFetch)</h1>
        {categoryError ? (
          <p className="text-destructive">এরর: {categoryError}</p>
        ) : (
          <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">
            {JSON.stringify(categories, null, 2)}
          </pre>
        )}
      </section>

      <section className="space-y-2">
        <h1 className="text-xl font-bold">
          ২) টেকনিশিয়ান (fetchTechniciansForSSG)
        </h1>
        {technicianError ? (
          <p className="text-destructive">এরর: {technicianError}</p>
        ) : (
          <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">
            {JSON.stringify(techniciansRaw, null, 2)}
          </pre>
        )}
      </section>

      <ApiTestClient />
    </div>
  );
}
