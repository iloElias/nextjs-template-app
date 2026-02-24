"use client";

import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { cn } from "@/lib/utils";
import type { YearViewProps } from "@/types/calendar";
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

/**
 * Year View Component
 * Displays all 12 months in a grid layout
 */
export function YearView({
  year,
  events,
  selectedDate,
  onMonthClick,
  className,
}: YearViewProps) {
  const t = useSafeI18n();

  // Check which months have events
  const monthsWithEvents = React.useMemo(() => {
    const months = new Set<number>();

    for (const event of events) {
      const startMonth = event.startDate.getMonth();
      const startYear = event.startDate.getFullYear();
      const endMonth = event.endDate.getMonth();
      const endYear = event.endDate.getFullYear();

      // Add all months covered by this event in the current year
      if (startYear === year) {
        months.add(startMonth);
      }
      if (endYear === year) {
        months.add(endMonth);
      }

      // If event spans multiple months within this year
      if (startYear === year && endYear === year && startMonth !== endMonth) {
        for (let m = startMonth + 1; m < endMonth; m++) {
          months.add(m);
        }
      }
    }

    return months;
  }, [events, year]);

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  return (
    <div className={cn("h-full w-full p-4", className)}>
      {/* Year Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-default-900">{year}</h1>
      </div>

      {/* Months Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {MONTH_NAMES.map((monthName, monthIndex) => {
          const hasEvents = monthsWithEvents.has(monthIndex);
          const isSelected =
            year === selectedYear && monthIndex === selectedMonth;

          return (
            <button
              key={monthIndex}
              onClick={() => onMonthClick(monthIndex)}
              className={cn(
                "relative rounded-xl border-2 p-6 transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-default-200 bg-default-50 hover:border-primary/50",
                hasEvents && "bg-primary/5",
              )}
            >
              {/* Month Name */}
              <div
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isSelected ? "text-primary" : "text-default-700",
                )}
              >
                {t
                  ? t(`calendar.months.${monthName.toLowerCase()}` as any, {})
                  : monthName}
              </div>

              {/* Event Indicator */}
              {hasEvents && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-2 w-2 rounded-full bg-primary opacity-70" />
                  <div className="h-2 w-2 rounded-full bg-primary opacity-40" />
                </div>
              )}

              {/* Mini Calendar Preview (optional enhancement) */}
              <div className="mt-3 grid grid-cols-7 gap-0.5 text-xs text-default-400">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="text-center">
                    {day}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
