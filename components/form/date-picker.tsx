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
import { useForm } from "./form";
import { useCallback, useId, useMemo } from "react";

export interface DatePickerProps extends HerouiDatePickerProps {
  label?: string;
  timeField?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  timeField = false,
  ...props
}) => {
  const { initialData } = useForm();

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
    if (initialData?.[name]) {
      const date = new Date(initialData[name]);
      return makeDefaultValue(now(date.toISOString()));
    }

    return makeDefaultValue(now(getLocalTimeZone()));
  }, [initialData, name, makeDefaultValue]);

  return (
    <HerouiDatePicker
      aria-label="heroui date picker"
      hideTimeZone
      showMonthAndYearPickers
      defaultValue={defaultValue}
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
