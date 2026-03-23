"use client";

import {
  DateComponent,
  getDateComponentOrder,
} from "@/lib/get-date-component-order";
import { cn } from "@heroui/react";
import { useLocale } from "@react-aria/i18n";
import React, { createContext, useCallback, useMemo, useState } from "react";

export type CalendarFocusType =
  | "year" // Priority: low
  | "month" // Priority: medium low
  | "week" // Priority: medium
  | "day"; // Priority: high

export interface CalendarContextType {
  today: Date;
  selectedDate: Date;
  weekDaysOff: number[];
  daysInMonth: number;
  dateComponentOrder: DateComponent[];

  setSelectedDate: (date: Date) => void;
  clearSelectedDate: () => void;

  selectedDay: number;
  setSelectedDay: (date: number) => void;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;

  calendarFocus: CalendarFocusType;
  setCalendarFocus: (focus: CalendarFocusType) => void;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export interface CalendarProps {
  children?: React.ReactNode;
  startingDate?: Date;
  weekDaysOff?: number[];
}

export const Calendar: React.FC<CalendarProps> = ({
  children,
  startingDate = new Date(),
  weekDaysOff: initialWeekDaysOff,
}) => {
  const { locale } = useLocale();

  const today = useMemo(() => {
    return new Date();
  }, []);

  const [selectedWeek, setSelectedWeekState] = useState<number>(0);
  const [selectedDate, setSelectedDateState] = useState<Date>(startingDate);
  const [weekDaysOff] = useState<number[]>(initialWeekDaysOff || [0, 6]);

  // Calculate date component order based on locale (cached in context)
  const dateComponentOrder = useMemo(
    () => getDateComponentOrder(locale),
    [locale],
  );

  const daysInMonth = React.useMemo(() => {
    return new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    ).getDate();
  }, [selectedDate]);

  const [calendarFocus, setCalendarFocus] =
    useState<CalendarFocusType>("month");

  const clearSelectedDate = useCallback(() => {
    setSelectedDateState(today);
  }, [today]);

  const updateDateWithClamping = useCallback(
    (prev: Date, apply: (date: Date) => void): Date => {
      const targetDay = prev.getDate();
      const newDate = new Date(prev);
      newDate.setDate(1);
      apply(newDate);
      const lastDayOfMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0,
      ).getDate();
      newDate.setDate(Math.min(targetDay, lastDayOfMonth));
      return newDate;
    },
    [],
  );

  const setSelectedDay = (day: number) => {
    setSelectedDateState((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(day);
      return newDate;
    });
  };

  const setSelectedMonth = (month: number) => {
    setSelectedDateState((prev) =>
      updateDateWithClamping(prev, (date) => date.setMonth(month)),
    );
  };

  const setSelectedYear = (year: number) => {
    setSelectedDateState((prev) =>
      updateDateWithClamping(prev, (date) => date.setFullYear(year)),
    );
  };

  const setSelectedDate = (date: Date) => {
    setSelectedDateState(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        today,
        selectedDate,
        weekDaysOff,
        daysInMonth,
        dateComponentOrder,

        setSelectedDate,
        clearSelectedDate,
        selectedDay: selectedDate.getDate(),
        setSelectedDay,
        selectedWeek,
        setSelectedWeek: setSelectedWeekState,
        selectedMonth: selectedDate.getMonth(),
        setSelectedMonth,
        selectedYear: selectedDate.getFullYear(),
        setSelectedYear,

        calendarFocus,
        setCalendarFocus,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export interface CalendarWrapperProps {
  children?: React.ReactNode;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  children,
}) => {
  return (
    <div className="interpolate *:-transition h-auto w-full overflow-x-auto rounded-large border border-default-200 bg-content1 p-4 shadow-small">
      {children}
    </div>
  );
};

export interface CalendarSelectedDateProps {
  className?: string;
  format?: (date: Date) => React.ReactNode;
}

export const CalendarSelectedDate: React.FC<CalendarSelectedDateProps> = ({
  className,
  format,
}) => {
  const { locale } = useLocale();
  const { selectedDate } = React.useContext(CalendarContext)!;

  return (
    <div className={cn("p-1", className)}>
      {format
        ? format(selectedDate)
        : selectedDate.toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
    </div>
  );
};
