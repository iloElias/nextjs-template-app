"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSafeI18n } from "@/hooks/use-safe-i18n";
import {
  isSameMonth as checkSameMonth,
  getCalendarGridDays,
  isSameDay,
  isToday,
  startOfDay,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { DayCell, MonthViewProps } from "@/types/calendar";
import React from "react";

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

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Month View Component
 * Traditional calendar grid showing all days of the month
 */
export function MonthView({
  month,
  year,
  occurrences,
  selectedDate,
  onDateClick,
  className,
}: MonthViewProps) {
  const t = useSafeI18n();

  // Memoize reference date to avoid useMemo dependency issues
  const currentMonthDate = React.useMemo(
    () => new Date(year, month, 1),
    [year, month],
  );

  // Get all days to display (including padding from adjacent months)
  const gridDays = React.useMemo(() => {
    return getCalendarGridDays(currentMonthDate, 0); // 0 = Sunday start
  }, [currentMonthDate]);

  // Create a map of dates to event counts
  const dayEventCounts = React.useMemo(() => {
    const counts = new Map<string, number>();

    for (const occurrence of occurrences) {
      const dateKey = startOfDay(occurrence.startDate).toISOString();
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
    }

    return counts;
  }, [occurrences]);

  // Transform grid days into day cells
  const dayCells: DayCell[] = React.useMemo(() => {
    return gridDays.map((date) => {
      const dateKey = startOfDay(date).toISOString();
      const eventCount = dayEventCounts.get(dateKey) || 0;

      return {
        date,
        isCurrentMonth: checkSameMonth(date, currentMonthDate),
        isToday: isToday(date),
        hasEvents: eventCount > 0,
        eventCount,
      };
    });
  }, [gridDays, dayEventCounts, currentMonthDate]);

  return (
    <div className={cn("flex h-full w-full flex-col p-4", className)}>
      {/* Month Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-default-900">
          {t
            ? t(
                `calendar.months.${MONTH_NAMES[month].toLowerCase()}` as any,
                {},
              )
            : MONTH_NAMES[month]}{" "}
          {year}
        </h2>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 flex-col">
        {/* Weekday Headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAY_NAMES.map((dayName, index) => (
            <div
              key={index}
              className="py-2 text-center text-sm font-semibold text-default-600"
            >
              {t
                ? t(
                    `calendar.weekdays.short.${dayName.toLowerCase()}` as any,
                    {},
                  )
                : dayName.substring(0, 3)}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid flex-1 grid-cols-7 gap-1">
          {dayCells.map((cell, index) => {
            const isSelected = isSameDay(cell.date, selectedDate);

            return (
              <button
                key={index}
                onClick={() => onDateClick(cell.date)}
                disabled={!cell.isCurrentMonth}
                className={cn(
                  "relative min-h-20 rounded-lg border p-2 transition-all duration-150",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none",
                  "flex flex-col items-start",
                  cell.isCurrentMonth
                    ? "border-default-200 bg-default-50 hover:border-primary hover:shadow-md"
                    : "border-transparent bg-transparent text-default-300",
                  isSelected && "border-primary bg-primary/10 shadow-md",
                  cell.isToday &&
                    !isSelected &&
                    "border-primary/50 bg-primary/5",
                  !cell.isCurrentMonth && "cursor-not-allowed",
                )}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    "mb-1 text-sm font-semibold",
                    cell.isCurrentMonth
                      ? "text-default-900"
                      : "text-default-300",
                    cell.isToday && "text-primary",
                    isSelected && "text-primary",
                  )}
                >
                  {cell.date.getDate()}
                </div>

                {/* Event Indicators */}
                {cell.hasEvents && cell.isCurrentMonth && (
                  <div className="mt-auto flex flex-wrap gap-1">
                    {Array.from({ length: Math.min(cell.eventCount, 3) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isSelected ? "bg-primary" : "bg-primary/60",
                          )}
                        />
                      ),
                    )}
                    {cell.eventCount > 3 && (
                      <div className="ml-1 text-xs text-default-500">
                        +{cell.eventCount - 3}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
