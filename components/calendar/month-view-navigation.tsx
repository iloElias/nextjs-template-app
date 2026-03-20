"use client";

import { useCalendar } from "@/hooks/use-calendar";
import React from "react";
import { DateNavButton } from "./date-nav-button";
import { DaySelect } from "./day-select";
import { MonthSelect } from "./month-select";
import { MonthPicker, YearPicker } from "./month-view-components";
import { DatePicker } from "./picker/date-picker";
import { DayPicker } from "./picker/day-picker";
import { YearSelect } from "./year-select";

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
      <DatePicker />
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
