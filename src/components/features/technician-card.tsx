import Link from "next/link";
import { RatingStars } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TechnicianProfile } from "@/types/technician";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TechnicianCard({
  technician,
}: {
  technician: TechnicianProfile;
}) {
  const profile = technician.technicianProfile;

  return (
    <Link
      href={`/technicians/${technician.id}`}
      className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
    >
      <Avatar className="size-16">
        <AvatarFallback className="text-lg">
          {initials(technician.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold group-hover:text-primary">
          {technician.name}
        </h3>
        {profile?.skills && profile.skills.length > 0 && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {profile.skills.join(", ")}
          </p>
        )}
      </div>
      <RatingStars
        rating={profile?.avgRating ?? 0}
        reviewCount={profile?.totalReviews ?? 0}
        size="sm"
      />
    </Link>
  );
}
