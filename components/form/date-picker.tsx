"use client";

import { inputTheme } from "@/lib/heroui";
import {
  DatePicker as HerouiDatePicker,
  DatePickerProps as HerouiDatePickerProps,
} from "@heroui/react";
import {
  CalendarDate,
  getLocalTimeZone,
  now,
  ZonedDateTime,
} from "@internationalized/date";
import { useCallback, useId, useMemo } from "react";
import { useForm } from "./form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DatePickerProps extends HerouiDatePickerProps<any> {
  label?: string;
  timeField?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  timeField = false,
  ...props
}) => {
  const form = useForm();

  const id = useId();

  const name = useMemo(() => {
    if (props.name) return props.name;
    return id;
  }, [props.name, id]);

  const makeDefaultValue = useCallback(
    (zonedDateTime: ZonedDateTime) => {
      return timeField
        ? zonedDateTime
        : new CalendarDate(
            zonedDateTime.year,
            zonedDateTime.month,
            zonedDateTime.day,
          );
    },
    [timeField],
  );

  const defaultValue = useMemo(() => {
    if (form?.initialData?.[name]) {
      const date = new Date(form.initialData[name]);
      return makeDefaultValue(now(date.toISOString()));
    }

    return makeDefaultValue(now(getLocalTimeZone()));
  }, [form, name, makeDefaultValue]);

  return (
    <HerouiDatePicker
      aria-label="heroui date picker"
      hideTimeZone
      showMonthAndYearPickers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue={defaultValue as any}
      hourCycle={!timeField ? undefined : 24}
      granularity={!timeField ? undefined : "second"}
      timeInputProps={{
        isDisabled: !timeField,
        className: !timeField ? "hidden" : undefined,
      }}
      {...(inputTheme as DatePickerProps)}
      {...props}
    />
  );
};
