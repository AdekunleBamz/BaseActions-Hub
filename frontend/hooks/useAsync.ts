"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AsyncState } from "@/types";

interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing async operations with loading, error, and data states
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const mountedRef = useRef(true);
  const callCountRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      const callId = ++callCountRef.current;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await asyncFn(...args);

        // Only update if this is the latest call and component is mounted
        if (mountedRef.current && callId === callCountRef.current) {
          setState({ data, loading: false, error: null });
          onSuccess?.(data);
        }

        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        if (mountedRef.current && callId === callCountRef.current) {
          setState({ data: null, loading: false, error: err });
          onError?.(err);
        }

        throw err;
      }
    },
    [asyncFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as Args));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return {
    ...state,
    execute,
    reset,
    setData,
    isIdle: !state.loading && !state.error && state.data === null,
    isSuccess: !state.loading && !state.error && state.data !== null,
    isError: !state.loading && state.error !== null,
  };
}

/**
 * Simplified version that returns a tuple
 */
export function useAsyncCallback<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>
): [(...args: Args) => Promise<T>, AsyncState<T>] {
  const { execute, ...state } = useAsync(asyncFn);
  return [execute, { data: state.data, loading: state.loading, error: state.error }];
}
