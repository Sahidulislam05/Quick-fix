import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { fetchTechniciansForSSG } from "@/lib/technicians-ssg";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: env.siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${env.siteUrl}/services`, changeFrequency: "daily", priority: 0.9 },
    { url: `${env.siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${env.siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const technicianRoutes: MetadataRoute.Sitemap = await fetchTechniciansForSSG({
    limit: 100,
  })
    .then(({ technicians }) =>
      technicians.map((technician) => ({
        url: `${env.siteUrl}/technicians/${technician.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    )
    .catch(() => []);

  return [...staticRoutes, ...technicianRoutes];
}
