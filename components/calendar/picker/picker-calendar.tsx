import { mergeClassNames } from "@/lib/utils";
import { Calendar, CalendarProps, cn } from "@heroui/react";

export interface PickerCalendarProps extends CalendarProps {
  align?: "start" | "center" | "end";
}

export const PickerCalendar: React.FC<PickerCalendarProps> = ({
  align,
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
          pickerItem: cn("text-md capitalize truncate", {
            "justify-start text-left": align === "start",
            "justify-center text-center": align === "center",
            "justify-end text-right": align === "end",
          }),
        },
        classNames,
      )}
      isHeaderExpanded
    />
  );
};
