"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";

// ============================================================================
// useMemoizedCallback - Stable callback with deps
// ============================================================================

/**
 * Like useCallback but with a ref to always have the latest callback
 * without causing re-renders
 */
export function useMemoizedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  // Always update ref to latest callback
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Return stable function that calls the latest callback
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}

// ============================================================================
// useThrottledCallback - Throttle function calls
// ============================================================================

export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      if (timeSinceLastCall >= delay) {
        lastCall.current = now;
        return savedCallback.current(...args);
      } else {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Schedule trailing call
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          savedCallback.current(...args);
        }, delay - timeSinceLastCall);
      }
    }) as T,
    [delay]
  );
}

// ============================================================================
// useRafCallback - Run callback on next animation frame
// ============================================================================

export function useRafCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const rafRef = useRef<number | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        savedCallback.current(...args);
      });
    }) as T,
    []
  );
}

// ============================================================================
// useIdleCallback - Run callback when browser is idle
// ============================================================================

interface IdleCallbackOptions {
  timeout?: number;
}

export function useIdleCallback(
  callback: () => void,
  options: IdleCallbackOptions = {}
): () => void {
  const { timeout = 1000 } = options;
  const idleRef = useRef<number | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    return () => {
      if (idleRef.current && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(
          idleRef.current
        );
      }
    };
  }, []);

  return useCallback(() => {
    if (idleRef.current && "cancelIdleCallback" in window) {
      (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(
        idleRef.current
      );
    }

    if ("requestIdleCallback" in window) {
      idleRef.current = (
        window as Window & {
          requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions
          ) => number;
        }
      ).requestIdleCallback(() => savedCallback.current(), { timeout });
    } else {
      // Fallback for Safari
      setTimeout(() => savedCallback.current(), timeout);
    }
  }, [timeout]);
}

// ============================================================================
// useDeferredValue - Defer expensive updates (polyfill for React 18)
// ============================================================================

export function useDeferredValuePolyfill<T>(value: T, delay = 300): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return deferredValue;
}

// ============================================================================
// useVirtualList - Virtual scrolling for large lists
// ============================================================================

interface VirtualListOptions {
  itemHeight: number;
  overscan?: number;
  containerHeight: number;
}

interface VirtualListResult<T> {
  virtualItems: Array<{ item: T; index: number; style: React.CSSProperties }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
}

export function useVirtualList<T>(
  items: T[],
  options: VirtualListOptions
): VirtualListResult<T> {
  const { itemHeight, overscan = 5, containerHeight } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = useMemo(() => {
    const result: VirtualListResult<T>["virtualItems"] = [];
    
    for (let i = startIndex; i < endIndex; i++) {
      result.push({
        item: items[i],
        index: i,
        style: {
          position: "absolute",
          top: i * itemHeight,
          height: itemHeight,
          width: "100%",
        },
      });
    }
    
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
  };
}

// ============================================================================
// useMeasure - Measure element dimensions
// ============================================================================

interface Dimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function useMeasure<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  Dimensions
] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const rect = entries[0].target.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        });
      }
    });

    observer.observe(element);

    // Initial measurement
    const rect = element.getBoundingClientRect();
    setDimensions({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    });

    return () => observer.disconnect();
  }, []);

  return [ref, dimensions];
}

// ============================================================================
// useImagePreload - Preload images
// ============================================================================

interface UseImagePreloadResult {
  isLoaded: boolean;
  isError: boolean;
  progress: number;
}

export function useImagePreload(urls: string[]): UseImagePreloadResult {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (urls.length === 0) return;

    setLoadedCount(0);
    setIsError(false);

    const images = urls.map((url) => {
      const img = new Image();
      img.src = url;

      img.onload = () => {
        setLoadedCount((prev) => prev + 1);
      };

      img.onerror = () => {
        setIsError(true);
      };

      return img;
    });

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  return {
    isLoaded: loadedCount === urls.length,
    isError,
    progress: urls.length > 0 ? (loadedCount / urls.length) * 100 : 100,
  };
}

// ============================================================================
// useIsomorphicLayoutEffect - SSR-safe layout effect
// ============================================================================

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? require("react").useLayoutEffect : useEffect;

// ============================================================================
// useMountedState - Track if component is mounted
// ============================================================================

export function useMountedState(): () => boolean {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
}

// ============================================================================
// useLatest - Always get latest value without re-renders
// ============================================================================

export function useLatest<T>(value: T): React.RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

// ============================================================================
// useSingleton - Create a singleton value
// ============================================================================

export function useSingleton<T>(factory: () => T): T {
  const ref = useRef<T | null>(null);
  
  if (ref.current === null) {
    ref.current = factory();
  }
  
  return ref.current;
}
