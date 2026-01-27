/**
 * Array and collection utilities
 */

// ============================================================================
// Array Manipulation
// ============================================================================

/**
 * Remove duplicates from array
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(arr: T[], key: keyof T | ((item: T) => unknown)): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const k = typeof key === "function" ? key(item) : item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.flat() as T[];
}

/**
 * Deep flatten nested arrays
 */
export function flattenDeep<T>(arr: unknown[]): T[] {
  return arr.flat(Infinity) as T[];
}

/**
 * Get random element from array
 */
export function sample<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random elements from array
 */
export function sampleMany<T>(arr: T[], count: number): T[] {
  const shuffled = shuffle([...arr]);
  return shuffled.slice(0, count);
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get first N elements
 */
export function take<T>(arr: T[], count: number): T[] {
  return arr.slice(0, count);
}

/**
 * Get last N elements
 */
export function takeLast<T>(arr: T[], count: number): T[] {
  return arr.slice(-count);
}

/**
 * Get first element
 */
export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

/**
 * Get last element
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * Compact array (remove falsy values)
 */
export function compact<T>(arr: (T | null | undefined | false | 0 | "")[]): T[] {
  return arr.filter(Boolean) as T[];
}

/**
 * Get difference between arrays
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set = new Set(arr2);
  return arr1.filter((item) => !set.has(item));
}

/**
 * Get intersection of arrays
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set = new Set(arr2);
  return arr1.filter((item) => set.has(item));
}

/**
 * Get union of arrays
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

// ============================================================================
// Array Sorting
// ============================================================================

/**
 * Sort by key
 */
export function sortBy<T>(arr: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Sort by multiple keys
 */
export function sortByMultiple<T>(
  arr: T[],
  keys: Array<{ key: keyof T; order?: "asc" | "desc" }>
): T[] {
  return [...arr].sort((a, b) => {
    for (const { key, order = "asc" } of keys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}

// ============================================================================
// Array Grouping
// ============================================================================

/**
 * Group by key
 */
export function groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const k = typeof key === "function" ? key(item) : String(item[key]);
    if (!groups[k]) {
      groups[k] = [];
    }
    groups[k].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Create lookup map by key
 */
export function keyBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T> {
  return arr.reduce((map, item) => {
    const k = typeof key === "function" ? key(item) : String(item[key]);
    map[k] = item;
    return map;
  }, {} as Record<string, T>);
}

/**
 * Count occurrences
 */
export function countBy<T>(arr: T[], key?: keyof T | ((item: T) => string)): Record<string, number> {
  return arr.reduce((counts, item) => {
    const k = key
      ? typeof key === "function"
        ? key(item)
        : String(item[key])
      : String(item);
    counts[k] = (counts[k] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

/**
 * Partition array by predicate
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  
  arr.forEach((item) => {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });
  
  return [pass, fail];
}

// ============================================================================
// Array Search
// ============================================================================

/**
 * Find item by key value
 */
export function findBy<T>(arr: T[], key: keyof T, value: unknown): T | undefined {
  return arr.find((item) => item[key] === value);
}

/**
 * Find index by key value
 */
export function findIndexBy<T>(arr: T[], key: keyof T, value: unknown): number {
  return arr.findIndex((item) => item[key] === value);
}

/**
 * Check if array includes by key
 */
export function includesBy<T>(arr: T[], key: keyof T, value: unknown): boolean {
  return arr.some((item) => item[key] === value);
}

// ============================================================================
// Array Math
// ============================================================================

/**
 * Sum array of numbers
 */
export function sum(arr: number[]): number {
  return arr.reduce((total, n) => total + n, 0);
}

/**
 * Sum by key
 */
export function sumBy<T>(arr: T[], key: keyof T | ((item: T) => number)): number {
  return arr.reduce((total, item) => {
    const value = typeof key === "function" ? key(item) : Number(item[key]);
    return total + value;
  }, 0);
}

/**
 * Average of array
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * Min value
 */
export function min(arr: number[]): number | undefined {
  if (arr.length === 0) return undefined;
  return Math.min(...arr);
}

/**
 * Max value
 */
export function max(arr: number[]): number | undefined {
  if (arr.length === 0) return undefined;
  return Math.max(...arr);
}

/**
 * Min by key
 */
export function minBy<T>(arr: T[], key: keyof T | ((item: T) => number)): T | undefined {
  if (arr.length === 0) return undefined;
  
  return arr.reduce((minItem, item) => {
    const currentValue = typeof key === "function" ? key(item) : Number(item[key]);
    const minValue = typeof key === "function" ? key(minItem) : Number(minItem[key]);
    return currentValue < minValue ? item : minItem;
  });
}

/**
 * Max by key
 */
export function maxBy<T>(arr: T[], key: keyof T | ((item: T) => number)): T | undefined {
  if (arr.length === 0) return undefined;
  
  return arr.reduce((maxItem, item) => {
    const currentValue = typeof key === "function" ? key(item) : Number(item[key]);
    const maxValue = typeof key === "function" ? key(maxItem) : Number(maxItem[key]);
    return currentValue > maxValue ? item : maxItem;
  });
}

// ============================================================================
// Range Utilities
// ============================================================================

/**
 * Create range of numbers
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Create inclusive range
 */
export function rangeInclusive(start: number, end: number, step = 1): number[] {
  return range(start, end + 1, step);
}
