/**
 * String manipulation utilities
 */

// ============================================================================
// Case Conversion
// ============================================================================

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Convert string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Convert string to CONSTANT_CASE
 */
export function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

/**
 * Convert string to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-_])\w/g, (c) => c.toUpperCase())
    .replace(/[-_]/g, " ");
}

/**
 * Convert string to Sentence case
 */
export function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================================================
// String Manipulation
// ============================================================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number, suffix = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length).trimEnd() + suffix;
}

/**
 * Truncate string in the middle
 */
export function truncateMiddle(str: string, maxLength: number, separator = "..."): string {
  if (str.length <= maxLength) return str;
  
  const separatorLength = separator.length;
  const charsToShow = maxLength - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  
  return str.slice(0, frontChars) + separator + str.slice(-backChars);
}

/**
 * Pad string on the left
 */
export function padLeft(str: string, length: number, char = " "): string {
  return str.padStart(length, char);
}

/**
 * Pad string on the right
 */
export function padRight(str: string, length: number, char = " "): string {
  return str.padEnd(length, char);
}

/**
 * Remove extra whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

/**
 * Remove all whitespace
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, "");
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Lowercase first letter
 */
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// ============================================================================
// String Checking
// ============================================================================

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Check if string contains only alphanumeric characters
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if string contains only letters
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

/**
 * Check if string is a valid email
 */
export function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

/**
 * Check if string is a valid URL
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// String Generation
// ============================================================================

/**
 * Generate a random string
 */
export function randomString(length: number, charset?: string): string {
  const chars = charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a UUID v4
 */
export function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a short ID
 */
export function shortId(length = 8): string {
  return randomString(length, "abcdefghijklmnopqrstuvwxyz0123456789");
}

// ============================================================================
// String Parsing
// ============================================================================

/**
 * Parse query string to object
 */
export function parseQueryString(query: string): Record<string, string> {
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Convert object to query string
 */
export function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * Extract hashtags from string
 */
export function extractHashtags(str: string): string[] {
  const matches = str.match(/#\w+/g);
  return matches ? matches.map((tag) => tag.slice(1)) : [];
}

/**
 * Extract mentions from string
 */
export function extractMentions(str: string): string[] {
  const matches = str.match(/@\w+/g);
  return matches ? matches.map((mention) => mention.slice(1)) : [];
}

/**
 * Extract URLs from string
 */
export function extractUrls(str: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return str.match(urlRegex) || [];
}

// ============================================================================
// Text Processing
// ============================================================================

/**
 * Count words in string
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count characters (excluding spaces)
 */
export function charCount(str: string, includeSpaces = false): number {
  return includeSpaces ? str.length : str.replace(/\s/g, "").length;
}

/**
 * Slugify string for URLs
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Unescape HTML special characters
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => htmlUnescapes[entity]);
}
