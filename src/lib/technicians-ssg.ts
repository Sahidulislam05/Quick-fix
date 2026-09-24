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

// ⚠️ /technicians লিস্ট নেস্টেড (data.technicians) ধরে নিচ্ছি — যাচাই হয়নি।
export async function fetchTechniciansForSSG(query: TechniciansQuery = {}) {
  const result = await serverFetch<{ technicians: TechnicianProfile[] }>(
    `/technicians${buildQueryString(query)}`,
  );
  return { technicians: result.data.technicians, meta: result.meta };

  // ফ্ল্যাট শেপ বের হলে (data সরাসরি array), উপরের দুই লাইন এভাবে বদলাও:
  // const result = await serverFetch<TechnicianProfile[]>(`/technicians${buildQueryString(query)}`);
  // return { technicians: result.data, meta: result.meta };
}

// ⚠️ একক GET-ও নেস্টেড ধরে নিচ্ছি (তালিকার প্যাটার্নের সাথে মিলিয়ে) — যাচাই হয়নি।
export async function fetchTechnicianForSSG(id: string) {
  const result = await serverFetch<{ technician: TechnicianProfile }>(
    `/technicians/${id}`,
  );
  return result.data.technician;

  // ফ্ল্যাট হলে:
  // const result = await serverFetch<TechnicianProfile>(`/technicians/${id}`);
  // return result.data;
}
