"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { getDateComponentOrder } from "@/lib/get-date-component-order";
import { cn } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import React, { useCallback } from "react";
import { PickerCalendar } from "./picker-calendar";

export interface DatePickerHidden {
  day?: boolean;
  month?: boolean;
  year?: boolean;
}

interface DatePickerCalendarProps {
  className?: string;
  hiddenPickers?: DatePickerHidden;
}

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  className,
  hiddenPickers,
}) => {
  const { locale } = useLocale();
  const {
    daysInMonth,
    selectedDate,
    setSelectedDay,
    setSelectedMonth,
    setSelectedYear,
  } = useCalendar();

  const dateComponentOrder = React.useMemo(() => {
    return getDateComponentOrder(locale);
  }, [locale]);

  const calendarDayValue = React.useMemo(() => {
    return new CalendarDate(
      selectedDate.getDate(),
      12,
      15, // in the middle of the month to avoid month change auto correction
    );
  }, [selectedDate]);

  const calendarMonthYearValue = React.useMemo(() => {
    return new CalendarDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate(),
    );
  }, [selectedDate]);

  /* Uses date.year because it's picker only goes from 1 to `daysInMonth`. */
  const handleDayChange = useCallback(
    (date: CalendarDate) => {
      setSelectedDay(date.year);
    },
    [setSelectedDay],
  );

  const handleMonthYearChange = useCallback(
    (date: CalendarDate) => {
      setSelectedMonth(date.month - 1);
      setSelectedYear(date.year);
    },
    [setSelectedMonth, setSelectedYear],
  );

  const calendarDate = useCallback(
    (year: number, month: number, day: number) => {
      return new CalendarDate(year, month, day);
    },
    [],
  );

  const minMaxDayPicker = React.useMemo(() => {
    return {
      minValue: calendarDate(1, 1, 1),
      maxValue: calendarDate(daysInMonth, 12, 31),
    };
  }, [daysInMonth, calendarDate]);

  const minMaxMonthYearPicker = React.useMemo(() => {
    return {
      minValue: calendarDate(selectedDate.getFullYear() - 250, 1, 1),
      maxValue: calendarDate(selectedDate.getFullYear() + 250, 12, 31),
    };
  }, [selectedDate, calendarDate]);

  const componentProperties = React.useMemo(() => {
    return {
      day: {
        align: "start" as const,
        className: "flex-2",
        isHidden: hiddenPickers?.day,
        handler: setSelectedDay,
        minMaxKey: "minMaxDayPicker",
      },
      month: {
        align: "center" as const,
        className: "flex-5",
        isHidden: hiddenPickers?.month,
        handler: setSelectedMonth,
        minMaxKey: "minMaxMonthYearPicker",
      },
      year: {
        align: "end" as const,
        className: "flex-3",
        isHidden: hiddenPickers?.year,
        handler: setSelectedYear,
        minMaxKey: "minMaxMonthYearPicker",
      },
    };
  }, [hiddenPickers, setSelectedDay, setSelectedMonth, setSelectedYear]);

  const pickerConfig: Record<
    "day" | "month" | "year",
    {
      ariaLabel: string;
      minMaxValue: { minValue: CalendarDate; maxValue: CalendarDate };
      calendarValue: CalendarDate;
      onChange: (date: CalendarDate) => void;
      classNames: Record<string, string>;
    }
  > = React.useMemo(
    () => ({
      day: {
        ariaLabel: "day picker",
        minMaxValue: minMaxDayPicker,
        calendarValue: calendarDayValue,
        onChange: handleDayChange,
        classNames: { pickerMonthList: "hidden" },
      },
      month: {
        ariaLabel: "month picker",
        minMaxValue: minMaxMonthYearPicker,
        calendarValue: calendarMonthYearValue,
        onChange: handleMonthYearChange,
        classNames: { pickerYearList: "hidden" },
      },
      year: {
        ariaLabel: "year picker",
        minMaxValue: minMaxMonthYearPicker,
        calendarValue: calendarMonthYearValue,
        onChange: handleMonthYearChange,
        classNames: { pickerMonthList: "hidden" },
      },
    }),
    [
      minMaxDayPicker,
      calendarDayValue,
      handleDayChange,
      minMaxMonthYearPicker,
      calendarMonthYearValue,
      handleMonthYearChange,
    ],
  );

  // Get visible components in order
  const visibleComponentsInOrder = React.useMemo(
    () =>
      dateComponentOrder.filter(
        (componentType) =>
          !hiddenPickers?.[componentType as keyof DatePickerHidden],
      ),
    [dateComponentOrder, hiddenPickers],
  );

  // Function to get rounded corner classes based on position in visible order
  const getRoundedCornerClasses = (componentType: "day" | "month" | "year") => {
    const index = visibleComponentsInOrder.indexOf(componentType);
    const isFirst = index === 0;
    const isLast = index === visibleComponentsInOrder.length - 1;

    return cn({
      "rounded-r-none": !isLast,
      "rounded-l-none": !isFirst,
    });
  };

  return (
    <div className={cn("flex max-w-full items-center", className)}>
      {dateComponentOrder.map((componentType) => {
        if (hiddenPickers?.[componentType as keyof DatePickerHidden]) {
          return null;
        }

        const config = pickerConfig[componentType];
        const props = componentProperties[componentType];

        return (
          <PickerCalendar
            key={componentType}
            aria-label={config.ariaLabel}
            className={props.className}
            align={props.align}
            {...config.minMaxValue}
            value={config.calendarValue}
            onFocusChange={config.onChange}
            classNames={{
              ...config.classNames,
              pickerHighlight: getRoundedCornerClasses(componentType),
            }}
          />
        );
      })}
    </div>
  );
};
