"use client";

import { useCalendar } from "@/hooks/use-calendar";
import React from "react";
import { DaySelect } from "./day-select";
import { MonthAndYearPicker } from "./month-and-year-picker";
import { DateNavButton } from "./month-nav-button";
import { MonthPicker } from "./month-picker";
import { MonthSelect } from "./month-select";
import { YearPicker } from "./year-picker";
import { YearSelect } from "./year-select";
import { DayPicker } from "./day-picker";

export const MonthViewNavigation: React.FC = () => {
  const { selectedDate, setSelectedDay } = useCalendar();

  return (
    <div className="flex items-center gap-2 p-1">
      <DateNavButton
        direction="prev"
        onPress={() => setSelectedDay(selectedDate.getDate() - 1)}
      />
      <DaySelect />
      <MonthSelect />
      <YearSelect />
      <DateNavButton
        direction="next"
        onPress={() => setSelectedDay(selectedDate.getDate() + 1)}
      />
    </div>
  );
};

export const MonthViewNavigationAlt: React.FC = () => {
  const { selectedDate, setSelectedDay } = useCalendar();

  return (
    <div className="flex items-center gap-2 p-1">
      <DateNavButton
        direction="prev"
        onPress={() => setSelectedDay(selectedDate.getDate() - 1)}
      />
      <DayPicker />
      <MonthAndYearPicker showMonthControls />
      <DateNavButton
        direction="next"
        onPress={() => setSelectedDay(selectedDate.getDate() + 1)}
      />
    </div>
  );
};

export const MonthViewNavigationAltExpanded: React.FC = () => {
  const { selectedDate, setSelectedDay } = useCalendar();

  return (
    <div className="flex items-center gap-2 p-1">
      <DateNavButton
        direction="prev"
        onPress={() => setSelectedDay(selectedDate.getDate() - 1)}
      />
      <DayPicker />
      <MonthPicker />
      <YearPicker />
      <DateNavButton
        direction="next"
        onPress={() => setSelectedDay(selectedDate.getDate() + 1)}
      />
    </div>
  );
};
