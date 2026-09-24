import { MapPin } from "lucide-react";
import Link from "next/link";
import { PriceTag } from "@/components/shared/price-tag";
import { RatingStars } from "@/components/shared/rating-stars";
import type { Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
  const technicianName = service.technician?.name ?? "QuickFix Technician";
  const rating = service.technician?.technicianProfile?.avgRating ?? 0;
  const reviewCount = service.technician?.technicianProfile?.totalReviews ?? 0;

  return (
    <Link
      href={`/technicians/${service.technicianId}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2">
        <span className="text-lg">{service.category?.icon ?? "🔧"}</span>
        <span className="text-xs font-medium text-muted-foreground">
          {service.category?.name ?? "Service"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
          {service.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{technicianName}</p>
            <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
          </div>
          <PriceTag amount={service.price} size="sm" />
        </div>

        {service.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {service.location}
          </p>
        )}
      </div>
    </Link>
  );
}
