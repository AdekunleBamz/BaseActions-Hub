'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualListResult<T> {
  virtualItems: Array<{ item: T; index: number; style: React.CSSProperties }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  scrollTo: (index: number) => void;
  containerProps: {
    onScroll: (e: React.UIEvent<HTMLElement>) => void;
    style: React.CSSProperties;
    ref: React.RefObject<HTMLDivElement | null>;
  };
  innerProps: {
    style: React.CSSProperties;
  };
}

export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualListOptions<T>): VirtualListResult<T> {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const virtualItems = useMemo(() => {
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        item: items[i],
        index: i,
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  const onScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const scrollTo = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    scrollTo,
    containerProps: {
      onScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      },
      ref: containerRef,
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: 'relative',
      },
    },
  };
}

// Optimistic Updates Hook
interface UseOptimisticOptions<T, A> {
  data: T;
  onMutate: (data: T, action: A) => T;
  onError?: (error: Error, previousData: T) => void;
}

interface OptimisticResult<T, A> {
  data: T;
  mutate: (action: A, asyncFn: () => Promise<void>) => Promise<void>;
  isPending: boolean;
}

export function useOptimistic<T, A>({
  data: serverData,
  onMutate,
  onError,
}: UseOptimisticOptions<T, A>): OptimisticResult<T, A> {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);

  const currentData = optimisticData ?? serverData;

  const mutate = useCallback(
    async (action: A, asyncFn: () => Promise<void>) => {
      const previousData = currentData;
      const newData = onMutate(currentData, action);

      setOptimisticData(newData);
      setIsPending(true);

      try {
        await asyncFn();
        // On success, clear optimistic data to use server data
        setOptimisticData(null);
      } catch (error) {
        // On error, rollback to previous state
        setOptimisticData(previousData);
        onError?.(error as Error, previousData);
      } finally {
        setIsPending(false);
      }
    },
    [currentData, onMutate, onError]
  );

  // Sync with server data when it changes
  useEffect(() => {
    if (!isPending) {
      setOptimisticData(null);
    }
  }, [serverData, isPending]);

  return {
    data: currentData,
    mutate,
    isPending,
  };
}

// Undo/Redo Hook
interface UseUndoRedoResult<T> {
  state: T;
  setState: (value: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  history: T[];
}

export function useUndoRedo<T>(initialState: T, maxHistory = 50): UseUndoRedoResult<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback(
    (value: T) => {
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(value);

      if (newHistory.length > maxHistory) {
        newHistory.shift();
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
      } else {
        setHistory(newHistory);
        setCurrentIndex(currentIndex + 1);
      }
    },
    [history, currentIndex, maxHistory]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const clear = useCallback(() => {
    setHistory([state]);
    setCurrentIndex(0);
  }, [state]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clear,
    history,
  };
}

// Polling Hook
interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface PollingResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

export function usePolling<T>({
  fetcher,
  interval,
  enabled = true,
  onSuccess,
  onError,
}: UsePollingOptions<T>): PollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (!enabled || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling
    intervalRef.current = setInterval(fetchData, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isPaused, interval, fetchData]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    pause,
    resume,
    isPaused,
  };
}

// Mutation Hook with Loading State
interface UseMutationOptions<T, V> {
  mutationFn: (variables: V) => Promise<T>;
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onSettled?: (data: T | undefined, error: Error | null, variables: V) => void;
}

interface MutationResult<T, V> {
  mutate: (variables: V) => Promise<T | undefined>;
  mutateAsync: (variables: V) => Promise<T>;
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

export function useMutation<T, V>({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
}: UseMutationOptions<T, V>): MutationResult<T, V> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsSuccess(false);
    setIsError(false);
    setIsLoading(false);
  }, []);

  const mutateAsync = useCallback(
    async (variables: V): Promise<T> => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      setIsError(false);

      try {
        const result = await mutationFn(variables);
        setData(result);
        setIsSuccess(true);
        onSuccess?.(result, variables);
        onSettled?.(result, null, variables);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setIsError(true);
        onError?.(error, variables);
        onSettled?.(undefined, error, variables);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const mutate = useCallback(
    async (variables: V): Promise<T | undefined> => {
      try {
        return await mutateAsync(variables);
      } catch {
        return undefined;
      }
    },
    [mutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    data,
    isLoading,
    error,
    isSuccess,
    isError,
    reset,
  };
}

// Event Listener Hook
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window | HTMLElement | null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element ?? window;

    if (!targetElement?.addEventListener) return;

    const eventListener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[K]);
    };

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

// Resize Observer Hook
interface Size {
  width: number;
  height: number;
}

export function useResizeObserver(ref: React.RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}

export default {
  useVirtualList,
  useOptimistic,
  useUndoRedo,
  usePolling,
  useMutation,
  useEventListener,
  useResizeObserver,
};
