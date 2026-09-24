import { Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingTrigger } from "@/components/features/booking-trigger";
import { Container } from "@/components/shared/container";
import { PriceTag } from "@/components/shared/price-tag";
import { RatingStars } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { serverFetch } from "@/lib/server-fetch";
import {
  fetchTechnicianForSSG,
  fetchTechniciansForSSG,
} from "@/lib/technicians-ssg";
import type { Service } from "@/types/service";

type TechnicianPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  try {
    const { technicians } = await fetchTechniciansForSSG({ limit: 100 });
    return technicians.map((technician) => ({ id: technician.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: TechnicianPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const technician = await fetchTechnicianForSSG(id);
    return {
      title: technician.name,
      description:
        technician.technicianProfile?.bio ??
        `${technician.name}-এর প্রোফাইল দেখো QuickFix-এ।`,
    };
  } catch {
    return { title: "Technician" };
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function TechnicianDetailPage({
  params,
}: TechnicianPageProps) {
  const { id } = await params;

  const technician = await fetchTechnicianForSSG(id).catch(() => null);
  if (!technician) notFound();

  const servicesResult = await serverFetch<Service[]>(
    "/services?limit=100",
  ).catch(() => null);
  const services = (servicesResult?.data ?? []).filter(
    (service) => service.technicianId === id,
  );

  const profile = technician.technicianProfile;
  const availability = profile?.availability ?? [];

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-20">
              <AvatarFallback className="text-2xl">
                {initials(technician.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold">{technician.name}</h1>
              <RatingStars
                rating={profile?.avgRating ?? 0}
                reviewCount={profile?.totalReviews ?? 0}
              />
              {profile?.experienceYears !== undefined &&
                profile.experienceYears > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {profile.experienceYears} years of experience
                  </p>
                )}
            </div>
          </div>

          {profile?.bio && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
          )}

          {profile?.skills && profile.skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Services</h2>
            {services.length > 0 ? (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-medium">{service.title}</p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      <PriceTag amount={service.price} size="sm" />
                    </div>
                    <BookingTrigger
                      technicianName={technician.name}
                      services={services}
                      availability={availability}
                      preselectedServiceId={service.id}
                      label="Book"
                      className="shrink-0"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                এই টেকনিশিয়ান এখনো কোনো সার্ভিস যোগ করেননি।
              </p>
            )}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <Star className="size-4 fill-rating text-rating" />
            <span className="text-sm font-medium">
              {profile?.avgRating?.toFixed(1) ?? "New"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({profile?.totalReviews ?? 0} reviews)
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            একটা সার্ভিস বেছে সময়মতো বুক করো।
          </p>
          <BookingTrigger
            technicianName={technician.name}
            services={services}
            availability={availability}
            className="w-full"
          />
        </aside>
      </div>
    </Container>
  );
}
