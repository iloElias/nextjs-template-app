"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { upperCaseFirstLetter } from "@/lib/utils";
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { DateNavButton } from "./month-nav-button";

export interface MonthOrYearPickerProps extends Omit<
  Omit<ButtonProps, "items" | "selectedKeys" | "onSelectionChange">,
  "classNames"
> {
  hideMonthPicker?: boolean;
  hideYearPicker?: boolean;
  showMonthControls?: boolean;
}

export const MonthAndYearPicker: React.FC<MonthOrYearPickerProps> = ({
  hideMonthPicker,
  hideYearPicker,
  showMonthControls,
  className,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined,
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { locale } = useLocale();
  const { selectedDate, setSelectedMonth, setSelectedYear } = useCalendar();

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const calendarValue = React.useMemo(() => {
    return new CalendarDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate(),
    );
  }, [selectedDate]);

  const seledectedMonthName = React.useMemo(() => {
    return selectedDate.toLocaleString(locale, { month: "long" });
  }, [selectedDate, locale]);

  const handleChange = useCallback(
    (date: CalendarDate) => {
      setSelectedMonth(date.month - 1);
      setSelectedYear(date.year);
    },
    [setSelectedMonth, setSelectedYear],
  );

  return (
    <Popover placement="bottom" offset={6} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger>
        <Button ref={buttonRef} className={cn(className, "flex-1", showMonthControls && "justify-between")} {...props}>
          {!hideMonthPicker && showMonthControls && (
            <DateNavButton
              size="sm"
              radius="full"
              direction="prev"
              isDisabled={isPopoverOpen}
              className="bg-transparent! hover:bg-default-300! -translate-x-3"
              onPress={() => setSelectedMonth(selectedDate.getMonth() - 1)}
            />
          )}
          <span>
            {!hideMonthPicker &&
              hideYearPicker &&
              upperCaseFirstLetter(seledectedMonthName)}
            {!hideMonthPicker &&
              !hideYearPicker &&
              upperCaseFirstLetter(
                selectedDate.toLocaleString(locale, {
                  month: "long",
                  year: "numeric",
                }),
              )}
            {hideMonthPicker && !hideYearPicker && selectedDate.getFullYear()}
          </span>
          {!hideMonthPicker && showMonthControls && (
            <DateNavButton
              size="sm"
              radius="full"
              direction="next"
              isDisabled={isPopoverOpen}
              className="bg-transparent! hover:bg-default-300! translate-x-3"
              onPress={() => setSelectedMonth(selectedDate.getMonth() + 1)}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn({
          "w-32": !hideMonthPicker && hideYearPicker,
          "w-52": !hideMonthPicker && !hideYearPicker,
          "w-24": hideMonthPicker && !hideYearPicker,
        })}
        style={{
          minWidth: `${popoverWidth ?? 256}px !important`,
        }}
      >
        <Calendar
          minValue={new CalendarDate(selectedDate.getFullYear() - 20, 1, 1)}
          maxValue={new CalendarDate(selectedDate.getFullYear() + 20, 12, 31)}
          value={calendarValue}
          onChange={handleChange}
          onFocusChange={handleChange}
          showMonthAndYearPickers
          classNames={{
            base: "shadow-none bg-transparent! overflow-hidden max-w-full",
            content: "max-w-full",
            headerWrapper: "hidden",

            pickerItem: "text-md capitalize",

            pickerMonthList: hideMonthPicker && "hidden",
            pickerYearList: hideYearPicker && "hidden",

            pickerHighlight: "w-full",
          }}
          isHeaderExpanded
        />
      </PopoverContent>
    </Popover>
  );
};
