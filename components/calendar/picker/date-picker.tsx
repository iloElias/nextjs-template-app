"use client";

import { cn, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { DatePickerCalendar, DatePickerHidden } from "./date-picker-calendar";
import { DatePickerHeader, DatePickerHeaderProps } from "./date-picker-header";

export interface DatePickerProps extends Omit<
  Omit<
    DatePickerHeaderProps,
    "items" | "selectedKeys" | "onSelectionChange" | "isPopoverOpen"
  >,
  "classNames"
> {
  hiddenPickers?: DatePickerHidden;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  hiddenPickers,
  className,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined,
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <Popover placement="bottom" offset={6} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger>
        <DatePickerHeader
          ref={buttonRef}
          hiddenPickers={hiddenPickers}
          className={cn(
            {
              "flex-2!":
                !hiddenPickers?.day &&
                hiddenPickers?.month &&
                hiddenPickers?.year,

              "flex-5!":
                hiddenPickers?.day &&
                !hiddenPickers?.month &&
                hiddenPickers?.year,

              "flex-3!":
                hiddenPickers?.day &&
                hiddenPickers?.month &&
                !hiddenPickers?.year,
            },
            className,
          )}
          isPopoverOpen={isPopoverOpen}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent
        className={cn("flex-row", {
          "w-20":
            !hiddenPickers?.day && hiddenPickers?.month && hiddenPickers?.year,
          "w-32":
            hiddenPickers?.day && hiddenPickers?.month && !hiddenPickers?.year,
          "w-48":
            !hiddenPickers?.day && hiddenPickers?.month && !hiddenPickers?.year,
          "w-52":
            hiddenPickers?.day && !hiddenPickers?.month && hiddenPickers?.year,
          "w-60":
            !hiddenPickers?.day && !hiddenPickers?.month && hiddenPickers?.year,
          "w-70":
            hiddenPickers?.day && !hiddenPickers?.month && !hiddenPickers?.year,
          "w-76":
            !hiddenPickers?.day &&
            !hiddenPickers?.month &&
            !hiddenPickers?.year,
          "w-auto":
            hiddenPickers?.day && hiddenPickers?.month && hiddenPickers?.year,
        })}
        style={{
          minWidth: `${popoverWidth ?? 256}px !important`,
        }}
      >
        <DatePickerCalendar hiddenPickers={hiddenPickers} />
      </PopoverContent>
    </Popover>
  );
};
