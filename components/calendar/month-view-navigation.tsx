"use client";

import React from "react";
import { DaySelect } from "./day-select";
import { MonthSelect } from "./month-select";
import { MonthPicker, YearPicker } from "./month-view-components";
import { DatePicker } from "./picker/date-picker";
import { DayPicker } from "./picker/day-picker";
import { YearSelect } from "./year-select";

export const MonthViewNavigationAlt: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1">
      <DaySelect />
      <MonthSelect />
      <YearSelect />
    </div>
  );
};

export const MonthViewNavigation: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1">
      <DatePicker />
    </div>
  );
};

export const MonthViewNavigationMonthYear: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1">
      <DayPicker />
      <DatePicker
        hiddenPickers={{
          day: true,
        }}
      />
    </div>
  );
};

export const MonthViewNavigationDayMonth: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1">
      <DatePicker
        hiddenPickers={{
          year: true,
        }}
      />
      <YearPicker />
    </div>
  );
};

export const MonthViewNavigationExpanded: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1">
      <DayPicker />
      <MonthPicker />
      <YearPicker />
    </div>
  );
};
