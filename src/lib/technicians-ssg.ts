import { serverFetch } from "@/lib/server-fetch";
import type { TechnicianProfile } from "@/types/technician";

type TechniciansQuery = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function buildQueryString(query: TechniciansQuery) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchTechniciansForSSG(query: TechniciansQuery = {}) {
  const result = await serverFetch<{ technicians: TechnicianProfile[] }>(
    `/technicians${buildQueryString(query)}`,
  );
  return { technicians: result.data.technicians, meta: result.meta };
}

export async function fetchTechnicianForSSG(id: string) {
  const result = await serverFetch<{ technician: TechnicianProfile }>(
    `/technicians/${id}`,
  );

  // এখনো ভুল হলে দ্রুত ধরতে
  if (!result.data?.technician?.name) {
    console.log(
      `fetchTechnicianForSSG(${id}) raw response:`,
      JSON.stringify(result),
    );
  }

  return result.data.technician;
}
