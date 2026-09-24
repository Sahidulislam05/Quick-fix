"use client";

import { addDays, format, isAfter, isBefore, set, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PriceTag } from "@/components/shared/price-tag";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking } from "@/hooks/use-bookings";
import {
  generateTimeSlots,
  getWorkingHoursForDate,
  isDayAvailable,
} from "@/lib/booking-slots";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/service";
import type { AvailabilitySlot } from "@/types/technician";

type BookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technicianName: string;
  services: Service[];
  availability: AvailabilitySlot[];
  preselectedServiceId?: string;
};

export function BookingDialog({
  open,
  onOpenChange,
  technicianName,
  services,
  availability,
  preselectedServiceId,
}: BookingDialogProps) {
  const router = useRouter();
  const createBooking = useCreateBooking();

  const [serviceId, setServiceId] = useState(
    preselectedServiceId ?? services[0]?.id ?? "",
  );
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState("");

  const selectedService = services.find((service) => service.id === serviceId);
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30); // ৩০ দিন পর্যন্ত বুকিং, বেশি দূরের তারিখ দেখানোর দরকার নেই

  const timeSlots = useMemo(() => {
    if (!date) return [];
    const { startTime, endTime } = getWorkingHoursForDate(date, availability);
    return generateTimeSlots(startTime, endTime);
  }, [date, availability]);

  const canConfirm = Boolean(
    serviceId && date && time && address.trim().length > 5,
  );

  function resetForm() {
    setServiceId(preselectedServiceId ?? services[0]?.id ?? "");
    setDate(undefined);
    setTime(undefined);
    setAddress("");
  }

  async function handleConfirm() {
    if (!date || !time || !selectedService) return;

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledDate = set(date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    }).toISOString();

    const booking = await createBooking
      .mutateAsync({
        serviceId: selectedService.id,
        scheduledDate,
        address: address.trim(),
      })
      .catch(() => null);

    // ✅ ধাপ ৭: এরর হলে (যেমন স্লট আগেই বুকড) এখানেই থেমে যায় — toast useCreateBooking-এর
    // onError-এই দেখানো হয়ে গেছে, ইউজার dialog-এই থেকে অন্য সময় বেছে আবার চেষ্টা করতে পারবে
    if (!booking) return;

    onOpenChange(false);
    resetForm();
    router.push("/dashboard/customer");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {technicianName}</DialogTitle>
          <DialogDescription>
            সার্ভিস, তারিখ ও সময় বেছে বুকিং রিকোয়েস্ট পাঠাও।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label>Service</Label>
            <Select
              value={serviceId}
              onValueChange={(v) => setServiceId(v ?? "")}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.title} — ৳{service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(next) => {
                setDate(next);
                setTime(undefined); // তারিখ বদলালে আগের সময় বাতিল
              }}
              disabled={(candidate) =>
                isBefore(candidate, today) ||
                isAfter(candidate, maxDate) ||
                !isDayAvailable(candidate, availability)
              }
              className="rounded-lg border"
            />
          </div>

          {date && (
            <div className="space-y-1.5">
              <Label>Time</Label>
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                        time === slot
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border hover:bg-muted",
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  এই দিনে কোনো সময় পাওয়া যায়নি।
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                সময়গুলো টেকনিশিয়ানের কাজের সময়ের ভেতর থেকে দেখানো। কোনো স্লট
                আগে থেকে বুকড থাকলে, কনফার্ম করার সময় জানিয়ে দেওয়া হবে।
              </p>
            </div>
          )}

          {/* ৪) ঠিকানা */}
          <div className="space-y-1.5">
            <Label htmlFor="booking-address">Address</Label>
            <Textarea
              id="booking-address"
              placeholder="বাসা/রোড/এলাকার বিস্তারিত ঠিকানা লেখো"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>

          {/* সামারি */}
          {selectedService && date && time && (
            <div className="space-y-1 rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="font-medium">{selectedService.title}</p>
              <p className="text-muted-foreground">
                {format(date, "EEEE, d MMMM yyyy")} at {time}
              </p>
              <PriceTag amount={selectedService.price} size="sm" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!canConfirm || createBooking.isPending}
            onClick={handleConfirm}
          >
            {createBooking.isPending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
