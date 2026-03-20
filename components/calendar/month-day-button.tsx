"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { isSameDay, isSameMonth, isToday } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import React, { useMemo } from "react";

export interface MonthDayEventDotProps {
  color?: "gray" | "yellow" | "green" | "blue" | "purple" | "red" | "default";
}

export const MonthDayEventDot: React.FC<MonthDayEventDotProps> = ({
  color = "default",
}) => {
  const dotColor = useMemo(() => {
    return {
      default: "text-default-300",
      gray: "text-gray-500",
      yellow: "text-yellow-500",
      green: "text-green-500",
      blue: "text-blue-500",
      purple: "text-purple-500",
      red: "text-red-500",
    }[color];
  }, [color]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-1.25 rounded-full", dotColor)}
      viewBox="0 0 2 2"
      fill="none"
    >
      <circle cx="1" cy="1" r="1" fill="currentColor" />
    </svg>
  );
};

export interface MonthDayButtonProps {
  day: Date;
}

export const MonthDayButton: React.FC<MonthDayButtonProps> = ({ day }) => {
  const { weekDaysOff, selectedDate, setSelectedDate, setCalendarFocus } =
    useCalendar();

  const isCurrentMonth = isSameMonth(day, selectedDate);
  const isTodayDate = isToday(day);
  const isSelected = isSameDay(day, selectedDate);

  let variant: "light" | "solid" | "flat" | "bordered" = "light";
  let color: "default" | "primary" = "default";

  if (isTodayDate) {
    variant = "solid";
    color = "primary";
  } else if (isSelected) {
    variant = "flat";
    color = "primary";
  }

  const handleDateClick = () => {
    if (selectedDate && isSameDay(day, selectedDate)) {
      setCalendarFocus("day"); 
    }
    setSelectedDate(day);
  };

  return (
    <Button
      onPress={handleDateClick}
      variant={variant}
      color={color}
      size="sm"
      className={cn(
        "relative h-full w-full min-w-0 text-sm font-medium",
        isTodayDate && "font-bold text-white!",
        isSelected && !isTodayDate && "font-semibold",
        weekDaysOff.includes(day.getDay()) && "text-default-400",
        weekDaysOff.includes(day.getDay()) && isSelected && !isTodayDate && "text-primary/85",
      )}
    >
      <span
        className={cn("absolute top-1 left-2", !isCurrentMonth && "opacity-25")}
      >
        {day.getDate()}
      </span>
      <span
        className={cn(
          "absolute right-2 bottom-2 flex gap-0.5",
          !isCurrentMonth && "opacity-25",
        )}
      >
        {/* <MonthDayEventDot color="green" />
        <MonthDayEventDot color="blue" /> */}
      </span>
    </Button>
  );
};
