/**
 * Date and time formatting utilities
 */

// ============================================================================
// Relative Time
// ============================================================================

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | number | string): string {
  const timestamp = new Date(date).getTime();
  const now = Date.now();
  const diff = now - timestamp;
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  const suffix = isFuture ? "from now" : "ago";

  if (absDiff < MINUTE) {
    return "just now";
  }
  if (absDiff < HOUR) {
    const mins = Math.floor(absDiff / MINUTE);
    return `${mins} ${mins === 1 ? "minute" : "minutes"} ${suffix}`;
  }
  if (absDiff < DAY) {
    const hours = Math.floor(absDiff / HOUR);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${suffix}`;
  }
  if (absDiff < WEEK) {
    const days = Math.floor(absDiff / DAY);
    return `${days} ${days === 1 ? "day" : "days"} ${suffix}`;
  }
  if (absDiff < MONTH) {
    const weeks = Math.floor(absDiff / WEEK);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ${suffix}`;
  }
  if (absDiff < YEAR) {
    const months = Math.floor(absDiff / MONTH);
    return `${months} ${months === 1 ? "month" : "months"} ${suffix}`;
  }

  const years = Math.floor(absDiff / YEAR);
  return `${years} ${years === 1 ? "year" : "years"} ${suffix}`;
}

/**
 * Format a date as short relative time (e.g., "2h")
 */
export function formatRelativeTimeShort(date: Date | number | string): string {
  const timestamp = new Date(date).getTime();
  const now = Date.now();
  const diff = Math.abs(now - timestamp);

  if (diff < MINUTE) return "now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d`;
  if (diff < MONTH) return `${Math.floor(diff / WEEK)}w`;
  if (diff < YEAR) return `${Math.floor(diff / MONTH)}mo`;
  return `${Math.floor(diff / YEAR)}y`;
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date as "Jan 15, 2024"
 */
export function formatDate(date: Date | number | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date as "January 15, 2024"
 */
export function formatDateLong(date: Date | number | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date as "01/15/2024"
 */
export function formatDateNumeric(date: Date | number | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

/**
 * Format date as "2024-01-15"
 */
export function formatDateISO(date: Date | number | string): string {
  return new Date(date).toISOString().split("T")[0];
}

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Format time as "2:30 PM"
 */
export function formatTime(date: Date | number | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format time as "14:30"
 */
export function formatTime24h(date: Date | number | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Format date and time as "Jan 15, 2024 at 2:30 PM"
 */
export function formatDateTime(date: Date | number | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// ============================================================================
// Duration Formatting
// ============================================================================

/**
 * Format milliseconds as "1h 30m 45s"
 */
export function formatDuration(ms: number): string {
  if (ms < SECOND) return "< 1s";

  const parts: string[] = [];

  const hours = Math.floor(ms / HOUR);
  if (hours > 0) {
    parts.push(`${hours}h`);
    ms %= HOUR;
  }

  const minutes = Math.floor(ms / MINUTE);
  if (minutes > 0) {
    parts.push(`${minutes}m`);
    ms %= MINUTE;
  }

  const seconds = Math.floor(ms / SECOND);
  if (seconds > 0 && parts.length < 2) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ") || "0s";
}

/**
 * Format seconds as "01:30:45"
 */
export function formatDurationClock(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ============================================================================
// Date Comparison
// ============================================================================

/**
 * Check if date is today
 */
export function isToday(date: Date | number | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | number | string): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is within the last N days
 */
export function isWithinDays(date: Date | number | string, days: number): boolean {
  const d = new Date(date);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | number | string): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | number | string): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ============================================================================
// Smart Date Display
// ============================================================================

/**
 * Smart date display based on proximity
 * - Today: "2:30 PM"
 * - Yesterday: "Yesterday at 2:30 PM"
 * - This week: "Monday at 2:30 PM"
 * - This year: "Jan 15 at 2:30 PM"
 * - Older: "Jan 15, 2023"
 */
export function formatSmartDate(date: Date | number | string): string {
  const d = new Date(date);
  const now = new Date();

  if (isToday(d)) {
    return formatTime(d);
  }

  if (isYesterday(d)) {
    return `Yesterday at ${formatTime(d)}`;
  }

  if (isWithinDays(d, 7)) {
    const day = d.toLocaleDateString("en-US", { weekday: "long" });
    return `${day} at ${formatTime(d)}`;
  }

  if (d.getFullYear() === now.getFullYear()) {
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${monthDay} at ${formatTime(d)}`;
  }

  return formatDate(d);
}
