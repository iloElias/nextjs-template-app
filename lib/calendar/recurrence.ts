/**
 * Recurrence Calculator
 * Calculates event occurrences based on recurrence rules
 */

import type {
  CalendarEvent,
  DateRange,
  DayOfWeek,
  EventOccurrence,
  RecurrenceRule,
} from "@/types/calendar";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  getLastWeekdayOfMonth,
  getNthWeekdayOfMonth,
  isAfter,
  isBefore,
  isWithinRange,
  startOfDay,
} from "./date-utils";

/**
 * Calculate all event occurrences within a date range
 */
export function calculateEventOccurrences(
  event: CalendarEvent,
  range: DateRange,
): EventOccurrence[] {
  // If no recurrence, return single occurrence if it's in range
  if (!event.recurrence) {
    if (isEventInRange(event, range)) {
      return [eventToOccurrence(event, event.startDate, event.endDate, 0)];
    }
    return [];
  }

  // Calculate recurring occurrences
  return calculateRecurringOccurrences(event, range);
}

/**
 * Calculate all occurrences for a recurring event within a date range
 */
function calculateRecurringOccurrences(
  event: CalendarEvent,
  range: DateRange,
): EventOccurrence[] {
  if (!event.recurrence) return [];

  const occurrences: EventOccurrence[] = [];
  const rule = event.recurrence;
  const eventDuration = event.endDate.getTime() - event.startDate.getTime();

  let currentDate = new Date(event.startDate);
  let occurrenceIndex = 0;

  // Maximum iterations to prevent infinite loops
  const MAX_ITERATIONS = 10000;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    // Check if we've reached the end conditions
    if (rule.endDate && isAfter(currentDate, rule.endDate)) {
      break;
    }

    if (rule.count && occurrenceIndex >= rule.count) {
      break;
    }

    // If current date is past the range end, we're done
    if (isAfter(currentDate, range.end)) {
      break;
    }

    // Check if this occurrence matches the rule and is in range
    if (matchesRecurrenceRule(currentDate, event.startDate, rule)) {
      const occurrenceEnd = new Date(currentDate.getTime() + eventDuration);

      // Only add if it overlaps with the visible range
      if (
        isWithinRange(currentDate, range.start, range.end) ||
        isWithinRange(occurrenceEnd, range.start, range.end) ||
        (isBefore(currentDate, range.start) &&
          isAfter(occurrenceEnd, range.end))
      ) {
        occurrences.push(
          eventToOccurrence(event, currentDate, occurrenceEnd, occurrenceIndex),
        );
      }

      occurrenceIndex++;
    }

    // Move to next potential occurrence based on frequency
    currentDate = getNextOccurrenceDate(currentDate, rule);
    iterations++;
  }

  return occurrences;
}

/**
 * Get the next potential occurrence date based on frequency
 */
function getNextOccurrenceDate(currentDate: Date, rule: RecurrenceRule): Date {
  switch (rule.frequency) {
    case "daily":
      return addDays(currentDate, rule.interval);

    case "weekly":
      return addWeeks(currentDate, rule.interval);

    case "monthly":
      return addMonths(currentDate, rule.interval);

    case "yearly":
      return addYears(currentDate, rule.interval);

    case "custom":
      // For custom recurrence, treat as daily with interval
      return addDays(currentDate, rule.interval);

    default:
      return addDays(currentDate, 1);
  }
}

/**
 * Check if a date matches the recurrence rule
 */
function matchesRecurrenceRule(
  date: Date,
  startDate: Date,
  rule: RecurrenceRule,
): boolean {
  // The date must be on or after the start date
  if (isBefore(date, startDate)) {
    return false;
  }

  // Check interval alignment
  if (!matchesInterval(date, startDate, rule)) {
    return false;
  }

  // Check specific day constraints based on frequency
  switch (rule.frequency) {
    case "weekly":
      return matchesWeeklyRule(date, rule);

    case "monthly":
      return matchesMonthlyRule(date, rule);

    case "yearly":
      return matchesYearlyRule(date, rule);

    default:
      return true;
  }
}

/**
 * Check if date matches the interval
 */
function matchesInterval(
  date: Date,
  startDate: Date,
  rule: RecurrenceRule,
): boolean {
  const daysDiff = differenceInDays(startDate, date);

  switch (rule.frequency) {
    case "daily":
    case "custom":
      return daysDiff % rule.interval === 0;

    case "weekly":
      const weeksDiff = Math.floor(daysDiff / 7);
      return weeksDiff % rule.interval === 0;

    case "monthly":
      const monthsDiff =
        (date.getFullYear() - startDate.getFullYear()) * 12 +
        date.getMonth() -
        startDate.getMonth();
      return monthsDiff % rule.interval === 0;

    case "yearly":
      const yearsDiff = date.getFullYear() - startDate.getFullYear();
      return yearsDiff % rule.interval === 0;

    default:
      return true;
  }
}

/**
 * Check if date matches weekly recurrence rule
 */
function matchesWeeklyRule(date: Date, rule: RecurrenceRule): boolean {
  if (!rule.byWeekDay || rule.byWeekDay.length === 0) {
    return true;
  }

  const dayOfWeek = date.getDay() as DayOfWeek;
  return rule.byWeekDay.includes(dayOfWeek);
}

/**
 * Check if date matches monthly recurrence rule
 */
function matchesMonthlyRule(date: Date, rule: RecurrenceRule): boolean {
  // By day of month (e.g., 15th of each month)
  if (rule.byMonthDay !== undefined) {
    return date.getDate() === rule.byMonthDay;
  }

  // By week of month and day of week (e.g., third Tuesday)
  if (
    rule.byWeekOfMonth !== undefined &&
    rule.byWeekDay &&
    rule.byWeekDay.length > 0
  ) {
    const targetWeekday = rule.byWeekDay[0];
    const dayOfWeek = date.getDay();

    if (dayOfWeek !== targetWeekday) {
      return false;
    }

    // Handle last week of month (byWeekOfMonth = -1)
    if (rule.byWeekOfMonth === -1) {
      const lastOccurrence = getLastWeekdayOfMonth(
        date.getFullYear(),
        date.getMonth(),
        targetWeekday,
      );
      return date.getDate() === lastOccurrence.getDate();
    }

    // Handle specific week (1st, 2nd, 3rd, 4th)
    const nthOccurrence = getNthWeekdayOfMonth(
      date.getFullYear(),
      date.getMonth(),
      targetWeekday,
      rule.byWeekOfMonth,
    );

    if (!nthOccurrence) return false;
    return date.getDate() === nthOccurrence.getDate();
  }

  return true;
}

/**
 * Check if date matches yearly recurrence rule
 */
function matchesYearlyRule(date: Date, rule: RecurrenceRule): boolean {
  // By month (e.g., every January)
  if (rule.byMonth !== undefined) {
    if (date.getMonth() + 1 !== rule.byMonth) {
      return false;
    }
  }

  // By day of month (e.g., every January 1st)
  if (rule.byMonthDay !== undefined) {
    return date.getDate() === rule.byMonthDay;
  }

  return true;
}

/**
 * Check if an event (not recurring) is within a date range
 */
function isEventInRange(event: CalendarEvent, range: DateRange): boolean {
  return (
    isWithinRange(event.startDate, range.start, range.end) ||
    isWithinRange(event.endDate, range.start, range.end) ||
    (isBefore(event.startDate, range.start) &&
      isAfter(event.endDate, range.end))
  );
}

/**
 * Convert a calendar event to an event occurrence
 */
function eventToOccurrence(
  event: CalendarEvent,
  startDate: Date,
  endDate: Date,
  occurrenceIndex: number,
): EventOccurrence {
  return {
    eventId: event.id,
    title: event.title,
    description: event.description,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    timeSlotGroupId: event.timeSlotGroupId,
    color: event.color,
    allDay: event.allDay,
    isRecurring: !!event.recurrence,
    occurrenceIndex,
    metadata: event.metadata,
  };
}

/**
 * Get all occurrences for multiple events within a range
 */
export function calculateAllOccurrences(
  events: CalendarEvent[],
  range: DateRange,
): EventOccurrence[] {
  const allOccurrences: EventOccurrence[] = [];

  for (const event of events) {
    const occurrences = calculateEventOccurrences(event, range);
    allOccurrences.push(...occurrences);
  }

  // Sort by start date
  allOccurrences.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return allOccurrences;
}

/**
 * Get occurrences for a specific day
 */
export function getOccurrencesForDay(
  events: CalendarEvent[],
  date: Date,
): EventOccurrence[] {
  const dayStart = startOfDay(date);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  return calculateAllOccurrences(events, { start: dayStart, end: dayEnd });
}
