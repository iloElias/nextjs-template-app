"use client";

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

  setSelectedDate: (date: Date) => void;
  clearSelectedDate: () => void;
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
  const today = useMemo(() => {
    return new Date();
  }, []);

  const [selectedWeek, setSelectedWeekState] = useState<number>(0);
  const [selectedDate, setSelectedDateState] = useState<Date>(startingDate);
  const [weekDaysOff] = useState<number[]>(initialWeekDaysOff || [0, 6]);

  const [calendarFocus, setCalendarFocus] =
    useState<CalendarFocusType>("month");

  const clearSelectedDate = useCallback(() => {
    setSelectedDateState(today);
  }, [today]);

  const setSelectedYear = (year: number) => {
    setSelectedDateState((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
  };

  const setSelectedMonth = (month: number) => {
    setSelectedDateState((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(month);
      return newDate;
    });
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

        setSelectedDate,
        clearSelectedDate,
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
}

export const CalendarSelectedDate: React.FC<CalendarSelectedDateProps> = ({
  className,
}) => {
  const { locale } = useLocale();
  const { selectedDate } = React.useContext(CalendarContext)!;

  return (
    <div className={className}>
      {selectedDate.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </div>
  );
};
