/**
 * Performance monitoring and reporting utilities
 */

// ============================================================================
// Core Web Vitals Types
// ============================================================================

export interface WebVitalsMetric {
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

type WebVitalsCallback = (metric: WebVitalsMetric) => void;

// ============================================================================
// Web Vitals Thresholds
// ============================================================================

const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(
  name: WebVitalsMetric["name"],
  value: number
): WebVitalsMetric["rating"] {
  const threshold = thresholds[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

// ============================================================================
// Performance Observer Wrapper
// ============================================================================

class PerformanceMetrics {
  private observers: PerformanceObserver[] = [];
  private callbacks: WebVitalsCallback[] = [];

  /**
   * Subscribe to web vitals updates
   */
  subscribe(callback: WebVitalsCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  private notify(metric: WebVitalsMetric) {
    this.callbacks.forEach((callback) => callback(metric));
  }

  /**
   * Start observing performance metrics
   */
  start() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    // LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        if (lastEntry) {
          this.notify({
            name: "LCP",
            value: lastEntry.startTime,
            rating: getRating("LCP", lastEntry.startTime),
            delta: lastEntry.startTime,
            id: `lcp-${Date.now()}`,
          });
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      this.observers.push(lcpObserver);
    } catch {
      // LCP not supported
    }

    // FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((e) => e.name === "first-contentful-paint");
        if (fcpEntry) {
          this.notify({
            name: "FCP",
            value: fcpEntry.startTime,
            rating: getRating("FCP", fcpEntry.startTime),
            delta: fcpEntry.startTime,
            id: `fcp-${Date.now()}`,
          });
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });
      this.observers.push(fcpObserver);
    } catch {
      // FCP not supported
    }

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value;
            this.notify({
              name: "CLS",
              value: clsValue,
              rating: getRating("CLS", clsValue),
              delta: layoutShiftEntry.value,
              id: `cls-${Date.now()}`,
            });
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      this.observers.push(clsObserver);
    } catch {
      // CLS not supported
    }

    // FID (First Input Delay) / INP (Interaction to Next Paint)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as PerformanceEventTiming | undefined;
        if (firstEntry && firstEntry.processingStart) {
          const value = firstEntry.processingStart - firstEntry.startTime;
          this.notify({
            name: "FID",
            value,
            rating: getRating("FID", value),
            delta: value,
            id: `fid-${Date.now()}`,
          });
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });
      this.observers.push(fidObserver);
    } catch {
      // FID not supported
    }
  }

  /**
   * Stop observing and cleanup
   */
  stop() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMetrics = new PerformanceMetrics();

// ============================================================================
// Performance Timing Utilities
// ============================================================================

/**
 * Measure execution time of a function
 */
export function measureTime<T>(fn: () => T, label?: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (label && process.env.NODE_ENV === "development") {
    console.log(`⏱ ${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Measure execution time of an async function
 */
export async function measureTimeAsync<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (label && process.env.NODE_ENV === "development") {
    console.log(`⏱ ${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Create a performance marker
 */
export function mark(name: string) {
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure between two markers
 */
export function measureBetweenMarks(
  startMark: string,
  endMark: string,
  measureName?: string
): number | null {
  if (typeof performance !== "undefined" && performance.measure) {
    try {
      const measure = performance.measure(
        measureName || `${startMark}-to-${endMark}`,
        startMark,
        endMark
      );
      return measure.duration;
    } catch {
      return null;
    }
  }
  return null;
}

// ============================================================================
// Memory Utilities
// ============================================================================

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedMB: number;
  totalMB: number;
  limitMB: number;
  percentage: number;
}

/**
 * Get memory usage info (Chrome only)
 */
export function getMemoryInfo(): MemoryInfo | null {
  if (
    typeof performance !== "undefined" &&
    "memory" in performance
  ) {
    const memory = (performance as Performance & { memory: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    } }).memory;
    
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedMB: memory.usedJSHeapSize / (1024 * 1024),
      totalMB: memory.totalJSHeapSize / (1024 * 1024),
      limitMB: memory.jsHeapSizeLimit / (1024 * 1024),
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }
  return null;
}

// ============================================================================
// Resource Loading Utilities
// ============================================================================

interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  initiatorType: string;
}

/**
 * Get resource loading timings
 */
export function getResourceTimings(): ResourceTiming[] {
  if (typeof performance !== "undefined" && performance.getEntriesByType) {
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    
    return resources.map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      transferSize: resource.transferSize,
      encodedBodySize: resource.encodedBodySize,
      decodedBodySize: resource.decodedBodySize,
      initiatorType: resource.initiatorType,
    }));
  }
  return [];
}

/**
 * Get slow resources (above threshold)
 */
export function getSlowResources(thresholdMs = 1000): ResourceTiming[] {
  return getResourceTimings().filter(
    (resource) => resource.duration > thresholdMs
  );
}

// ============================================================================
// Long Task Detection
// ============================================================================

interface LongTask {
  duration: number;
  startTime: number;
}

const longTasks: LongTask[] = [];

/**
 * Start observing long tasks (>50ms)
 */
export function observeLongTasks(callback?: (task: LongTask) => void): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const task: LongTask = {
          duration: entry.duration,
          startTime: entry.startTime,
        };
        longTasks.push(task);
        callback?.(task);
      }
    });

    observer.observe({ type: "longtask", buffered: true });

    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

/**
 * Get all recorded long tasks
 */
export function getLongTasks(): LongTask[] {
  return [...longTasks];
}

// ============================================================================
// Frame Rate Monitoring
// ============================================================================

interface FrameRateResult {
  fps: number;
  frameTimes: number[];
  droppedFrames: number;
}

/**
 * Monitor frame rate for a duration
 */
export function monitorFrameRate(
  durationMs = 1000
): Promise<FrameRateResult> {
  return new Promise((resolve) => {
    const frameTimes: number[] = [];
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let droppedFrames = 0;
    const startTime = performance.now();

    function frame(currentTime: number) {
      frameCount++;
      const frameTime = currentTime - lastFrameTime;
      frameTimes.push(frameTime);
      
      // Count dropped frames (>16.67ms = below 60fps)
      if (frameTime > 16.67) {
        droppedFrames += Math.floor(frameTime / 16.67) - 1;
      }
      
      lastFrameTime = currentTime;

      if (currentTime - startTime < durationMs) {
        requestAnimationFrame(frame);
      } else {
        const fps = (frameCount / durationMs) * 1000;
        resolve({ fps, frameTimes, droppedFrames });
      }
    }

    requestAnimationFrame(frame);
  });
}
