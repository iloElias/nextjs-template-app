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
        <Calendar startingDate={new Date("2026-01-01")} weekDaysOff={[0, 6]}>
          <CalendarWrapper>
            <CalendarSelectedDate />
            <MonthViewNavigation />
            <MonthViewNavigationAlt />
            <MonthViewNavigationAltExpanded />
            <MonthView />
          </CalendarWrapper>
        </Calendar>
      </Section>
    </DefaultLayout>
  );
}
