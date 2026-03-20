"use client";

import { useCalendar } from "@/hooks/use-calendar";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { mergeClassNames } from "@/lib/utils";
import React from "react";
import { Select, SelectProps } from "../form/select";

export const YearSelect: React.FC<
  Omit<SelectProps, "items" | "selectedKeys" | "onSelectionChange">
> = ({ ...props }) => {
  const t = useSafeI18n();
  const { selectedYear, setSelectedYear } = useCalendar();

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 150;
  const maxYear = currentYear + 150;

  const yearOptions = React.useMemo(
    () =>
      Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
        const year = minYear + i;
        return { key: String(year), label: String(year) };
      }),
    [minYear, maxYear],
  );

  return (
    <Select
      className="max-w-16"
      aria-label={t?.("calendar.year") || "Year"}
      items={yearOptions}
      selectedKeys={[String(selectedYear)]}
      onSelectionChange={(keys) => {
        if ((keys as Set<string>).size === 0) return;
        setSelectedYear(Number(Array.from(keys)[0]))
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
