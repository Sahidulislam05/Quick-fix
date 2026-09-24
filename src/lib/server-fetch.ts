import type { PaginationMeta } from "@/types/api";
import { ApiError } from "./api-error";
import { env } from "./env";

type ServerFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type ServerFetchResult<T> = {
  data: T;
  meta?: PaginationMeta;
};

export async function serverFetch<T>(
  path: string,
  { revalidate = 300, tags }: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  const res = await fetch(`${env.apiUrl}/api${path}`, {
    next: { revalidate, tags },
  });

  const body = await res.json();

  if (!res.ok || body.success === false) {
    throw new ApiError(
      body?.message ?? "Failed to load data",
      res.status,
      body?.errorDetails?.issues,
    );
  }

  return { data: body.data as T, meta: body.meta };
}
