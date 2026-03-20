"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { mergeClassNames } from "@/lib/utils";
import React from "react";
import { Select, SelectProps } from "../form/select";

export const DaySelect: React.FC<
  Omit<SelectProps, "items" | "selectedKeys" | "onSelectionChange">
> = ({ ...props }) => {
  const t = useSafeI18n();
  const { daysInMonth, selectedDate, setSelectedDate } = useCalendar();

  const dayOptions = React.useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        key: String(i + 1),
        label: String(i + 1),
      })),
    [daysInMonth],
  );

  return (
    <Select
      className="max-w-12 min-w-12"
      aria-label={t?.("calendar.day") || "Day"}
      items={dayOptions}
      selectedKeys={[String(selectedDate.getDate())]}
      onSelectionChange={(keys) => {
        if ((keys as Set<string>).size === 0) return;
        const value = Number(Array.from(keys)[0]);
        const newDate = new Date(selectedDate);
        newDate.setDate(value);
        setSelectedDate(newDate);
      }}
      variant="flat"
      showScrollIndicators={false}
      selectorIcon={<span className="hidden" aria-hidden="true" />}
      {...props}
      classNames={mergeClassNames(
        {
          innerWrapper: "w-full",
          value: "text-center",
        },
        props.classNames,
      )}
      selectItemCustomProps={{
        className: "p-1! px-2! text-start data-[selected=true]:bg-primary/20!",
        classNames: {
          selectedIcon: "hidden",
          title:
            "group-data-[selected=true]:font-semibold! group-data-[selected=true]:text-primary",
        },
      }}
    />
  );
};
