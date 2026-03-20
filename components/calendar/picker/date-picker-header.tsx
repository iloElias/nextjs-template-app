"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { upperCaseFirstLetter } from "@/lib/utils";
import { ButtonProps, cn } from "@heroui/react";
import { useLocale } from "@react-aria/i18n";
import React from "react";
import { Button } from "../../button";
import { DateNavButton } from "../date-nav-button";
import { DatePickerHidden } from "./date-picker-calendar";

export interface DatePickerHeaderProps extends Omit<
  Omit<
    ButtonProps,
    "items" | "selectedKeys" | "onSelectionChange" | "children"
  >,
  "classNames"
> {
  dateFormat?: ((date: Date) => React.ReactNode);
  hiddenPickers?: DatePickerHidden;
  showControls?: boolean;
  isPopoverOpen: boolean;
  buttonJump?: "day" | "month" | "year";
  onControlPrev?: () => void;
  onControlNext?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export const DatePickerHeader: React.FC<DatePickerHeaderProps> = ({
  hiddenPickers,
  showControls = false,
  isPopoverOpen,
  buttonJump = "month",
  onControlPrev,
  onControlNext,
  buttonRef,
  className,
  dateFormat,
  ...props
}) => {
  const { locale } = useLocale();

  const { selectedDate, setSelectedDay, setSelectedMonth, setSelectedYear } =
    useCalendar();

  const displayDate = React.useMemo(() => {
    return selectedDate.toLocaleString(locale, {
      day: hiddenPickers?.day ? undefined : "numeric",
      month: hiddenPickers?.month ? undefined : "long",
      year: hiddenPickers?.year ? undefined : "numeric",
    });
  }, [hiddenPickers, selectedDate, locale]);

  const handleDateControll = (direction: number) => {
    switch (buttonJump) {
      case "day":
        setSelectedDay(selectedDate.getDate() + direction);
        break;
      case "month":
        setSelectedMonth(selectedDate.getMonth() + direction);
        break;
      case "year":
        setSelectedYear(selectedDate.getFullYear() + direction);
        break;
    }
  };

  const handleControlClick = (direction: number) => {
    if (isPopoverOpen) return;

    switch (direction) {
      case -1:
        handleDateControll(direction);
        onControlPrev?.();
        break;
      case 1:
        handleDateControll(direction);
        onControlNext?.();
        break;
    }
  };

  return (
    <Button
      ref={buttonRef}
      className={cn(className, "flex-1", showControls && "justify-between")}
      {...props}
    >
      {!hiddenPickers?.month && showControls && (
        <DateNavButton
          size="sm"
          radius="full"
          direction="prev"
          isDisabled={isPopoverOpen}
          className="-translate-x-3 bg-transparent! hover:bg-default-300!"
          onPress={() => handleControlClick(-1)}
        />
      )}
      <span>
        {typeof dateFormat === "function"
          ? dateFormat(selectedDate)
          : dateFormat
            ? dateFormat
            : upperCaseFirstLetter(displayDate)}
      </span>
      {!hiddenPickers?.month && showControls && (
        <DateNavButton
          size="sm"
          radius="full"
          direction="next"
          isDisabled={isPopoverOpen}
          className="translate-x-3 bg-transparent! hover:bg-default-300!"
          onPress={() => handleControlClick(1)}
        />
      )}
    </Button>
  );
};
