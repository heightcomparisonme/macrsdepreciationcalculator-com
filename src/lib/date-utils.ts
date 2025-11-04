/**
 * Date utility functions for handling date conversion and formatting
 */

/**
 * Safely convert a value to a Date object
 * Handles both Date objects and ISO date strings
 * 
 * @param value - Date object or ISO date string
 * @returns Date object
 */
export function toDate(value: Date | string | number): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  
  throw new Error(`Cannot convert value to Date: ${value}`);
}

/**
 * Format a date/time value to a localized time string
 * 
 * @param value - Date object or ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted time string
 */
export function formatTime(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  const date = toDate(value);
  return date.toLocaleTimeString([], options);
}

/**
 * Format a date value to a localized date string
 * 
 * @param value - Date object or ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  }
): string {
  const date = toDate(value);
  return date.toLocaleDateString([], options);
}

/**
 * Format a date value to a localized weekday string
 * 
 * @param value - Date object or ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted weekday string
 */
export function formatWeekday(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { weekday: "short" }
): string {
  const date = toDate(value);
  return date.toLocaleDateString([], options);
}

/**
 * Get day of month from a date value
 * 
 * @param value - Date object or ISO date string
 * @returns Day of month (1-31)
 */
export function getDayOfMonth(value: Date | string | number): number {
  const date = toDate(value);
  return date.getDate();
}

/**
 * Get month from a date value
 * 
 * @param value - Date object or ISO date string
 * @returns Month (0-11)
 */
export function getMonth(value: Date | string | number): number {
  const date = toDate(value);
  return date.getMonth();
}

/**
 * Get year from a date value
 * 
 * @param value - Date object or ISO date string
 * @returns Year
 */
export function getYear(value: Date | string | number): number {
  const date = toDate(value);
  return date.getFullYear();
}
