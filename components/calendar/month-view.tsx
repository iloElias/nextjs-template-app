"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { getCalendarGridDays } from "@/lib/calendar";
import React from "react";
import { Button } from "../button";
import { MonthDayButton } from "./month-day-button";

export const MonthView: React.FC = () => {
  const { selectedDate } = useCalendar();
  const t = useSafeI18n();

  const calendarDays = React.useMemo(
    () => getCalendarGridDays(selectedDate, 0),
    [selectedDate],
  );
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
        <tr className="border-b border-default-200">
          {weekdayNames.map((name, index) => (
            <th
              key={index}
              data-week-day={index + 1}
              className="h-12 max-w-12 p-1 text-center"
            >
              <Button
                isDisabled
                className="h-full w-full max-w-full! min-w-12! justify-start truncate!"
              >
                {name}.
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
      </tbody>
    </table>
  );
};
