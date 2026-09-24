import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
} as const;

type PriceTagProps = {
  amount: number | string;
  prefix?: string;
  suffix?: string;
  size?: keyof typeof SIZES;
  className?: string;
};

export function PriceTag({
  amount,
  prefix,
  suffix,
  size = "md",
  className,
}: PriceTagProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      {prefix && (
        <span className="text-xs text-muted-foreground">{prefix}</span>
      )}
      <span
        className={cn(
          "font-heading font-bold tabular-nums text-foreground",
          SIZES[size],
        )}
      >
        {formatPrice(amount)}
      </span>
      {suffix && (
        <span className="text-xs text-muted-foreground">{suffix}</span>
      )}
    </span>
  );
}
