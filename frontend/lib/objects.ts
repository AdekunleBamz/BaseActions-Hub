/**
 * Object manipulation utilities
 */

// ============================================================================
// Object Access
// ============================================================================

/**
 * Get nested property safely
 */
export function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }
  
  return (result ?? defaultValue) as T;
}

/**
 * Set nested property
 */
export function set<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const result = { ...obj };
  let current: Record<string, unknown> = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    } else {
      current[key] = Array.isArray(current[key])
        ? [...(current[key] as unknown[])]
        : { ...(current[key] as Record<string, unknown>) };
    }
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Check if object has property
 */
export function has(obj: Record<string, unknown>, path: string): boolean {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return false;
    }
    if (!(key in (current as Record<string, unknown>))) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return true;
}

// ============================================================================
// Object Transformation
// ============================================================================

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

/**
 * Map object values
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = fn(value, key);
  });
  return result;
}

/**
 * Map object keys
 */
export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string, value: T) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  Object.entries(obj).forEach(([key, value]) => {
    result[fn(key, value)] = value;
  });
  return result;
}

/**
 * Filter object by predicate
 */
export function filterObject<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (predicate(value, key)) {
      result[key] = value;
    }
  });
  return result;
}

/**
 * Remove undefined/null values
 */
export function compactObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return filterObject(obj, (value) => value != null) as Partial<T>;
}

/**
 * Invert object keys and values
 */
export function invert(obj: Record<string, string | number>): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(obj).forEach(([key, value]) => {
    result[String(value)] = key;
  });
  return result;
}

// ============================================================================
// Object Merging
// ============================================================================

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T>>
): T {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        if (isPlainObject(sourceValue)) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          deepMerge(
            target[key] as Record<string, unknown>,
            sourceValue as Record<string, unknown>
          );
        } else {
          Object.assign(target, { [key]: sourceValue });
        }
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

/**
 * Shallow merge with defaults
 */
export function defaults<T extends Record<string, unknown>>(
  obj: Partial<T>,
  ...sources: Array<Partial<T>>
): T {
  const result = { ...obj } as T;
  
  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      if (result[key as keyof T] === undefined) {
        result[key as keyof T] = source[key as keyof T] as T[keyof T];
      }
    });
  });
  
  return result;
}

// ============================================================================
// Object Comparison
// ============================================================================

/**
 * Deep equality check
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }
  
  return false;
}

/**
 * Get difference between objects
 */
export function diff<T extends Record<string, unknown>>(
  obj1: T,
  obj2: T
): Partial<T> {
  const result: Partial<T> = {};
  
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  allKeys.forEach((key) => {
    if (!isEqual(obj1[key as keyof T], obj2[key as keyof T])) {
      result[key as keyof T] = obj2[key as keyof T];
    }
  });
  
  return result;
}

// ============================================================================
// Object Cloning
// ============================================================================

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Map) {
    const mapClone = new Map();
    obj.forEach((value, key) => {
      mapClone.set(key, deepClone(value));
    });
    return mapClone as T;
  }
  
  if (obj instanceof Set) {
    const setClone = new Set();
    obj.forEach((value) => {
      setClone.add(deepClone(value));
    });
    return setClone as T;
  }
  
  const cloned = {} as T;
  Object.keys(obj).forEach((key) => {
    cloned[key as keyof T] = deepClone((obj as Record<string, unknown>)[key] as T[keyof T]);
  });
  
  return cloned;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is not empty
 */
export function isNotEmpty<T>(value: T | null | undefined | "" | []): value is T {
  return !isEmpty(value);
}

// ============================================================================
// Object Entries
// ============================================================================

/**
 * Typed Object.keys
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Typed Object.values
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

/**
 * Typed Object.entries
 */
export function entries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Create object from entries
 */
export function fromEntries<K extends string, V>(
  entries: Array<[K, V]>
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

// ============================================================================
// Freeze Utilities
// ============================================================================

/**
 * Deep freeze object
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach((key) => {
    const value = (obj as Record<string, unknown>)[key];
    if (value && typeof value === "object") {
      deepFreeze(value as object);
    }
  });
  return Object.freeze(obj);
}

/**
 * Create readonly object
 */
export function readonly<T extends object>(obj: T): Readonly<T> {
  return Object.freeze({ ...obj });
}
