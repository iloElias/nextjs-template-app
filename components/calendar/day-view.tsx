"use client";

import { useSafeI18n } from "@/hooks/use-safe-i18n";
import {
  calculateEventColumns,
  calculateEventHeight,
  calculateTimeBoardConfig,
  calculateTimePosition,
  formatTime,
  generateTimeLabels,
  getApplicableGroups,
  getCurrentTimePosition,
  isToday,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { DayViewProps } from "@/types/calendar";
import React from "react";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PIXELS_PER_HOUR = 100; // Slightly taller for day view

/**
 * Day View Component
 * Detailed single-day layout with precise event positioning
 */
export function DayView({
  date,
  occurrences,
  timeSlotGroups,
  onEventClick,
  className,
}: DayViewProps) {
  const t = useSafeI18n();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isDayToday = isToday(date);

  // Get applicable time slot groups for this day
  const applicableGroups = React.useMemo(() => {
    return getApplicableGroups(timeSlotGroups, date);
  }, [timeSlotGroups, date]);

  // Calculate time board configuration
  const timeBoardConfig = React.useMemo(() => {
    return calculateTimeBoardConfig(applicableGroups, date);
  }, [applicableGroups, date]);

  // Generate time labels
  const timeLabels = React.useMemo(() => {
    return generateTimeLabels(timeBoardConfig);
  }, [timeBoardConfig]);

  // Calculate event positions
  const eventPositions = React.useMemo(() => {
    return calculateEventColumns(occurrences);
  }, [occurrences]);

  // Current time position (for "now" line)
  const currentTimePosition = React.useMemo(() => {
    if (!isDayToday) return null;
    return getCurrentTimePosition(timeBoardConfig, PIXELS_PER_HOUR);
  }, [timeBoardConfig, isDayToday]);

  // Total height of time board
  const boardHeight =
    (timeBoardConfig.endHour - timeBoardConfig.startHour + 1) * PIXELS_PER_HOUR;

  // Scroll to current time on mount
  React.useEffect(() => {
    if (scrollContainerRef.current && currentTimePosition !== null) {
      const scrollTo = currentTimePosition - 150; // Offset for better visibility
      scrollContainerRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [currentTimePosition]);

  const dayOfWeek = WEEKDAY_NAMES[date.getDay()];
  const monthName = MONTH_NAMES[date.getMonth()];

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Day Header */}
      <div className="border-b border-default-200 bg-default-50 px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline gap-3">
            <h2
              className={cn(
                "text-4xl font-bold",
                isDayToday ? "text-primary" : "text-default-900",
              )}
            >
              {date.getDate()}
            </h2>
            <div className="text-lg text-default-600">
              {t
                ? t(`calendar.weekdays.${dayOfWeek.toLowerCase()}` as any, {})
                : dayOfWeek}
              ,{" "}
              {t
                ? t(`calendar.months.${monthName.toLowerCase()}` as any, {})
                : monthName}{" "}
              {date.getFullYear()}
            </div>
            {isDayToday && (
              <span className="ml-3 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {t ? t("calendar.today" as any, {}) : "Today"}
              </span>
            )}
          </div>

          {/* Event Count */}
          {occurrences.length > 0 && (
            <div className="mt-2 text-sm text-default-500">
              {occurrences.length}{" "}
              {occurrences.length === 1
                ? t
                  ? t("calendar.event")
                  : "event"
                : t
                  ? t("calendar.events")
                  : "events"}
            </div>
          )}
        </div>
      </div>

      {/* Time Slot Groups Info (if any) */}
      {applicableGroups.length > 0 && (
        <div className="border-b border-default-200 bg-primary/5 px-6 py-2">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-2">
            {applicableGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-700"
                style={{
                  borderLeft: group.color
                    ? `3px solid ${group.color}`
                    : undefined,
                }}
              >
                {group.name}: {group.startTime} - {group.endTime}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Grid and Events */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl">
          <div className="relative flex">
            {/* Time Labels Column */}
            <div className="sticky left-0 z-10 w-20 shrink-0 border-r border-default-200 bg-default-50">
              {timeLabels.map((time, index) => (
                <div
                  key={index}
                  className="relative py-1 pr-3 text-right text-sm font-medium text-default-600"
                  style={{ height: `${PIXELS_PER_HOUR}px` }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Events Column */}
            <div
              className="relative flex-1 bg-default-50"
              style={{ height: `${boardHeight}px` }}
            >
              {/* Grid Lines */}
              {timeLabels.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-default-200"
                  style={{ top: `${index * PIXELS_PER_HOUR}px` }}
                />
              ))}

              {/* Half-hour lines */}
              {timeLabels.map((_, index) => (
                <div
                  key={`half-${index}`}
                  className="absolute w-full border-t border-dashed border-default-100"
                  style={{
                    top: `${index * PIXELS_PER_HOUR + PIXELS_PER_HOUR / 2}px`,
                  }}
                />
              ))}

              {/* Current Time Indicator */}
              {isDayToday && currentTimePosition !== null && (
                <div
                  className="absolute z-20 w-full"
                  style={{ top: `${currentTimePosition}px` }}
                >
                  <div className="relative h-0.5 bg-red-500 shadow-md">
                    <div className="absolute -top-1.5 -left-2 h-3 w-3 rounded-full bg-red-500 shadow-md" />
                    <div className="absolute -top-3 left-2 text-xs font-semibold text-red-500">
                      {formatTime(new Date())}
                    </div>
                  </div>
                </div>
              )}

              {/* Events */}
              {occurrences.map((occurrence) => {
                const position = eventPositions.get(occurrence);
                if (!position) return null;

                const top = calculateTimePosition(
                  formatTime(occurrence.startDate),
                  timeBoardConfig,
                  PIXELS_PER_HOUR,
                );

                const height = calculateEventHeight(
                  formatTime(occurrence.startDate),
                  formatTime(occurrence.endDate),
                  PIXELS_PER_HOUR,
                );

                const width = `${100 / position.totalColumns}%`;
                const left = `${(position.column * 100) / position.totalColumns}%`;

                return (
                  <button
                    key={`${occurrence.eventId}-${occurrence.occurrenceIndex}`}
                    onClick={() => onEventClick?.(occurrence)}
                    className={cn(
                      "absolute overflow-hidden rounded-lg px-4 py-2 text-sm",
                      "border-l-4 transition-all hover:shadow-2xl",
                      "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
                      "z-10 cursor-pointer text-left",
                    )}
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height, 30)}px`,
                      left: `calc(${left} + 8px)`,
                      width: `calc(${width} - 16px)`,
                      backgroundColor: occurrence.color || "#3b82f6",
                      borderLeftColor: occurrence.color || "#2563eb",
                      opacity: 0.95,
                    }}
                  >
                    <div className="font-bold text-white">
                      {occurrence.title}
                    </div>
                    <div className="mt-1 text-xs text-white/90">
                      {formatTime(occurrence.startDate)} -{" "}
                      {formatTime(occurrence.endDate)}
                    </div>
                    {occurrence.description && height > 60 && (
                      <div className="mt-2 line-clamp-2 text-xs text-white/80">
                        {occurrence.description}
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Empty State */}
              {occurrences.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-default-400">
                    <div className="mb-2 text-4xl">📅</div>
                    <div className="text-lg">
                      {t
                        ? t("calendar.noEvents" as any, {})
                        : "No events scheduled"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
