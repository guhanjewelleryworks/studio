// src/lib/date.ts

/**
 * Safely formats a date value, returning a placeholder if the value is invalid.
 * This prevents runtime errors from null, undefined, or malformed date strings.
 * @param value The date value to format (string, Date, null, or undefined).
 * @param locale The locale string for formatting (e.g., "en-IN", "en-US").
 * @returns A formatted date string or "—" if the date is invalid.
 */
export function safeFormatDate(
  value?: string | Date | null,
  locale: string = "en-IN"
): string {
  if (!value) return "—";

  try {
    const date = new Date(value);
    // isNaN(date.getTime()) is the most reliable way to check for an invalid date
    if (isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format for better readability
    });
  } catch (error) {
    // This is a fallback, though isNaN should catch most cases.
    console.error("Error formatting date:", value, error);
    return "—";
  }
}

/**
 * Safely formats a date value into a short date string (e.g., Jul 26, 2024).
 * @param value The date value to format.
 * @returns A formatted date string or "—" if the date is invalid.
 */
export function safeFormatShortDate(
  value?: string | Date | null,
  locale: string = "en-IN"
) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch (error) {
    return "—";
  }
}
