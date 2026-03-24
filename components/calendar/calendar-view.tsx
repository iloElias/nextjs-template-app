"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { getCalendarGridDays } from "@/lib/calendar";
import { cn } from "@heroui/react";
import React from "react";
import { Button } from "../button";
import { MonthDayButton } from "./month-day-button";

export interface CalendarViewProps {
  expanded?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  expanded = true,
}) => {
  const monthsInYear = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i);
  }, []);

  return (
    <div
      className={cn(
        "relative grid gap-4",
        expanded
          ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1",
      )}
    >
      {monthsInYear.map((_, index) => (
        <MonthView key={index} month={index} expanded={expanded} />
      ))}
    </div>
  );
};

export interface MonthViewProps {
  expanded?: boolean;
  month?: number;
}

export const MonthView: React.FC<MonthViewProps> = ({ expanded, month }) => {
  const { selectedDate } = useCalendar();
  const t = useSafeI18n();

  const calendarDays = React.useMemo(() => {
    selectedDate.setMonth(month ?? selectedDate.getMonth());
    return getCalendarGridDays(selectedDate, 0);
  }, [selectedDate, month]);

  const maxWeeksPerMonth = 6;
  const weeks = React.useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  const weekdayNames = React.useMemo(
    () => [
      t?.("calendar.weekdays.short.sunday") || "Sun",
      t?.("calendar.weekdays.short.monday") || "Mon",
      t?.("calendar.weekdays.short.tuesday") || "Tue",
      t?.("calendar.weekdays.short.wednesday") || "Wed",
      t?.("calendar.weekdays.short.thursday") || "Thu",
      t?.("calendar.weekdays.short.friday") || "Fri",
      t?.("calendar.weekdays.short.saturday") || "Sat",
    ],
    [t],
  );

  return (
    <table className="calendar-table w-full border-collapse">
      <thead>
        <tr>
          {weekdayNames.map((name, index) => (
            <th
              key={index}
              data-week-day={index + 1}
              className="h-12 max-w-12 p-1 text-center"
            >
              <Button
                isDisabled
                className="h-full w-full max-w-full! min-w-0 truncate! sm:px-4"
              >
                <span className="hidden sm:block">{name}</span>
                <span className="sm:hidden">{name.charAt(0)}</span>
              </Button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((day, dayIndex) => (
              <td key={dayIndex} className="h-12 p-1 text-center">
                <MonthDayButton day={day} />
              </td>
            ))}
          </tr>
        ))}
        {expanded &&
          Array.from({ length: maxWeeksPerMonth - weeks.length }).map(
            (_, idx) => (
              <tr key={idx} className="hidden sm:block">
                <td className="h-12 p-1">
                  <MonthDayButton
                    className="invisible"
                    isDisabled
                    day={new Date()}
                  />
                </td>
              </tr>
            ),
          )}
      </tbody>
    </table>
  );
};
