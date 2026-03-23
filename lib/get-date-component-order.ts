export type DateComponent = "day" | "month" | "year";

/**
 * Get the date component order (day, month, year) based on locale
 * Uses Intl.DateTimeFormat to determine the locale-specific date format
 * @param locale - The locale string (e.g., 'en-US', 'de-DE', 'ja-JP')
 * @returns Array of components in order: ['month', 'day', 'year']
 */
export function getDateComponentOrder(
  locale: string,
): (DateComponent)[] {
  const testDate = new Date(2024, 0, 15); // January 15, 2024

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = formatter.formatToParts(testDate);
  const componentOrder: (DateComponent)[] = [];

  for (const part of parts) {
    if (part.type === "year" && !componentOrder.includes("year")) {
      componentOrder.push("year");
    } else if (part.type === "month" && !componentOrder.includes("month")) {
      componentOrder.push("month");
    } else if (part.type === "day" && !componentOrder.includes("day")) {
      componentOrder.push("day");
    }
  }

  return componentOrder.length === 3
    ? componentOrder
    : ["day", "month", "year"];
}
