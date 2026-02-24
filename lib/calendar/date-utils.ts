/**
 * Calendar Date Utilities
 * Helper functions for date manipulation and formatting
 */

import type { DayOfWeek } from "@/types/calendar";

/**
 * Get the start of a day (00:00:00)
 */
export function startOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get the end of a day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Get the start of a week (Sunday)
 */
export function startOfWeek(date: Date, weekStartsOn: DayOfWeek = 0): Date {
  const newDate = startOfDay(date);
  const day = newDate.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  newDate.setDate(newDate.getDate() - diff);
  return newDate;
}

/**
 * Get the end of a week (Saturday)
 */
export function endOfWeek(date: Date, weekStartsOn: DayOfWeek = 0): Date {
  const start = startOfWeek(date, weekStartsOn);
  const newDate = new Date(start);
  newDate.setDate(start.getDate() + 6);
  return endOfDay(newDate);
}

/**
 * Get the start of a month
 */
export function startOfMonth(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(1);
  return startOfDay(newDate);
}

/**
 * Get the end of a month
 */
export function endOfMonth(date: Date): Date {
  const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfDay(newDate);
}

/**
 * Get the start of a year
 */
export function startOfYear(date: Date): Date {
  const newDate = new Date(date.getFullYear(), 0, 1);
  return startOfDay(newDate);
}

/**
 * Get the end of a year
 */
export function endOfYear(date: Date): Date {
  const newDate = new Date(date.getFullYear(), 11, 31);
  return endOfDay(newDate);
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/**
 * Add weeks to a date
 */
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  const currentMonth = newDate.getMonth();
  newDate.setMonth(currentMonth + months);

  // Handle month overflow (e.g., Jan 31 + 1 month = Feb 28/29)
  if (newDate.getMonth() !== (currentMonth + months) % 12) {
    newDate.setDate(0); // Go to last day of previous month
  }

  return newDate;
}

/**
 * Add years to a date
 */
export function addYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * Check if two dates are in the same year
 */
export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if date1 is before date2
 */
export function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

/**
 * Check if date1 is after date2
 */
export function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

/**
 * Check if a date is within a range
 */
export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

/**
 * Get all days in a month
 */
export function getDaysInMonth(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days: Date[] = [];

  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Get calendar grid days for a month (including padding days from adjacent months)
 */
export function getCalendarGridDays(
  date: Date,
  weekStartsOn: DayOfWeek = 0,
): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  // Get first day to show (might be from previous month)
  const gridStart = startOfWeek(start, weekStartsOn);

  // Get last day to show (might be from next month)
  const gridEnd = endOfWeek(end, weekStartsOn);

  const days: Date[] = [];
  const current = new Date(gridStart);

  while (current <= gridEnd) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Get days in a week
 */
export function getDaysInWeek(date: Date, weekStartsOn: DayOfWeek = 0): Date[] {
  const start = startOfWeek(date, weekStartsOn);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
}

/**
 * Get the week number of the month (1-5)
 */
export function getWeekOfMonth(date: Date): number {
  const firstDay = startOfMonth(date);
  const dayOfMonth = date.getDate();
  const firstDayOfWeek = firstDay.getDay();

  return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
}

/**
 * Get the nth weekday of a month
 * @example getNthWeekdayOfMonth(2023, 0, 2, 1) // Second Monday of January 2023
 */
export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: DayOfWeek,
  nth: number,
): Date | null {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();

  // Calculate days until first occurrence of the weekday
  const daysUntilWeekday = (weekday - firstWeekday + 7) % 7;

  // Add weeks
  const targetDate = daysUntilWeekday + 1 + (nth - 1) * 7;

  // Check if the date exists in this month
  const date = new Date(year, month, targetDate);
  if (date.getMonth() !== month) {
    return null; // Not enough occurrences in this month
  }

  return date;
}

/**
 * Get the last weekday of a month
 */
export function getLastWeekdayOfMonth(
  year: number,
  month: number,
  weekday: DayOfWeek,
): Date {
  const lastDay = endOfMonth(new Date(year, month, 1));
  const lastWeekday = lastDay.getDay();

  const daysBack = (lastWeekday - weekday + 7) % 7;
  const targetDate = lastDay.getDate() - daysBack;

  return new Date(year, month, targetDate);
}

/**
 * Format time from Date object (HH:mm)
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Parse time string (HH:mm) to hours and minutes
 */
export function parseTime(timeString: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
}

/**
 * Create a date with specific time
 */
export function setTime(date: Date, timeString: string): Date {
  const { hours, minutes } = parseTime(timeString);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

/**
 * Get difference in days between two dates
 */
export function differenceInDays(date1: Date, date2: Date): number {
  const start = startOfDay(date1);
  const end = startOfDay(date2);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in minutes between two dates
 */
export function differenceInMinutes(date1: Date, date2: Date): number {
  const diff = date2.getTime() - date1.getTime();
  return Math.floor(diff / (1000 * 60));
}

/**
 * Check if date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
