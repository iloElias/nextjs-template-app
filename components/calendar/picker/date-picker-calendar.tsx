"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { cn } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import React, { useCallback } from "react";
import { PickerCalendar } from "./picker-calendar";

export interface DatePickerHidden {
  day?: boolean;
  month?: boolean;
  year?: boolean;
}

interface DatePickerCalendarProps {
  className?: string;
  hiddenPickers?: DatePickerHidden;
}

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  className,
  hiddenPickers,
}) => {
  const {
    daysInMonth,
    selectedDate,
    setSelectedDay,
    setSelectedMonth,
    setSelectedYear,
  } = useCalendar();

  const calendarDayValue = React.useMemo(() => {
    return new CalendarDate(
      selectedDate.getDate(),
      12,
      15, // in the middle of the month to avoid month change auto correction
    );
  }, [selectedDate]);

  const calendarMonthYearValue = React.useMemo(() => {
    return new CalendarDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate(),
    );
  }, [selectedDate]);

  /* Uses date.year because it's picker only goes from 1 to `daysInMonth`. */
  const handleDayChange = useCallback(
    (date: CalendarDate) => {
      setSelectedDay(date.year);
    },
    [setSelectedDay],
  );

  const handleMonthYearChange = useCallback(
    (date: CalendarDate) => {
      setSelectedMonth(date.month - 1);
      setSelectedYear(date.year);
    },
    [setSelectedMonth, setSelectedYear],
  );

  const calendarDate = useCallback(
    (year: number, month: number, day: number) => {
      return new CalendarDate(year, month, day);
    },
    [],
  );

  const minMaxDayPicker = React.useMemo(() => {
    return {
      minValue: calendarDate(1, 1, 1),
      maxValue: calendarDate(daysInMonth, 12, 31),
    };
  }, [daysInMonth, calendarDate]);

  const minMaxMonthYearPicker = React.useMemo(() => {
    return {
      minValue: calendarDate(selectedDate.getFullYear() - 20, 1, 1),
      maxValue: calendarDate(selectedDate.getFullYear() + 20, 12, 31),
    };
  }, [selectedDate, calendarDate]);

  return (
    <div className={cn("flex items-center max-w-full", className)}>
      {!hiddenPickers?.day && (
        <PickerCalendar
          aria-label="day picker"
          className="flex-2"
          align="start"
          {...minMaxDayPicker}
          value={calendarDayValue}
          onFocusChange={handleDayChange}
          classNames={{
            pickerMonthList: "hidden",
          }}
        />
      )}
      {!hiddenPickers?.month && (
        <PickerCalendar
          aria-label="month picker"
          className="flex-5"
          align="center"
          {...minMaxMonthYearPicker}
          value={calendarMonthYearValue}
          onFocusChange={handleMonthYearChange}
          classNames={{
            pickerYearList: "hidden",
          }}
        />
      )}
      {!hiddenPickers?.year && (
        <PickerCalendar
          aria-label="year picker"
          className="flex-3"
          align="end"
          {...minMaxMonthYearPicker}
          value={calendarMonthYearValue}
          onFocusChange={handleMonthYearChange}
          classNames={{
            pickerMonthList: "hidden",
          }}
        />
      )}
    </div>
  );
};
