"use client";

import { MonthView } from "@/components/calendar";
import { Calendar, CalendarSelectedDate } from "@/components/calendar/calendar";
import { MonthViewNavigation } from "@/components/calendar/month-view-navigation";
import { DatePicker } from "@/components/form/date-picker";
import { TimeInput } from "@/components/form/time-input";
import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { useEffect } from "react";

export default function CalendarPage() {
  const t = useSafeI18n();

  useEffect(() => {
    if (t) {
      document.title = t("metadata.calendar.title");
    }
  }, [t]);

  return (
    <DefaultLayout>
      <Section>
        <Calendar startingDate={new Date("2026-3-15")} weekDaysOff={[0, 6]}>
          <CalendarSelectedDate />
          <div className="flex gap-2 p-1">
            <DatePicker isDisabled isReadOnly />
            <TimeInput isDisabled isReadOnly expandable />
          </div>
          <MonthViewNavigation />
          <MonthView />
        </Calendar>
      </Section>
      <Section>
        <div className="p-1">
          Aqui são apresentados as possibilidades de seletor de data.
        </div>
      </Section>
    </DefaultLayout>
  );
}
