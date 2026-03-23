import { inputTheme } from "@/lib/heroui";
import {
  DatePicker as HerouiDatePicker,
  DatePickerProps as HerouiDatePickerProps,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { useForm } from "./form";
import { useMemo } from "react";

export interface DatePickerProps extends HerouiDatePickerProps {
  label?: string;
  timeField?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  timeField = false,
  ...props
}) => {
  const { initialData } = useForm();

  const defaultValue = useMemo(() => {
    if (initialData?.[props.name as string]) {
      const date = new Date(initialData[props.name as string]);
      return now(date.toISOString());
    }
    return now(getLocalTimeZone());
  }, [initialData, props.name]);

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
