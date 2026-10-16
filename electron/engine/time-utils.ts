import { QuietHours, WorkingHours } from '../../shared/types';

/**
 * Parses "HH:mm" into { hours, minutes }
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
  return { hours: isNaN(h) ? 9 : h, minutes: isNaN(m) ? 0 : m };
}

/**
 * Checks if a given timestamp falls within configured working hours and active days.
 */
export function isWithinWorkingHours(timestampMs: number, workingHours: WorkingHours): boolean {
  const d = new Date(timestampMs);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  if (!workingHours.activeDays.includes(day)) {
    return false;
  }

  const { hours: startH, minutes: startM } = parseTimeString(workingHours.startTime);
  const { hours: endH, minutes: endM } = parseTimeString(workingHours.endTime);

  const curMinutes = d.getHours() * 60 + d.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return curMinutes >= startMinutes && curMinutes <= endMinutes;
}

/**
 * Checks if a given timestamp falls within quiet hours (if quiet hours are enabled).
 */
export function isInQuietHours(timestampMs: number, quietHours: QuietHours): boolean {
  if (!quietHours.enabled) return false;

  const d = new Date(timestampMs);
  const { hours: startH, minutes: startM } = parseTimeString(quietHours.startTime);
  const { hours: endH, minutes: endM } = parseTimeString(quietHours.endTime);

  const curMinutes = d.getHours() * 60 + d.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  // Handle overnight quiet hours (e.g. 22:00 to 07:00)
  if (startMinutes <= endMinutes) {
    return curMinutes >= startMinutes && curMinutes <= endMinutes;
  } else {
    return curMinutes >= startMinutes || curMinutes <= endMinutes;
  }
}

/**
 * Calculates the next eligible timestamp starting from `baseTimestampMs + intervalMinutes * 60_000`.
 * If that time is outside working hours or in quiet hours, it advances step-by-step
 * or jumps to the start of the next eligible working window.
 */
export function getNextEligibleTime(
  baseTimestampMs: number,
  intervalMinutes: number,
  workingHours: WorkingHours,
  quietHours: QuietHours
): number {
  let target = baseTimestampMs + intervalMinutes * 60 * 1000;

  // Search forward up to 14 days to find the next valid time slot
  const maxSearchMs = baseTimestampMs + 14 * 24 * 60 * 60 * 1000;

  while (target < maxSearchMs) {
    const d = new Date(target);
    const day = d.getDay();

    // 1. Check if active day
    if (!workingHours.activeDays.includes(day)) {
      // Advance to next day at workingHours.startTime
      d.setDate(d.getDate() + 1);
      const { hours, minutes } = parseTimeString(workingHours.startTime);
      d.setHours(hours, minutes, 0, 0);
      target = d.getTime();
      continue;
    }

    const { hours: startH, minutes: startM } = parseTimeString(workingHours.startTime);
    const { hours: endH, minutes: endM } = parseTimeString(workingHours.endTime);

    const curMinutes = d.getHours() * 60 + d.getMinutes();
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // 2. Check if before working hours today
    if (curMinutes < startMinutes) {
      d.setHours(startH, startM, 0, 0);
      target = d.getTime();
      continue;
    }

    // 3. Check if after working hours today
    if (curMinutes > endMinutes) {
      d.setDate(d.getDate() + 1);
      d.setHours(startH, startM, 0, 0);
      target = d.getTime();
      continue;
    }

    // 4. Check if inside quiet hours
    if (quietHours.enabled && isInQuietHours(target, quietHours)) {
      const { hours: qEndH, minutes: qEndM } = parseTimeString(quietHours.endTime);
      d.setHours(qEndH, qEndM, 0, 0);
      target = d.getTime();
      // If quiet hours ended after working hours, loop continues
      continue;
    }

    // Found valid target time!
    return target;
  }

  return target;
}
