"use client";

import React from "react";
import { DatePicker, DatePickerProps } from "./date-picker";

export const DayPicker: React.FC<Omit<DatePickerProps, "hiddenPickers">> = (
  props,
) => {
  return (
    <DatePicker
      {...props}
      hiddenPickers={{
        month: true,
        year: true,
      }}
    />
  );
};
