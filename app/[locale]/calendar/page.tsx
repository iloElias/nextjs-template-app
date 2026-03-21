"use client";

import { MonthView } from "@/components/calendar";
import { Calendar, CalendarSelectedDate } from "@/components/calendar/calendar";
import {
  MonthViewNavigationAlt,
  MonthViewNavigationAltDayMonth,
  MonthViewNavigationAltExpanded,
  MonthViewNavigationAltMonthYear,
} from "@/components/calendar/month-view-navigation";
import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";

export default function CalendarPage() {
  return (
    <DefaultLayout>
      <Section>
        <Calendar startingDate={new Date("2026-3-15")} weekDaysOff={[0, 6]}>
          <CalendarSelectedDate />
          {/* <MonthViewNavigation /> */}
          <MonthViewNavigationAlt />
          <MonthViewNavigationAltMonthYear />
          <MonthViewNavigationAltDayMonth />
          <MonthViewNavigationAltExpanded />
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
