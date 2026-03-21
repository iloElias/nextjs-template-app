import { mergeClassNames } from "@/lib/utils";
import { Calendar, CalendarProps, cn } from "@heroui/react";

export interface PickerCalendarProps extends CalendarProps {
  showMonthAndYearPickers?: boolean;
}

export const PickerCalendar: React.FC<PickerCalendarProps> = ({
  classNames,
  ...props
}) => {
  return (
    <Calendar
      {...props}
      showMonthAndYearPickers
      classNames={mergeClassNames(
        {
          base: "shadow-none bg-transparent! max-w-full",
          content: "max-w-full",
          headerWrapper: "hidden",
          pickerHighlight: cn(
            "w-full",
            // "rounded-none bg-transparent border-default border-y-2 border-x-0",
          ),
          pickerItem: "text-md capitalize truncate justify-center text-center",
        },
        classNames,
      )}
      isHeaderExpanded
    />
  );
};
