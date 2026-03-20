"use client";

import { MonthView } from "@/components/calendar";
import {
  Calendar,
  CalendarSelectedDate,
  CalendarWrapper,
} from "@/components/calendar/calendar";
import {
  MonthViewNavigation,
  MonthViewNavigationAlt,
  MonthViewNavigationAltExpanded,
} from "@/components/calendar/month-view-navigation";
import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";

export default function CalendarPage() {
  return (
    <DefaultLayout>
      <Section>
        <Calendar startingDate={new Date("2026-3-15")} weekDaysOff={[0, 6]}>
          <CalendarSelectedDate />
          <MonthViewNavigation />
          <MonthViewNavigationAlt />
          <MonthViewNavigationAltExpanded />
          <MonthView />
        </Calendar>
      </Section>
    </DefaultLayout>
  );
}
