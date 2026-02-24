"use client";

import { useSafeI18n } from "@/hooks/use-safe-i18n";
import {
  addDays,
  addMonths,
  addWeeks,
  calculateAllOccurrences,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { CalendarViewProps, ViewMode } from "@/types/calendar";
import { Button } from "@heroui/react";
import React from "react";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { YearView } from "./year-view";

// Import Solar Icons
import {
  AltArrowLeft,
  AltArrowRight,
  CalendarDate,
  Calendar as CalendarIcon,
  CalendarMinimalistic,
  CalendarSearch,
} from "@solar-icons/react";

/**
 * Main Calendar Component
 * Orchestrates all views and handles navigation
 */
export function Calendar({
  data,
  viewMode: initialViewMode = "month",
  selectedDate: initialSelectedDate = new Date(),
  onViewModeChange,
  onDateSelect,
  onEventClick,
  className,
}: CalendarViewProps) {
  const t = useSafeI18n();

  // Internal state
  const [viewMode, setViewMode] = React.useState<ViewMode>(initialViewMode);
  const [selectedDate, setSelectedDate] = React.useState(initialSelectedDate);

  // Handle view mode change
  const handleViewModeChange = React.useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      onViewModeChange?.(mode);
    },
    [onViewModeChange],
  );

  // Handle date selection
  const handleDateSelect = React.useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    },
    [onDateSelect],
  );

  // Navigation handlers
  const goToToday = React.useCallback(() => {
    handleDateSelect(new Date());
  }, [handleDateSelect]);

  const goToPrevious = React.useCallback(() => {
    switch (viewMode) {
      case "year":
        handleDateSelect(new Date(selectedDate.getFullYear() - 1, 0, 1));
        break;
      case "month":
        handleDateSelect(addMonths(selectedDate, -1));
        break;
      case "week":
        handleDateSelect(addWeeks(selectedDate, -1));
        break;
      case "day":
        handleDateSelect(addDays(selectedDate, -1));
        break;
    }
  }, [viewMode, selectedDate, handleDateSelect]);

  const goToNext = React.useCallback(() => {
    switch (viewMode) {
      case "year":
        handleDateSelect(new Date(selectedDate.getFullYear() + 1, 0, 1));
        break;
      case "month":
        handleDateSelect(addMonths(selectedDate, 1));
        break;
      case "week":
        handleDateSelect(addWeeks(selectedDate, 1));
        break;
      case "day":
        handleDateSelect(addDays(selectedDate, 1));
        break;
    }
  }, [viewMode, selectedDate, handleDateSelect]);

  // Calculate visible date range based on view mode
  const visibleRange = React.useMemo(() => {
    switch (viewMode) {
      case "year":
        return {
          start: startOfYear(selectedDate),
          end: endOfYear(selectedDate),
        };

      case "month":
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
        };

      case "week": {
        const weekStart = startOfWeek(selectedDate, 0);
        return {
          start: weekStart,
          end: addDays(weekStart, 6),
        };
      }

      case "day":
        return {
          start: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0,
          ),
          end: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            23,
            59,
            59,
          ),
        };
    }
  }, [viewMode, selectedDate]);

  // Calculate occurrences for visible range
  const visibleOccurrences = React.useMemo(() => {
    return calculateAllOccurrences(data.events, visibleRange);
  }, [data.events, visibleRange]);

  // Handle month click from year view
  const handleMonthClick = React.useCallback(
    (month: number) => {
      const newDate = new Date(selectedDate.getFullYear(), month, 1);
      handleDateSelect(newDate);
      handleViewModeChange("month");
    },
    [selectedDate, handleDateSelect, handleViewModeChange],
  );

  // Handle day click from month view
  const handleDayClick = React.useCallback(
    (date: Date) => {
      handleDateSelect(date);
      handleViewModeChange("day");
    },
    [handleDateSelect, handleViewModeChange],
  );

  // Handle day click from week view
  const handleWeekDayClick = React.useCallback(
    (date: Date) => {
      handleDateSelect(date);
      handleViewModeChange("day");
    },
    [handleDateSelect, handleViewModeChange],
  );

  return (
    <div
      className={cn("flex h-full w-full flex-col bg-default-100", className)}
    >
      {/* Header / Toolbar */}
      <div className="border-b border-default-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="flat" onClick={goToToday}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t ? t("calendar.today" as any, {}) : "Today"}
            </Button>

            <div className="ml-4 flex items-center gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={goToPrevious}
              >
                <AltArrowLeft size={20} />
              </Button>
              <Button isIconOnly size="sm" variant="light" onClick={goToNext}>
                <AltArrowRight size={20} />
              </Button>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 rounded-lg bg-default-100 p-1">
            <Button
              size="sm"
              variant={viewMode === "year" ? "solid" : "light"}
              onClick={() => handleViewModeChange("year")}
              startContent={<CalendarMinimalistic size={18} />}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t ? t("calendar.year" as any, {}) : "Year"}
            </Button>
            <Button
              size="sm"
              variant={viewMode === "month" ? "solid" : "light"}
              onClick={() => handleViewModeChange("month")}
              startContent={<CalendarDate size={18} />}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t ? t("calendar.month" as any, {}) : "Month"}
            </Button>
            <Button
              size="sm"
              variant={viewMode === "week" ? "solid" : "light"}
              onClick={() => handleViewModeChange("week")}
              startContent={<CalendarSearch size={18} />}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t ? t("calendar.week" as any, {}) : "Week"}
            </Button>
            <Button
              size="sm"
              variant={viewMode === "day" ? "solid" : "light"}
              onClick={() => handleViewModeChange("day")}
              startContent={<CalendarIcon size={18} />}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t ? t("calendar.day" as any, {}) : "Day"}
            </Button>
          </div>
        </div>
      </div>

      {/* View Container */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "year" && (
          <YearView
            year={selectedDate.getFullYear()}
            events={data.events}
            selectedDate={selectedDate}
            onMonthClick={handleMonthClick}
          />
        )}

        {viewMode === "month" && (
          <MonthView
            month={selectedDate.getMonth()}
            year={selectedDate.getFullYear()}
            occurrences={visibleOccurrences}
            selectedDate={selectedDate}
            onDateClick={handleDayClick}
          />
        )}

        {viewMode === "week" && (
          <WeekView
            weekStart={startOfWeek(selectedDate, 0)}
            occurrences={visibleOccurrences}
            timeSlotGroups={data.timeSlotGroups}
            selectedDate={selectedDate}
            onDateClick={handleWeekDayClick}
            onEventClick={onEventClick}
          />
        )}

        {viewMode === "day" && (
          <DayView
            date={selectedDate}
            occurrences={visibleOccurrences}
            timeSlotGroups={data.timeSlotGroups}
            onEventClick={onEventClick}
          />
        )}
      </div>
    </div>
  );
}
