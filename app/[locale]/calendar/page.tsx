"use client";

import { Calendar } from "@/components/calendar";
import type { CalendarData, EventOccurrence, ViewMode } from "@/types/calendar";
import { Card, CardBody } from "@heroui/react";
import React from "react";

/**
 * Sample data generator for calendar demo
 */
function generateSampleData(): CalendarData {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return {
    events: [
      // Single event today
      {
        id: "1",
        title: "Team Meeting",
        description: "Weekly team sync",
        startDate: new Date(currentYear, currentMonth, now.getDate(), 9, 0),
        endDate: new Date(currentYear, currentMonth, now.getDate(), 10, 0),
        color: "#3b82f6",
      },
      // All day event
      {
        id: "2",
        title: "Company Holiday",
        description: "Office closed",
        startDate: new Date(currentYear, currentMonth, 25, 0, 0),
        endDate: new Date(currentYear, currentMonth, 25, 23, 59),
        allDay: true,
        color: "#ef4444",
      },
      // Recurring daily standup
      {
        id: "3",
        title: "Daily Standup",
        description: "Daily team standup",
        startDate: new Date(currentYear, currentMonth, 1, 9, 30),
        endDate: new Date(currentYear, currentMonth, 1, 10, 0),
        color: "#10b981",
        recurrence: {
          frequency: "daily",
          interval: 1,
          endDate: new Date(currentYear, currentMonth + 2, 0),
          byWeekDay: [1, 2, 3, 4, 5], // Monday to Friday
        },
      },
      // Recurring weekly meeting
      {
        id: "4",
        title: "Client Review",
        description: "Weekly client meeting",
        startDate: new Date(currentYear, currentMonth, 3, 14, 0),
        endDate: new Date(currentYear, currentMonth, 3, 15, 30),
        color: "#8b5cf6",
        recurrence: {
          frequency: "weekly",
          interval: 1,
          byWeekDay: [2], // Tuesday
          count: 8,
        },
      },
      // Recurring monthly meeting
      {
        id: "5",
        title: "Board Meeting",
        description: "Monthly board meeting",
        startDate: new Date(currentYear, currentMonth, 15, 10, 0),
        endDate: new Date(currentYear, currentMonth, 15, 12, 0),
        color: "#f59e0b",
        recurrence: {
          frequency: "monthly",
          interval: 1,
          byMonthDay: 15,
          count: 6,
        },
      },
      // Event with time slot group
      {
        id: "6",
        title: "Morning Workshop",
        description: "Team building workshop",
        startDate: new Date(currentYear, currentMonth, now.getDate() + 2, 8, 0),
        endDate: new Date(currentYear, currentMonth, now.getDate() + 2, 12, 0),
        timeSlotGroupId: "morning",
        color: "#06b6d4",
      },
      // Afternoon event
      {
        id: "7",
        title: "Product Demo",
        description: "Demo for potential clients",
        startDate: new Date(
          currentYear,
          currentMonth,
          now.getDate() + 3,
          14,
          0,
        ),
        endDate: new Date(currentYear, currentMonth, now.getDate() + 3, 16, 0),
        timeSlotGroupId: "afternoon",
        color: "#ec4899",
      },
      // Overlapping events
      {
        id: "8",
        title: "Design Review",
        description: "Review latest designs",
        startDate: new Date(
          currentYear,
          currentMonth,
          now.getDate() + 1,
          11,
          0,
        ),
        endDate: new Date(currentYear, currentMonth, now.getDate() + 1, 12, 30),
        color: "#f97316",
      },
      {
        id: "9",
        title: "Code Review",
        description: "Review pull requests",
        startDate: new Date(
          currentYear,
          currentMonth,
          now.getDate() + 1,
          11,
          30,
        ),
        endDate: new Date(currentYear, currentMonth, now.getDate() + 1, 13, 0),
        color: "#14b8a6",
      },
      // Multi-day event
      {
        id: "10",
        title: "Conference",
        description: "Annual tech conference",
        startDate: new Date(currentYear, currentMonth + 1, 10, 9, 0),
        endDate: new Date(currentYear, currentMonth + 1, 12, 17, 0),
        color: "#6366f1",
      },
    ],
    timeSlotGroups: [
      {
        id: "morning",
        name: "Morning Session",
        startTime: "07:00",
        endTime: "12:00",
        intervalMinutes: 60,
        color: "#fbbf24",
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      },
      {
        id: "afternoon",
        name: "Afternoon Session",
        startTime: "13:00",
        endTime: "18:00",
        intervalMinutes: 60,
        color: "#60a5fa",
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      },
      {
        id: "evening",
        name: "Evening Session",
        startTime: "18:00",
        endTime: "22:00",
        intervalMinutes: 60,
        color: "#a78bfa",
      },
    ],
    currentDate: now,
  };
}

/**
 * Calendar Playground Page
 * Demo page showcasing the calendar component
 */
export default function CalendarPlayground() {
  const [calendarData] = React.useState<CalendarData>(generateSampleData);
  const [viewMode, setViewMode] = React.useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedEvent, setSelectedEvent] =
    React.useState<EventOccurrence | null>(null);

  const handleEventClick = React.useCallback((occurrence: EventOccurrence) => {
    setSelectedEvent(occurrence);
    console.log("Event clicked:", occurrence);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-default-50">
      {/* Page Header */}
      <div className="border-b border-default-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-default-900">
          📅 Calendar Component Demo
        </h1>
        <p className="mt-1 text-sm text-default-600">
          Expandable calendar with Year → Month → Week → Day views
        </p>
      </div>

      {/* Calendar Container */}
      <div className="flex-1 overflow-hidden">
        <Calendar
          data={calendarData}
          viewMode={viewMode}
          selectedDate={selectedDate}
          onViewModeChange={setViewMode}
          onDateSelect={setSelectedDate}
          onEventClick={handleEventClick}
        />
      </div>

      {/* Event Details Sidebar (optional) */}
      {selectedEvent && (
        <div className="fixed top-20 right-4 z-50 max-h-96 w-80 overflow-auto">
          <Card>
            <CardBody>
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-default-400 hover:text-default-600"
                >
                  ✕
                </button>
              </div>

              {selectedEvent.description && (
                <p className="mb-3 text-sm text-default-600">
                  {selectedEvent.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div>
                  <strong>Start:</strong>{" "}
                  {selectedEvent.startDate.toLocaleString()}
                </div>
                <div>
                  <strong>End:</strong> {selectedEvent.endDate.toLocaleString()}
                </div>
                {selectedEvent.isRecurring && (
                  <div className="font-medium text-primary">
                    🔄 Recurring Event
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
