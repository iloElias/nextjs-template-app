# Month View Components

This directory contains organized calendar-related components for the month view. Each component is now in its own file for better maintainability and modularity.

## Components

### Core Display

- **MonthView** (`month-view.tsx`) - Main calendar table display showing the month grid with day buttons

### Navigation

- **MonthNavButton** (`month-nav-button.tsx`) - Previous/Next navigation button component
- **MonthViewNavigation** (`month-view-navigation.tsx`) - Composite component combining all navigation elements

### Selectors

- **DaySelect** (`day-select.tsx`) - Dropdown to select days of the month
- **MonthSelect** (`month-select.tsx`) - Dropdown to select month (January-December)
- **YearInput** (`year-input.tsx`) - Comprehensive year selector with scrollable range

### Pickers

- **MonthAndYearPicker** (`month-and-year-picker.tsx`) - Full featured picker with popover showing HeroUI Calendar. Supports showing month, year, or both pickers via `hideMonthPicker` and `hideYearPicker` props.
- **MonthPicker** (`month-picker.tsx`) - Convenience wrapper for month-only selection
- **YearPicker** (`year-picker.tsx`) - Convenience wrapper for year-only selection

## Usage

Import components directly from the calendar package:

```typescript
import {
  MonthView,
  MonthNavButton,
  DaySelect,
  MonthAndYearPicker,
  MonthPicker,
  YearPicker,
  MonthViewNavigation
} from "@/components/calendar";
```

Or use the composite navigation component:

```typescript
import { MonthViewNavigation } from "@/components/calendar";

export function MyCalendar() {
  return (
    <>
      <MonthViewNavigation />
      <MonthView />
    </>
  );
}
```

## Architecture Notes

- All components use the `useCalendar()` hook for shared state management
- Date arithmetic is handled safely in the `Calendar` context to prevent month rollover issues
- Components are internationalized using `useSafeI18n()` for multi-language support
- HeroUI components are used for consistent styling
