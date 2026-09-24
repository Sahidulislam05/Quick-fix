"use client";

import { type ComponentProps, type MouseEvent, useRef } from "react";
import { cn } from "@/lib/utils";

export default function SpotlightCard({
  children,
  className,
  onMouseMove,
  ...props
}: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    }
    onMouseMove?.(event);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      {/* আভার স্তর: শুধু hover-এ দেখা যায়, ক্লিকে বাধা দেয় না */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklch, var(--primary) 16%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
