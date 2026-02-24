/**
 * Time Slot Group Utilities
 * Handles time board configuration and time slot calculations
 */

import type {
  DayOfWeek,
  TimeBoardConfig,
  TimeSlotGroup,
} from "@/types/calendar";
import { parseTime } from "./date-utils";

/**
 * Calculate time board configuration for day/week views
 * Extends visible range beyond slot groups for breathing space
 */
export function calculateTimeBoardConfig(
  timeSlotGroups: TimeSlotGroup[],
  date?: Date,
): TimeBoardConfig {
  if (timeSlotGroups.length === 0) {
    // Default configuration: 6 AM to 10 PM with 30-minute intervals
    return {
      startHour: 6,
      endHour: 22,
      gridIntervalMinutes: 30,
    };
  }

  // Filter groups that apply to this day (if specific day is provided)
  let applicableGroups = timeSlotGroups;
  if (date) {
    const dayOfWeek = date.getDay() as DayOfWeek;
    applicableGroups = timeSlotGroups.filter(
      (group) =>
        !group.daysOfWeek ||
        group.daysOfWeek.length === 0 ||
        group.daysOfWeek.includes(dayOfWeek),
    );
  }

  if (applicableGroups.length === 0) {
    // No applicable groups for this day
    return {
      startHour: 6,
      endHour: 22,
      gridIntervalMinutes: 30,
    };
  }

  // Find earliest start and latest end
  let earliestHour = 23;
  let latestHour = 0;
  let smallestInterval = 60;

  for (const group of applicableGroups) {
    const start = parseTime(group.startTime);
    const end = parseTime(group.endTime);

    earliestHour = Math.min(earliestHour, start.hours);
    latestHour = Math.max(latestHour, end.hours);

    // Track smallest interval for grid lines
    smallestInterval = Math.min(smallestInterval, group.intervalMinutes);
  }

  // Add buffer: one hour before and after (with bounds checking)
  const startHour = Math.max(0, earliestHour - 1);
  const endHour = Math.min(23, latestHour + 1);

  // Use smallest interval, but default to 30 if too small or too large
  let gridIntervalMinutes = smallestInterval;
  if (gridIntervalMinutes < 15 || gridIntervalMinutes > 60) {
    gridIntervalMinutes = 30;
  }

  return {
    startHour,
    endHour,
    gridIntervalMinutes,
  };
}

/**
 * Get all time intervals within a time slot group
 */
export function getTimeSlotIntervals(group: TimeSlotGroup): Date[] {
  const intervals: Date[] = [];
  const start = parseTime(group.startTime);
  const end = parseTime(group.endTime);

  // Create a base date (today at start time)
  const baseDate = new Date();
  baseDate.setHours(start.hours, start.minutes, 0, 0);

  // Create end date
  const endDate = new Date();
  endDate.setHours(end.hours, end.minutes, 0, 0);

  const current = new Date(baseDate);

  while (current <= endDate) {
    intervals.push(new Date(current));
    current.setMinutes(current.getMinutes() + group.intervalMinutes);
  }

  return intervals;
}

/**
 * Check if a time slot group applies to a specific day
 */
export function groupAppliesOnDay(group: TimeSlotGroup, date: Date): boolean {
  if (!group.daysOfWeek || group.daysOfWeek.length === 0) {
    return true; // Applies to all days
  }

  const dayOfWeek = date.getDay() as DayOfWeek;
  return group.daysOfWeek.includes(dayOfWeek);
}

/**
 * Get applicable time slot groups for a specific day
 */
export function getApplicableGroups(
  timeSlotGroups: TimeSlotGroup[],
  date: Date,
): TimeSlotGroup[] {
  return timeSlotGroups.filter((group) => groupAppliesOnDay(group, date));
}

/**
 * Generate time labels for the time board
 * Creates an array of time strings based on the board config
 */
export function generateTimeLabels(config: TimeBoardConfig): string[] {
  const labels: string[] = [];
  const { startHour, endHour, gridIntervalMinutes } = config;

  let currentHour = startHour;
  let currentMinutes = 0;

  while (currentHour <= endHour) {
    if (currentHour === endHour && currentMinutes > 0) {
      break; // Stop if we've passed the end hour
    }

    const hourStr = currentHour.toString().padStart(2, "0");
    const minutesStr = currentMinutes.toString().padStart(2, "0");
    labels.push(`${hourStr}:${minutesStr}`);

    // Move to next interval
    currentMinutes += gridIntervalMinutes;
    if (currentMinutes >= 60) {
      currentHour++;
      currentMinutes = 0;
    }
  }

  return labels;
}

/**
 * Calculate pixel position for a time on the time board
 * @param time Time string (HH:mm)
 * @param config Time board configuration
 * @param pixelsPerHour Pixels per hour (default: 60)
 */
export function calculateTimePosition(
  time: string,
  config: TimeBoardConfig,
  pixelsPerHour: number = 60,
): number {
  const { hours, minutes } = parseTime(time);
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = config.startHour * 60;

  const minutesFromStart = totalMinutes - startMinutes;
  return (minutesFromStart / 60) * pixelsPerHour;
}

/**
 * Calculate event height in pixels based on duration
 * @param startTime Start time string (HH:mm)
 * @param endTime End time string (HH:mm)
 * @param pixelsPerHour Pixels per hour (default: 60)
 */
export function calculateEventHeight(
  startTime: string,
  endTime: string,
  pixelsPerHour: number = 60,
): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  const durationMinutes = endMinutes - startMinutes;
  return (durationMinutes / 60) * pixelsPerHour;
}

/**
 * Get current time position for the "now" indicator
 */
export function getCurrentTimePosition(
  config: TimeBoardConfig,
  pixelsPerHour: number = 60,
): number | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Check if current time is within the visible board
  if (currentHour < config.startHour || currentHour > config.endHour) {
    return null;
  }

  const totalMinutes = currentHour * 60 + currentMinutes;
  const startMinutes = config.startHour * 60;

  const minutesFromStart = totalMinutes - startMinutes;
  return (minutesFromStart / 60) * pixelsPerHour;
}

/**
 * Calculate overlap columns for simultaneous events
 * Returns array of column assignments for each event
 */
export interface EventWithPosition {
  startMinutes: number;
  endMinutes: number;
  column: number;
  totalColumns: number;
}

export function calculateEventColumns<
  T extends { startDate: Date; endDate: Date },
>(events: T[]): Map<T, EventWithPosition> {
  const positionMap = new Map<T, EventWithPosition>();

  if (events.length === 0) return positionMap;

  // Sort events by start time
  const sortedEvents = [...events].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );

  // Calculate minutes from midnight for each event
  const eventTimes = sortedEvents.map((event) => ({
    event,
    startMinutes:
      event.startDate.getHours() * 60 + event.startDate.getMinutes(),
    endMinutes: event.endDate.getHours() * 60 + event.endDate.getMinutes(),
  }));

  // Group overlapping events
  const groups: (typeof eventTimes)[] = [];
  let currentGroup: typeof eventTimes = [];

  for (let i = 0; i < eventTimes.length; i++) {
    const current = eventTimes[i];

    if (currentGroup.length === 0) {
      currentGroup.push(current);
    } else {
      // Check if current event overlaps with any event in the current group
      const overlaps = currentGroup.some(
        (e) =>
          current.startMinutes < e.endMinutes &&
          current.endMinutes > e.startMinutes,
      );

      if (overlaps) {
        currentGroup.push(current);
      } else {
        // Start a new group
        groups.push(currentGroup);
        currentGroup = [current];
      }
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // Assign columns within each group
  for (const group of groups) {
    const columns: (typeof eventTimes)[] = [];

    for (const eventTime of group) {
      // Find the first column where this event doesn't overlap
      let assigned = false;
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        const overlaps = column.some(
          (e) =>
            eventTime.startMinutes < e.endMinutes &&
            eventTime.endMinutes > e.startMinutes,
        );

        if (!overlaps) {
          column.push(eventTime);
          assigned = true;
          break;
        }
      }

      // Create new column if needed
      if (!assigned) {
        columns.push([eventTime]);
      }
    }

    // Assign positions
    const totalColumns = columns.length;
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      for (const eventTime of columns[colIndex]) {
        positionMap.set(eventTime.event, {
          startMinutes: eventTime.startMinutes,
          endMinutes: eventTime.endMinutes,
          column: colIndex,
          totalColumns,
        });
      }
    }
  }

  return positionMap;
}
