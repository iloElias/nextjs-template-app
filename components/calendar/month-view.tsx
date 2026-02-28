import { useCalendar } from "@/hooks/use-calendar";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { getCalendarGridDays } from "@/lib/calendar";
import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";
import React from "react";
import { Button } from "../button";
import { NumberInput, NumberInputProps } from "../form/number-input";
import { Select, SelectProps } from "../form/select";
import { MonthDayButton } from "./month-day-button";

export const MonthView: React.FC = () => {
  const { selectedDate } = useCalendar();
  const t = useSafeI18n();

  const calendarDays = React.useMemo(
    () => getCalendarGridDays(selectedDate, 0),
    [selectedDate],
  );
  const weeks = React.useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);
  const weekdayNames = React.useMemo(
    () => [
      t?.("calendar.weekdays.short.sunday") || "Sun",
      t?.("calendar.weekdays.short.monday") || "Mon",
      t?.("calendar.weekdays.short.tuesday") || "Tue",
      t?.("calendar.weekdays.short.wednesday") || "Wed",
      t?.("calendar.weekdays.short.thursday") || "Thu",
      t?.("calendar.weekdays.short.friday") || "Fri",
      t?.("calendar.weekdays.short.saturday") || "Sat",
    ],
    [t],
  );

  return (
    <table className="calendar-table w-full border-collapse">
      <thead>
        <tr className="border-b border-default-200">
          {weekdayNames.map((name, index) => (
            <th
              key={index}
              data-week-day={index + 1}
              className="h-12 max-w-12 p-1 text-center"
            >
              <Button
                isDisabled
                className="h-full w-full max-w-full! min-w-12! justify-start truncate!"
              >
                {name}.
              </Button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((day, dayIndex) => (
              <td key={dayIndex} className="h-12 p-1 text-center">
                <MonthDayButton day={day} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface MonthNavButtonProps {
  direction: "prev" | "next";
  onPress: () => void;
}

const MonthNavButton: React.FC<MonthNavButtonProps> = ({
  direction,
  onPress,
}) => (
  <Button
    isIconOnly
    onPress={onPress}
    aria-label={direction === "prev" ? "Previous month" : "Next month"}
  >
    {direction === "prev" ? <AltArrowLeft /> : <AltArrowRight />}
  </Button>
);

const DayInput: React.FC<NumberInputProps> = ({ ...props }) => {
  const t = useSafeI18n();
  const { selectedDate, setSelectedDate } = useCalendar();

  return (
    <NumberInput
      className="max-w-16"
      aria-label={t?.("calendar.day") || "Day"}
      defaultValue={selectedDate.getDate()}
      minValue={1}
      maxValue={new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
      ).getDate()}
      value={selectedDate.getDate()}
      onValueChange={(value) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(value);
        setSelectedDate(newDate);
      }}
      variant="flat"
      formatOptions={{ useGrouping: false }}
      {...props}
    />
  );
};

const MonthSelect: React.FC<
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
    />
  );
};

const YearInput: React.FC<NumberInputProps> = ({ ...props }) => {
  const t = useSafeI18n();
  const { selectedYear, setSelectedYear } = useCalendar();

  return (
    <NumberInput
      className="max-w-28"
      aria-label={t?.("calendar.year") || "Year"}
      defaultValue={selectedYear}
      minValue={new Date().getFullYear() - 100}
      maxValue={new Date().getFullYear() + 100}
      value={selectedYear}
      onValueChange={setSelectedYear}
      variant="flat"
      formatOptions={{ useGrouping: false }}
      {...props}
    />
  );
};

export const MonthViewMonthSelector: React.FC = () => {
  const { selectedDate, setSelectedMonth } = useCalendar();

  return (
    <div className="flex items-center gap-2 p-1">
      <MonthNavButton
        direction="prev"
        onPress={() => setSelectedMonth(selectedDate.getMonth() - 1)}
      />
      <DayInput />
      <MonthSelect />
      <YearInput />
      <MonthNavButton
        direction="next"
        onPress={() => setSelectedMonth(selectedDate.getMonth() + 1)}
      />
    </div>
  );
};
