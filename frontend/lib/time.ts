/**
 * Format a timestamp to relative time string
 */
export function formatRelativeTime(timestamp: bigint | number): string {
  const time = typeof timestamp === "bigint" ? Number(timestamp) * 1000 : timestamp * 1000;
  const now = Date.now();
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks < 4) {
    return `${weeks}w ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return new Date(time).toLocaleDateString();
  }
}

/**
 * Format a date to full date string
 */
export function formatFullDate(timestamp: bigint | number): string {
  const time = typeof timestamp === "bigint" ? Number(timestamp) * 1000 : timestamp * 1000;
  return new Date(time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date to short format
 */
export function formatShortDate(timestamp: bigint | number): string {
  const time = typeof timestamp === "bigint" ? Number(timestamp) * 1000 : timestamp * 1000;
  return new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
