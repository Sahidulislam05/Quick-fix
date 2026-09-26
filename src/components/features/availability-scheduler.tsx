"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMyAvailability,
  useSetAvailability,
} from "@/hooks/use-technician-profile";
import type { AvailabilitySlot, DayOfWeek } from "@/types/technician";

const DAYS: DayOfWeek[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

const DAY_LABEL: Record<DayOfWeek, string> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

const HOUR_OPTIONS = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, "0")}:00`,
);

export function AvailabilityScheduler() {
  const availabilityQuery = useMyAvailability();
  const setAvailability = useSetAvailability();

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [activeDay, setActiveDay] = useState<DayOfWeek | null>(null);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  // সার্ভার থেকে ডাটা এলে লোকাল স্টেটে বসাও
  useEffect(() => {
    if (availabilityQuery.data) {
      setSlots(
        Array.isArray(availabilityQuery.data)
          ? availabilityQuery.data
          : ((
              availabilityQuery.data as unknown as {
                availabilities?: AvailabilitySlot[];
              }
            )?.availabilities ?? []),
      );
    }
  }, [availabilityQuery.data]);

  function addBlock() {
    if (!activeDay || start >= end) return;
    setSlots((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      { dayOfWeek: activeDay, startTime: start, endTime: end },
    ]);
    setActiveDay(null);
  }

  function removeBlock(index: number) {
    setSlots((prev) =>
      (Array.isArray(prev) ? prev : []).filter((_, i) => i !== index),
    );
  }

  if (availabilityQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day) => {
          const daySlots = (Array.isArray(slots) ? slots : [])
            .map((slot, index) => ({ ...slot, index }))
            .filter((slot) => slot.dayOfWeek === day);

          return (
            <div key={day} className="space-y-2 rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{DAY_LABEL[day]}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setActiveDay(day)}
                  aria-label={`Add time block for ${DAY_LABEL[day]}`}
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs text-muted-foreground">Unavailable</p>
              ) : (
                <div className="space-y-1.5">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.index}
                      className="flex items-center justify-between rounded-md bg-muted px-2 py-1 text-xs"
                    >
                      <span>
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBlock(slot.index)}
                        className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                        aria-label="Remove block"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeDay === day && (
                <div className="space-y-2 rounded-lg border border-dashed p-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={start}
                      onValueChange={(v) => setStart(v ?? "")}
                    >
                      <SelectTrigger className="h-8 flex-1 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOUR_OPTIONS.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">to</span>
                    <Select value={end} onValueChange={(v) => setEnd(v ?? "")}>
                      <SelectTrigger className="h-8 flex-1 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOUR_OPTIONS.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={addBlock}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveDay(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        size="lg"
        disabled={setAvailability.isPending}
        onClick={() => setAvailability.mutate(slots)}
      >
        {setAvailability.isPending && (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        )}
        Save availability
      </Button>
    </div>
  );
}
