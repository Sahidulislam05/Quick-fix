"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookingDialog } from "@/components/features/booking-dialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { Service } from "@/types/service";
import type { AvailabilitySlot } from "@/types/technician";

type BookingTriggerProps = {
  technicianName: string;
  services: Service[];
  availability: AvailabilitySlot[];
  preselectedServiceId?: string;
  label?: string;
  className?: string;
};

export function BookingTrigger({
  technicianName,
  services,
  availability,
  preselectedServiceId,
  label = "Book Now",
  className,
}: BookingTriggerProps) {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <Button size="lg" className={className} disabled>
        {label}
      </Button>
    );
  }

  // ✅ ধাপ ৫: লগইন নেই → লগইনে পাঠাও, ফেরার পথ মনে রাখো
  if (!user) {
    return (
      <Button
        size="lg"
        className={className}
        render={
          <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`} />
        }
      >
        {label}
      </Button>
    );
  }

  // ✅ ধাপ ৫: শুধু Customer বুক করতে পারবে
  if (user.role !== "CUSTOMER") {
    return (
      <Button
        size="lg"
        className={className}
        disabled
        title="শুধু কাস্টমার অ্যাকাউন্ট দিয়ে বুক করা যাবে"
      >
        {label}
      </Button>
    );
  }

  if (services.length === 0) {
    return (
      <Button
        size="lg"
        className={className}
        disabled
        title="এই টেকনিশিয়ানের কোনো সার্ভিস নেই"
      >
        {label}
      </Button>
    );
  }

  return (
    <>
      <Button size="lg" className={className} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <BookingDialog
        open={open}
        onOpenChange={setOpen}
        technicianName={technicianName}
        services={services}
        availability={availability}
        preselectedServiceId={preselectedServiceId}
      />
    </>
  );
}
