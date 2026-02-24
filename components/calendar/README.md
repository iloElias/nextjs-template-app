# 📅 Calendar Component

A modern, expandable calendar component inspired by Android Calendar with full support for recurring events, time slot groups, and multiple view modes.

## 🎯 Features

- **4 View Modes**: Year → Month → Week → Day
- **Recurring Events**: Support for daily, weekly, monthly, yearly, and custom recurrence patterns
- **Time Slot Groups**: Organize periods within a day with customizable intervals
- **Intelligent Time Board**: Automatically adjusts visible time range with buffer space
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Internationalization**: Full i18n support (English and Portuguese)
- **Data-Driven**: Completely controlled by external data (no API calls)
- **Overlapping Events**: Smart column layout for simultaneous events
- **Current Time Indicator**: Real-time "now" line in day/week views

## 📦 Installation

All dependencies are already included in the project. The calendar uses:

- `@heroui/react` - UI components
- `@solar-icons/react` - Icons
- `@internationalized/date` - Date handling

## 🚀 Quick Start

```tsx
import { Calendar } from "@/components/calendar";
import type { CalendarData } from "@/types/calendar";

function MyCalendar() {
  const calendarData: CalendarData = {
    events: [
      {
        id: "1",
        title: "Team Meeting",
        startDate: new Date(2024, 0, 15, 10, 0),
        endDate: new Date(2024, 0, 15, 11, 0),
        color: "#3b82f6",
      },
    ],
    timeSlotGroups: [
      {
        id: "morning",
        name: "Morning",
        startTime: "08:00",
        endTime: "12:00",
        intervalMinutes: 60,
      },
    ],
  };

  return (
    <Calendar
      data={calendarData}
      viewMode="month"
      selectedDate={new Date()}
      onViewModeChange={(mode) => console.log(mode)}
      onDateSelect={(date) => console.log(date)}
      onEventClick={(event) => console.log(event)}
    />
  );
}
```

## 📚 API Reference

### Calendar Props

| Prop               | Type                                    | Description                                     |
| ------------------ | --------------------------------------- | ----------------------------------------------- |
| `data`             | `CalendarData`                          | Calendar data (events, time slot groups)        |
| `viewMode`         | `ViewMode`                              | Current view: "year", "month", "week", or "day" |
| `selectedDate`     | `Date`                                  | Currently selected date                         |
| `onViewModeChange` | `(mode: ViewMode) => void`              | Callback when view changes                      |
| `onDateSelect`     | `(date: Date) => void`                  | Callback when date is selected                  |
| `onEventClick`     | `(occurrence: EventOccurrence) => void` | Callback when event is clicked                  |
| `className`        | `string`                                | Optional CSS class                              |

### CalendarData Type

```typescript
interface CalendarData {
  events: CalendarEvent[];
  timeSlotGroups: TimeSlotGroup[];
  currentDate?: Date;
}
```

### CalendarEvent Type

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  recurrence?: RecurrenceRule;
  timeSlotGroupId?: string;
  color?: string;
  allDay?: boolean;
  metadata?: Record<string, unknown>;
}
```

## 🔁 Recurrence Patterns

The calendar supports sophisticated recurrence patterns:

### Daily Recurrence

```typescript
{
  frequency: "daily",
  interval: 1, // Every day
  endDate: new Date(2024, 11, 31),
}
```

### Weekly Recurrence

```typescript
{
  frequency: "weekly",
  interval: 2, // Every 2 weeks
  byWeekDay: [1, 3, 5], // Monday, Wednesday, Friday
  count: 10, // 10 occurrences
}
```

### Monthly Recurrence (by day)

```typescript
{
  frequency: "monthly",
  interval: 1,
  byMonthDay: 15, // 15th of each month
  endDate: new Date(2024, 11, 31),
}
```

### Monthly Recurrence (by week)

```typescript
{
  frequency: "monthly",
  interval: 1,
  byWeekOfMonth: 2, // Second week
  byWeekDay: [1], // Monday
  count: 12,
}
```

### Yearly Recurrence

```typescript
{
  frequency: "yearly",
  interval: 1,
  byMonth: 12, // December
  byMonthDay: 25, // 25th
}
```

## 🗂 Time Slot Groups

Time slot groups organize periods within a day:

```typescript
interface TimeSlotGroup {
  id: string;
  name: string;
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  intervalMinutes: number;
  color?: string;
  daysOfWeek?: DayOfWeek[]; // 0 = Sunday, 6 = Saturday
}
```

### Example

```typescript
{
  id: "morning",
  name: "Morning Session",
  startTime: "08:00",
  endTime: "12:00",
  intervalMinutes: 60,
  color: "#fbbf24",
  daysOfWeek: [1, 2, 3, 4, 5], // Weekdays only
}
```

## 🎨 Styling

The calendar uses Tailwind CSS and HeroUI theme tokens. Customize colors through:

1. **Event colors**: Set `color` property on events
2. **Time slot colors**: Set `color` property on time slot groups
3. **Theme**: Modify HeroUI theme configuration
4. **Custom classes**: Pass `className` prop

## 🌍 Internationalization

The calendar automatically uses your app's locale (English or Portuguese):

```typescript
import { useI18n } from "@/locales/client";

// All UI text is automatically translated
// Month names, weekday names, button labels, etc.
```

## 📱 Responsive Behavior

- **Desktop**: Full layout with all features
- **Tablet**: Optimized grid layouts, horizontal scroll in week view
- **Mobile**: Compact layout, simplified controls

## 🔧 Utilities

The calendar provides utility functions in `@/lib/calendar`:

### Date Utilities

- `startOfDay`, `endOfDay`, `startOfWeek`, etc.
- `addDays`, `addWeeks`, `addMonths`, `addYears`
- `isSameDay`, `isToday`, `isWithinRange`
- `formatTime`, `parseTime`

### Recurrence Utilities

- `calculateEventOccurrences` - Calculate occurrences for a single event
- `calculateAllOccurrences` - Calculate occurrences for multiple events
- `getOccurrencesForDay` - Get all occurrences on a specific day

### Time Slot Utilities

- `calculateTimeBoardConfig` - Generate time board configuration
- `generateTimeLabels` - Generate time labels for display
- `calculateEventColumns` - Calculate column layout for overlapping events
- `getCurrentTimePosition` - Get position for "now" indicator

## 🎯 Use Cases

The calendar is designed for various applications:

- **Schools**: Class schedules, recurring lessons
- **Clinics**: Appointment scheduling, recurring consultations
- **Coworking Spaces**: Room bookings, recurring events
- **Corporate**: Meeting scheduling, recurring team syncs
- **Personal**: Task planning, habit tracking

## 🚀 Demo

View the demo at `/calendar` route in your application.

## 📝 Notes

- The calendar only displays data; it doesn't persist changes
- All date calculations happen client-side for performance
- Recurrence is calculated only for the visible date range
- Maximum 10,000 iterations per recurring event (safety limit)

## 🤝 Contributing

When modifying the calendar:

1. Update types in `types/calendar.d.ts`
2. Update utilities in `lib/calendar/`
3. Update components in `components/calendar/`
4. Add translations to `locales/locales/en.ts` and `locales/locales/pt-BR.ts`
5. Test all view modes (year, month, week, day)
6. Test recurrence patterns
7. Test responsive layouts

## 📄 License

Part of the Next.js Template App project.
