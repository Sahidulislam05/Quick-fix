import type { AvailabilitySlot, DayOfWeek } from "@/types/technician";

// JS-এর Date.getDay(): 0=রবিবার ... 6=শনিবার
const DAY_OF_WEEK_BY_INDEX: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const DEFAULT_WORKING_HOURS = { startTime: "09:00", endTime: "18:00" };

export function isDayAvailable(
  date: Date,
  availability: AvailabilitySlot[],
): boolean {
  if (availability.length === 0) return true;
  const dow = DAY_OF_WEEK_BY_INDEX[date.getDay()];
  return availability.some((slot) => slot.dayOfWeek === dow);
}

export function getWorkingHoursForDate(
  date: Date,
  availability: AvailabilitySlot[],
) {
  const dow = DAY_OF_WEEK_BY_INDEX[date.getDay()];
  const match = availability.find((slot) => slot.dayOfWeek === dow);
  return match
    ? { startTime: match.startTime, endTime: match.endTime }
    : DEFAULT_WORKING_HOURS;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  stepMinutes = 60,
): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  let cursor = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (cursor + stepMinutes <= end) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    cursor += stepMinutes;
  }
  return slots;
}
