"use client";

import { Calendar, CalendarSelectedDate } from "@/components/calendar/calendar";
import { CalendarView } from "@/components/calendar/calendar-view";
import { MonthViewNavigation } from "@/components/calendar/month-view-navigation";
import { DatePicker } from "@/components/form/date-picker";
import { TimeInput } from "@/components/form/time-input";
import { DefaultLayout } from "@/components/layout/layout";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { useEffect } from "react";

export default function CalendarPage() {
  const t = useSafeI18n();

  useEffect(() => {
    if (t) {
      document.title = t("metadata.calendar-view.title");
    }
  }, [t]);

  return (
    <DefaultLayout hideHeader>
      <Calendar startingDate={new Date("2026-3-15")} weekDaysOff={[0, 6]}>
        <CalendarSelectedDate />
        <div className="flex gap-2 p-1">
          <DatePicker isDisabled isReadOnly />
          <TimeInput isDisabled isReadOnly expandable />
        </div>
        <MonthViewNavigation />
        <div className="">
          <CalendarView />
        </div>
      </Calendar>
    </DefaultLayout>
  );
}
