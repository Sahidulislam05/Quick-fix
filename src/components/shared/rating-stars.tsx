import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_SIZES = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

const POSITIONS = [0, 1, 2, 3, 4];

type RatingStarsProps = {
  rating: number; // 0–5, দশমিক হতে পারে (যেমন 4.3)
  reviewCount?: number;
  size?: keyof typeof STAR_SIZES;
  showValue?: boolean;
  className?: string;
};

export function RatingStars({
  rating,
  reviewCount,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const safeRating = Math.min(5, Math.max(0, rating));
  const hasReviews =
    reviewCount === undefined ? safeRating > 0 : reviewCount > 0;
  const starSize = STAR_SIZES[size];

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="sr-only">Rated {safeRating.toFixed(1)} out of 5</span>

      <span aria-hidden className="inline-flex">
        {POSITIONS.map((position) => {
          // এই তারাটা কত শতাংশ ভরা হবে (0–100)
          const fill = Math.min(1, Math.max(0, safeRating - position)) * 100;

          return (
            <span key={position} className="relative inline-block">
              {/* নিচে খালি তারা */}
              <Star className={cn(starSize, "text-muted-foreground/40")} />
              {/* উপরে রঙিন তারা, ভরা অংশ পর্যন্ত কেটে দেখানো */}
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill}%` }}
              >
                <Star className={cn(starSize, "fill-rating text-rating")} />
              </span>
            </span>
          );
        })}
      </span>

      {showValue &&
        (hasReviews ? (
          <span className="text-sm font-medium tabular-nums">
            {safeRating.toFixed(1)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">New</span>
        ))}

      {reviewCount !== undefined && hasReviews && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
