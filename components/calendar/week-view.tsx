"use client";

import { useSafeI18n } from "@/hooks/use-safe-i18n";
import {
  calculateEventColumns,
  calculateEventHeight,
  calculateTimeBoardConfig,
  calculateTimePosition,
  formatTime,
  generateTimeLabels,
  getCurrentTimePosition,
  getDaysInWeek,
  isSameDay,
  isToday,
  startOfDay,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { EventOccurrence, WeekViewProps } from "@/types/calendar";
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

const PIXELS_PER_HOUR = 80;

/**
 * Week View Component
 * Displays 7 days side by side with time-based event positioning
 */
export function WeekView({
  weekStart,
  occurrences,
  timeSlotGroups,
  selectedDate,
  onDateClick,
  onEventClick,
  className,
}: WeekViewProps) {
  const t = useSafeI18n();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Get all days in the week
  const weekDays = React.useMemo(() => {
    return getDaysInWeek(weekStart, 0); // 0 = Sunday start
  }, [weekStart]);

  // Calculate time board configuration
  const timeBoardConfig = React.useMemo(() => {
    return calculateTimeBoardConfig(timeSlotGroups);
  }, [timeSlotGroups]);

  // Generate time labels
  const timeLabels = React.useMemo(() => {
    return generateTimeLabels(timeBoardConfig);
  }, [timeBoardConfig]);

  // Group occurrences by day
  const occurrencesByDay = React.useMemo(() => {
    const map = new Map<string, EventOccurrence[]>();

    for (const day of weekDays) {
      const dayKey = startOfDay(day).toISOString();
      map.set(dayKey, []);
    }

    for (const occurrence of occurrences) {
      const dayKey = startOfDay(occurrence.startDate).toISOString();
      const dayOccurrences = map.get(dayKey);
      if (dayOccurrences) {
        dayOccurrences.push(occurrence);
      }
    }

    return map;
  }, [occurrences, weekDays]);

  // Current time position (for "now" line)
  const currentTimePosition = React.useMemo(() => {
    return getCurrentTimePosition(timeBoardConfig, PIXELS_PER_HOUR);
  }, [timeBoardConfig]);

  // Total height of time board
  const boardHeight =
    (timeBoardConfig.endHour - timeBoardConfig.startHour + 1) * PIXELS_PER_HOUR;

  // Scroll to current time on mount
  React.useEffect(() => {
    if (scrollContainerRef.current && currentTimePosition !== null) {
      const scrollTo = currentTimePosition - 100; // Offset for better visibility
      scrollContainerRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [currentTimePosition]);

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Week Header - Days */}
      <div className="flex border-b border-default-200 bg-default-50">
        {/* Time column spacer */}
        <div className="w-16 shrink-0 border-r border-default-200" />

        {/* Day columns */}
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onDateClick(day)}
              className={cn(
                "min-w-32 flex-1 border-r border-default-200 p-3",
                "transition-colors hover:bg-default-100",
                "focus:ring-2 focus:ring-primary focus:outline-none focus:ring-inset",
                isSelected && "bg-primary/10",
                isDayToday && !isSelected && "bg-primary/5",
              )}
            >
              <div className="text-center">
                <div
                  className={cn(
                    "text-xs font-medium text-default-600",
                    isDayToday && "text-primary",
                  )}
                >
                  {t
                    ? t(
                        `calendar.weekdays.short.${WEEKDAY_NAMES[index].toLowerCase()}` as any,
                        {},
                      )
                    : WEEKDAY_NAMES[index].substring(0, 3)}
                </div>
                <div
                  className={cn(
                    "mt-1 text-2xl font-bold",
                    isDayToday
                      ? "text-primary"
                      : isSelected
                        ? "text-primary"
                        : "text-default-900",
                  )}
                >
                  {day.getDate()}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Time Grid and Events */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        <div className="relative flex">
          {/* Time Labels Column */}
          <div className="w-16 shrink-0 border-r border-default-200 bg-default-50">
            {timeLabels.map((time, index) => (
              <div
                key={index}
                className="relative pr-2 text-right text-xs text-default-500"
                style={{ height: `${PIXELS_PER_HOUR}px` }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day, dayIndex) => {
            const dayKey = startOfDay(day).toISOString();
            const dayOccurrences = occurrencesByDay.get(dayKey) || [];
            const isDayToday = isToday(day);

            // Calculate event positions
            const eventPositions = calculateEventColumns(dayOccurrences);

            return (
              <div
                key={dayIndex}
                className="relative min-w-32 flex-1 border-r border-default-200"
                style={{ height: `${boardHeight}px` }}
              >
                {/* Grid Lines */}
                {timeLabels.map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-full border-t border-default-100"
                    style={{ top: `${index * PIXELS_PER_HOUR}px` }}
                  />
                ))}

                {/* Current Time Indicator */}
                {isDayToday && currentTimePosition !== null && (
                  <div
                    className="absolute z-10 w-full"
                    style={{ top: `${currentTimePosition}px` }}
                  >
                    <div className="relative h-0.5 bg-red-500">
                      <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-red-500" />
                    </div>
                  </div>
                )}

                {/* Events */}
                {dayOccurrences.map((occurrence) => {
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
                        "absolute overflow-hidden rounded-md px-2 py-1 text-xs",
                        "border-l-4 transition-shadow hover:shadow-lg",
                        "focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none",
                        "cursor-pointer text-left",
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 20)}px`,
                        left,
                        width: `calc(${width} - 4px)`,
                        backgroundColor: occurrence.color || "#3b82f6",
                        borderLeftColor: occurrence.color || "#2563eb",
                        opacity: 0.9,
                      }}
                    >
                      <div className="truncate font-semibold text-white">
                        {occurrence.title}
                      </div>
                      {height > 30 && (
                        <div className="mt-0.5 text-xs text-white/90">
                          {formatTime(occurrence.startDate)} -{" "}
                          {formatTime(occurrence.endDate)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
