"use client";

import { useCalendar } from "@/hooks/use-calendar";
import {
  ButtonProps,
  Calendar,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import React, { useCallback } from "react";
import { Button } from "../button";

export interface MonthOrYearPickerProps extends Omit<
  Omit<ButtonProps, "items" | "selectedKeys" | "onSelectionChange">,
  "classNames"
> {
  className?: string;
}

export const DayPicker: React.FC<MonthOrYearPickerProps> = ({
  className,
  ...props
}) => {
  const { locale } = useLocale();
  const { daysInMonth, selectedDate, setSelectedDay } = useCalendar();

  const calendarValue = React.useMemo(() => {
    return new CalendarDate(selectedDate.getDate(), 12, 30);
  }, [selectedDate]);

  const handleChange = useCallback(
    (date: CalendarDate) => {
      setSelectedDay(date.year);
    },
    [setSelectedDay],
  );

  return (
    <Popover placement="bottom" offset={6}>
      <PopoverTrigger>
        <Button className={cn(className, "w-12 min-w-12")} {...props}>
          {selectedDate.toLocaleString(locale, {
            day: "numeric",
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-16 p-1">
        <Calendar
          minValue={new CalendarDate(1, 1, 1)}
          maxValue={new CalendarDate(daysInMonth, 12, 31)}
          value={calendarValue}
          onChange={handleChange}
          onFocusChange={handleChange}
          showMonthAndYearPickers
          classNames={{
            base: "shadow-none bg-transparent! overflow-hidden max-w-full",
            content: "max-w-full",
            headerWrapper: "hidden",

            pickerItem: "text-md capitalize",

            pickerMonthList: "hidden",

            pickerHighlight: "w-full",
          }}
          isHeaderExpanded
        />
      </PopoverContent>
    </Popover>
  );
};
