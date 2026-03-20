"use client";

import React from "react";
import {
  MonthAndYearPicker,
  MonthOrYearPickerProps,
} from "./month-and-year-picker";

export const MonthPicker: React.FC<
  Omit<MonthOrYearPickerProps, "hideYearPicker" | "hideMonthPicker">
> = (props) => {
  return <MonthAndYearPicker {...props} hideYearPicker />;
};
