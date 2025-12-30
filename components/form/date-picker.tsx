import {inputTheme} from "@/lib/heroui";
import {
  DatePicker as HerouiDatePicker,
  DatePickerProps as HerouiDatePickerProps,
} from "@heroui/react";
import {getLocalTimeZone, now} from "@internationalized/date";

export interface DatePickerMultipleProps extends HerouiDatePickerProps {
  label?: string;
  timeField?: boolean;
}

export const DatePicker: React.FC<DatePickerMultipleProps> = ({timeField = false, ...props}) => {


  return (
    <HerouiDatePicker
      hideTimeZone
      showMonthAndYearPickers
      // defaultValue={} // TODO: figure out the type of value that comes here
      {...(timeField ? {defaultValue: now(getLocalTimeZone())} : {})}
      {...(inputTheme as DatePickerMultipleProps)}
      {...props}
    />
  );
};
