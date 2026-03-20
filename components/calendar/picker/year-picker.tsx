"use client";

import React from "react";
import { DatePicker, DatePickerProps } from "./date-picker";

export const YearPicker: React.FC<Omit<DatePickerProps, "hiddenPickers">> = (
  props,
) => {
  return (
    <DatePicker
      {...props}
      hiddenPickers={{
        day: true,
        month: true,
      }}
    />
  );
};
