"use client";

import React from "react";
import { DatePicker, DatePickerProps } from "./date-picker";

export const MonthPicker: React.FC<Omit<DatePickerProps, "hiddenPickers">> = (
  props,
) => {
  return (
    <DatePicker
      {...props}
      hiddenPickers={{
        day: true,
        year: true,
      }}
    />
  );
};
