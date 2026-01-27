/**
 * Async utilities and helpers
 */

// ============================================================================
// Delay & Timing
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Delay execution
 */
export const delay = sleep;

/**
 * Timeout promise
 */
export function timeout<T>(promise: Promise<T>, ms: number, message = "Operation timed out"): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Wait for condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout: timeoutMs = 5000, interval = 100 } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) return;
    await sleep(interval);
  }
  
  throw new Error("Condition not met within timeout");
}

/**
 * Wait until element exists
 */
export async function waitForElement(
  selector: string,
  options: { timeout?: number; interval?: number } = {}
): Promise<Element> {
  await waitFor(
    () => document.querySelector(selector) !== null,
    options
  );
  return document.querySelector(selector)!;
}

// ============================================================================
// Retry Logic
// ============================================================================

export interface RetryOptions {
  attempts?: number;
  delay?: number;
  backoff?: "linear" | "exponential";
  maxDelay?: number;
  onRetry?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retry async function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    attempts = 3,
    delay: initialDelay = 1000,
    backoff = "exponential",
    maxDelay = 30000,
    onRetry,
    shouldRetry = () => true,
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === attempts || !shouldRetry(lastError)) {
        throw lastError;
      }
      
      onRetry?.(lastError, attempt);
      
      let delayMs = initialDelay;
      if (backoff === "exponential") {
        delayMs = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
      } else if (backoff === "linear") {
        delayMs = Math.min(initialDelay * attempt, maxDelay);
      }
      
      await sleep(delayMs);
    }
  }
  
  throw lastError!;
}

/**
 * Retry with abort controller
 */
export async function retryWithAbort<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const controller = new AbortController();
  
  try {
    return await retry(() => fn(controller.signal), options);
  } catch (error) {
    controller.abort();
    throw error;
  }
}

// ============================================================================
// Concurrency Control
// ============================================================================

/**
 * Run promises in parallel with limit
 */
export async function parallelLimit<T>(
  tasks: Array<() => Promise<T>>,
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const task of tasks) {
    const promise = Promise.resolve().then(async () => {
      const result = await task();
      results.push(result);
    });
    
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }
  
  await Promise.all(executing);
  return results;
}

/**
 * Run promises in sequence
 */
export async function sequence<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
  const results: T[] = [];
  
  for (const task of tasks) {
    results.push(await task());
  }
  
  return results;
}

/**
 * Run promises in parallel and collect all results (even failures)
 */
export async function settleAll<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown }>> {
  return Promise.allSettled(promises);
}

/**
 * Run multiple promises and return first successful
 */
export async function any<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.any(promises);
}

// ============================================================================
// Debounce & Throttle (Promise-based)
// ============================================================================

/**
 * Debounced async function
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let pendingResolve: ((value: unknown) => void) | undefined;
  let pendingReject: ((error: unknown) => void) | undefined;
  
  const debounced = ((...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        pendingResolve?.(undefined);
      }
      
      pendingResolve = resolve;
      pendingReject = reject;
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      pendingReject?.(new Error("Cancelled"));
    }
  };
  
  return debounced;
}

/**
 * Throttled async function
 */
export function throttleAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  limit: number
): T {
  let lastRun = 0;
  let pending: Promise<unknown> | null = null;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastRun >= limit) {
      lastRun = now;
      return fn(...args);
    }
    
    if (!pending) {
      pending = new Promise((resolve) => {
        const remaining = limit - (now - lastRun);
        setTimeout(async () => {
          lastRun = Date.now();
          pending = null;
          resolve(fn(...args));
        }, remaining);
      });
    }
    
    return pending;
  }) as T;
}

// ============================================================================
// Caching
// ============================================================================

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

/**
 * Memoize async function with TTL
 */
export function memoizeAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: CacheOptions = {}
): T & { clear: () => void; delete: (key: string) => void } {
  const { ttl = Infinity, maxSize = 100 } = options;
  const cache = new Map<string, { value: unknown; timestamp: number }>();
  
  const memoized = (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    const cached = cache.get(key);
    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }
    
    const result = await fn(...args);
    
    // Evict oldest if at capacity
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
    
    cache.set(key, { value: result, timestamp: now });
    return result;
  }) as T & { clear: () => void; delete: (key: string) => void };
  
  memoized.clear = () => cache.clear();
  memoized.delete = (key: string) => cache.delete(key);
  
  return memoized;
}

// ============================================================================
// Polling
// ============================================================================

export interface PollOptions {
  interval: number;
  timeout?: number;
  immediate?: boolean;
}

/**
 * Poll until condition is met
 */
export async function poll<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: PollOptions
): Promise<T> {
  const { interval, timeout: timeoutMs, immediate = true } = options;
  const startTime = Date.now();
  
  if (immediate) {
    const result = await fn();
    if (condition(result)) return result;
  }
  
  while (true) {
    if (timeoutMs && Date.now() - startTime > timeoutMs) {
      throw new Error("Polling timed out");
    }
    
    await sleep(interval);
    const result = await fn();
    if (condition(result)) return result;
  }
}

/**
 * Create a polling controller
 */
export function createPoll<T>(
  fn: () => Promise<T>,
  options: PollOptions
): {
  start: (callback: (result: T) => void) => void;
  stop: () => void;
  isRunning: () => boolean;
} {
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let running = false;
  
  return {
    start(callback) {
      if (running) return;
      running = true;
      
      if (options.immediate) {
        fn().then(callback).catch(console.error);
      }
      
      intervalId = setInterval(() => {
        fn().then(callback).catch(console.error);
      }, options.interval);
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
      running = false;
    },
    isRunning() {
      return running;
    },
  };
}

// ============================================================================
// Queue
// ============================================================================

/**
 * Async queue with concurrency limit
 */
export class AsyncQueue<T = unknown> {
  private queue: Array<() => Promise<T>> = [];
  private running = 0;
  private concurrency: number;
  
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
  }
  
  add(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });
      this.process();
    });
  }
  
  private async process() {
    if (this.running >= this.concurrency) return;
    
    const task = this.queue.shift();
    if (!task) return;
    
    this.running++;
    
    try {
      await task();
    } finally {
      this.running--;
      this.process();
    }
  }
  
  get size(): number {
    return this.queue.length;
  }
  
  get pending(): number {
    return this.running;
  }
  
  clear(): void {
    this.queue = [];
  }
}

// ============================================================================
// Deferred Promise
// ============================================================================

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

/**
 * Create deferred promise
 */
export function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return { promise, resolve, reject };
}

// ============================================================================
// Mutex / Lock
// ============================================================================

/**
 * Simple mutex for async operations
 */
export class Mutex {
  private locked = false;
  private queue: Array<() => void> = [];
  
  async acquire(): Promise<() => void> {
    while (this.locked) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }
    
    this.locked = true;
    
    return () => {
      this.locked = false;
      const next = this.queue.shift();
      if (next) next();
    };
  }
  
  async run<T>(fn: () => Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }
  
  isLocked(): boolean {
    return this.locked;
  }
}
