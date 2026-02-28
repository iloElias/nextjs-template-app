"use client";

import { Calendar, MonthView } from "@/components/calendar";
import { CalendarSelectedDate, CalendarWrapper } from "@/components/calendar/calendar";
import { MonthViewMonthSelector } from "@/components/calendar/month-view";
import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";

export default function CalendarPage() {
  return (
    <DefaultLayout>
      <Section>
        <Calendar startingDate={new Date("2026-01-01")} weekDaysOff={[0, 6]}>
          <CalendarWrapper>
            <CalendarSelectedDate />
            <MonthViewMonthSelector />
            <MonthView />
          </CalendarWrapper>
        </Calendar>
      </Section>
    </DefaultLayout>
  );
}
