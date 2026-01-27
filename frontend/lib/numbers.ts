/**
 * Number formatting and math utilities
 */

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with commas
 */
export function formatNumber(num: number, locale = "en-US"): string {
  return num.toLocaleString(locale);
}

/**
 * Format as currency
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format as percentage
 */
export function formatPercent(
  value: number,
  decimals = 0,
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format with fixed decimals
 */
export function formatDecimals(num: number, decimals = 2): string {
  return num.toFixed(decimals);
}

/**
 * Format compact number (1K, 1M, etc.)
 */
export function formatCompact(num: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  return formatBytes(bytes);
}

/**
 * Format ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// ============================================================================
// Parsing
// ============================================================================

/**
 * Parse number safely
 */
export function parseNumber(value: string | number): number | null {
  if (typeof value === "number") return isNaN(value) ? null : value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse integer safely
 */
export function parseInt(value: string | number, radix = 10): number | null {
  if (typeof value === "number") return Math.floor(value);
  const parsed = Number.parseInt(value, radix);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse with default value
 */
export function parseNumberOr(value: string | number, defaultValue: number): number {
  const parsed = parseNumber(value);
  return parsed ?? defaultValue;
}

// ============================================================================
// Math Utilities
// ============================================================================

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Round to nearest multiple
 */
export function roundTo(num: number, multiple: number): number {
  return Math.round(num / multiple) * multiple;
}

/**
 * Round to decimal places
 */
export function roundDecimals(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Floor to decimal places
 */
export function floorDecimals(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

/**
 * Ceil to decimal places
 */
export function ceilDecimals(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Inverse linear interpolation
 */
export function inverseLerp(start: number, end: number, value: number): number {
  return (value - start) / (end - start);
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  const t = inverseLerp(fromMin, fromMax, value);
  return lerp(toMin, toMax, t);
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Get value as fraction of total
 */
export function fraction(value: number, total: number): number {
  if (total === 0) return 0;
  return value / total;
}

// ============================================================================
// Random Numbers
// ============================================================================

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Random boolean with probability
 */
export function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Random gaussian (normal) distribution
 */
export function randomGaussian(mean = 0, stdDev = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

// ============================================================================
// Number Checks
// ============================================================================

/**
 * Check if number is even
 */
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

/**
 * Check if number is odd
 */
export function isOdd(num: number): boolean {
  return num % 2 !== 0;
}

/**
 * Check if number is positive
 */
export function isPositive(num: number): boolean {
  return num > 0;
}

/**
 * Check if number is negative
 */
export function isNegative(num: number): boolean {
  return num < 0;
}

/**
 * Check if value is a valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Check if number is integer
 */
export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

/**
 * Check if number is between min and max
 */
export function isBetween(num: number, min: number, max: number, inclusive = true): boolean {
  return inclusive ? num >= min && num <= max : num > min && num < max;
}

/**
 * Check if numbers are approximately equal
 */
export function isApproxEqual(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

// ============================================================================
// Conversion
// ============================================================================

/**
 * Degrees to radians
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Radians to degrees
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Convert to safe integer
 */
export function toSafeInteger(num: number): number {
  if (num >= Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER;
  if (num <= Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER;
  return Math.trunc(num);
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Calculate mean
 */
export function mean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Calculate median
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate mode
 */
export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  
  const counts = new Map<number, number>();
  let maxCount = 0;
  
  numbers.forEach((num) => {
    const count = (counts.get(num) || 0) + 1;
    counts.set(num, count);
    maxCount = Math.max(maxCount, count);
  });
  
  const modes: number[] = [];
  counts.forEach((count, num) => {
    if (count === maxCount) {
      modes.push(num);
    }
  });
  
  return modes;
}

/**
 * Calculate variance
 */
export function variance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = mean(numbers);
  return mean(numbers.map((n) => Math.pow(n - avg, 2)));
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  return Math.sqrt(variance(numbers));
}

// ============================================================================
// Precision Handling
// ============================================================================

/**
 * Add with precision (avoid floating point errors)
 */
export function preciseAdd(a: number, b: number): number {
  const precision = Math.max(
    getPrecision(a),
    getPrecision(b)
  );
  const factor = Math.pow(10, precision);
  return Math.round(a * factor + b * factor) / factor;
}

/**
 * Subtract with precision
 */
export function preciseSubtract(a: number, b: number): number {
  return preciseAdd(a, -b);
}

/**
 * Multiply with precision
 */
export function preciseMultiply(a: number, b: number): number {
  const precision = getPrecision(a) + getPrecision(b);
  const factor = Math.pow(10, precision);
  return Math.round(a * b * factor) / factor;
}

/**
 * Divide with precision
 */
export function preciseDivide(a: number, b: number, precision = 10): number {
  if (b === 0) throw new Error("Division by zero");
  const factor = Math.pow(10, precision);
  return Math.round((a / b) * factor) / factor;
}

/**
 * Get decimal precision of number
 */
function getPrecision(num: number): number {
  const str = num.toString();
  const decimalIndex = str.indexOf(".");
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}
