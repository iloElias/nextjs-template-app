/**
 * Calendar Component Type Definitions
 * Supports Year → Month → Week → Day expandable views
 */

export type ViewMode = "year" | "month" | "week" | "day";

export type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday

/**
 * Recurrence Rule
 * Defines how an event repeats
 */
export interface RecurrenceRule {
  /** Frequency of recurrence */
  frequency: RecurrenceFrequency;

  /** Interval between occurrences (e.g., every 2 weeks = interval: 2) */
  interval: number;

  /** End date for the recurrence (optional) */
  endDate?: Date;

  /** Number of occurrences before stopping (optional) */
  count?: number;

  /** Days of week for weekly recurrence (0 = Sunday, 6 = Saturday) */
  byWeekDay?: DayOfWeek[];

  /** Day of month for monthly recurrence (1-31) */
  byMonthDay?: number;

  /** Month of year for yearly recurrence (1-12) */
  byMonth?: number;

  /** Week of month (1 = first week, -1 = last week) */
  byWeekOfMonth?: number;
}

/**
 * Time Slot Group
 * Organizes time periods within a day
 */
export interface TimeSlotGroup {
  /** Unique identifier */
  id: string;

  /** Display name (fully customizable) */
  name: string;

  /** Start time (HH:mm format) */
  startTime: string;

  /** End time (HH:mm format) */
  endTime: string;

  /** Duration of each interval in minutes */
  intervalMinutes: number;

  /** Optional color for visual distinction */
  color?: string;

  /** Optional days this group applies to (0 = Sunday, 6 = Saturday) */
  daysOfWeek?: DayOfWeek[];
}

/**
 * Calendar Event
 * Represents a single event or recurring event
 */
export interface CalendarEvent {
  /** Unique identifier */
  id: string;

  /** Event title */
  title: string;

  /** Event description */
  description?: string;

  /** Start date and time */
  startDate: Date;

  /** End date and time */
  endDate: Date;

  /** Recurrence rule (if event repeats) */
  recurrence?: RecurrenceRule;

  /** Associated time slot group ID */
  timeSlotGroupId?: string;

  /** Event color */
  color?: string;

  /** Whether the event is all day */
  allDay?: boolean;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Calculated Event Occurrence
 * Represents a specific occurrence of an event (including recurring)
 */
export interface EventOccurrence {
  /** Original event ID */
  eventId: string;

  /** Event title */
  title: string;

  /** Event description */
  description?: string;

  /** Start date and time of this occurrence */
  startDate: Date;

  /** End date and time of this occurrence */
  endDate: Date;

  /** Associated time slot group ID */
  timeSlotGroupId?: string;

  /** Event color */
  color?: string;

  /** Whether the event is all day */
  allDay?: boolean;

  /** Whether this is a recurring event */
  isRecurring: boolean;

  /** Index of this occurrence (for recurring events) */
  occurrenceIndex?: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Calendar Data
 * All data received from external API
 */
export interface CalendarData {
  /** List of all events */
  events: CalendarEvent[];

  /** List of time slot groups */
  timeSlotGroups: TimeSlotGroup[];

  /** Current date (for highlighting) */
  currentDate?: Date;
}

/**
 * Date Range
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Day Cell Data
 * Used in month view to show day information
 */
export interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  eventCount: number;
}

/**
 * Time Board Configuration
 * Calculated time range for day/week views
 */
export interface TimeBoardConfig {
  /** Start hour (0-23) */
  startHour: number;

  /** End hour (0-23) */
  endHour: number;

  /** Interval in minutes for grid lines */
  gridIntervalMinutes: number;
}

/**
 * Calendar View Props
 */
export interface CalendarViewProps {
  /** Calendar data */
  data: CalendarData;

  /** Current view mode */
  viewMode: ViewMode;

  /** Currently selected date */
  selectedDate: Date;

  /** Callback when view mode changes */
  onViewModeChange: (mode: ViewMode) => void;

  /** Callback when date is selected */
  onDateSelect: (date: Date) => void;

  /** Callback when an event is clicked */
  onEventClick?: (occurrence: EventOccurrence) => void;

  /** Custom class name */
  className?: string;
}

/**
 * Week View Props
 */
export interface WeekViewProps {
  /** Week start date */
  weekStart: Date;

  /** Event occurrences for this week */
  occurrences: EventOccurrence[];

  /** Time slot groups */
  timeSlotGroups: TimeSlotGroup[];

  /** Currently selected date */
  selectedDate: Date;

  /** Callback when date is clicked */
  onDateClick: (date: Date) => void;

  /** Callback when event is clicked */
  onEventClick?: (occurrence: EventOccurrence) => void;

  /** Custom class name */
  className?: string;
}

/**
 * Day View Props
 */
export interface DayViewProps {
  /** Selected date */
  date: Date;

  /** Event occurrences for this day */
  occurrences: EventOccurrence[];

  /** Time slot groups */
  timeSlotGroups: TimeSlotGroup[];

  /** Callback when event is clicked */
  onEventClick?: (occurrence: EventOccurrence) => void;

  /** Custom class name */
  className?: string;
}

/**
 * Month View Props
 */
export interface MonthViewProps {
  /** Month (0-11) */
  month: number;

  /** Year */
  year: number;

  /** Event occurrences for this month */
  occurrences: EventOccurrence[];

  /** Currently selected date */
  selectedDate: Date;

  /** Callback when date is clicked */
  onDateClick: (date: Date) => void;

  /** Custom class name */
  className?: string;
}

/**
 * Year View Props
 */
export interface YearViewProps {
  /** Year */
  year: number;

  /** All events (to check which months have events) */
  events: CalendarEvent[];

  /** Currently selected date */
  selectedDate: Date;

  /** Callback when month is clicked */
  onMonthClick: (month: number) => void;

  /** Custom class name */
  className?: string;
}
