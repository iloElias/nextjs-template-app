"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { mergeClassNames } from "@/lib/utils";
import React from "react";
import { Select, SelectProps } from "../form/select";

export const MonthSelect: React.FC<
  Omit<SelectProps, "items" | "selectedKeys" | "onSelectionChange">
> = ({ ...props }) => {
  const { selectedMonth, setSelectedMonth } = useCalendar();
  const t = useSafeI18n();

  const monthNames = React.useMemo(
    () => [
      t?.("calendar.months.january") || "January",
      t?.("calendar.months.february") || "February",
      t?.("calendar.months.march") || "March",
      t?.("calendar.months.april") || "April",
      t?.("calendar.months.may") || "May",
      t?.("calendar.months.june") || "June",
      t?.("calendar.months.july") || "July",
      t?.("calendar.months.august") || "August",
      t?.("calendar.months.september") || "September",
      t?.("calendar.months.october") || "October",
      t?.("calendar.months.november") || "November",
      t?.("calendar.months.december") || "December",
    ],
    [t],
  );

  return (
    <Select
      variant="flat"
      showScrollIndicators={false}
      selectorIcon={<span className="hidden" aria-hidden="true" />}
      {...props}
      aria-label={t?.("calendar.month") || "Month"}
      items={monthNames.map((name, index) => ({
        key: String(index),
        label: name,
      }))}
      selectedKeys={[String(selectedMonth)]}
      onSelectionChange={(keys) =>
        setSelectedMonth(Number(Array.from(keys)[0]))
      }
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
