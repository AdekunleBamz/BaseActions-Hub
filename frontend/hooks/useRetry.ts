'use client';

import { useState, useCallback, useRef } from 'react';

interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  lastError: Error | null;
}

/**
 * Retry hook for handling failed operations
 */
export function useRetry(config: RetryConfig = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry,
  } = config;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    lastError: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const getDelay = useCallback(
    (attempt: number) => {
      if (backoff === 'exponential') {
        return delay * Math.pow(2, attempt);
      }
      return delay * (attempt + 1);
    },
    [delay, backoff]
  );

  const execute = useCallback(
    async <T>(fn: (signal?: AbortSignal) => Promise<T>): Promise<T> => {
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (signal.aborted) {
          throw new Error('Operation aborted');
        }

        try {
          setState({
            isRetrying: attempt > 0,
            attempt,
            lastError: null,
          });

          const result = await fn(signal);
          
          setState({
            isRetrying: false,
            attempt: 0,
            lastError: null,
          });

          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (attempt < maxRetries) {
            onRetry?.(attempt + 1, lastError);
            
            const waitTime = getDelay(attempt);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
      }

      setState({
        isRetrying: false,
        attempt: maxRetries,
        lastError,
      });

      throw lastError;
    },
    [maxRetries, getDelay, onRetry]
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      attempt: 0,
      lastError: null,
    });
  }, []);

  return {
    ...state,
    execute,
    abort,
    reset,
  };
}

/**
 * Simple retry wrapper for async functions
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryConfig = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoff = 'exponential' } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const waitTime = backoff === 'exponential' 
          ? delay * Math.pow(2, attempt)
          : delay * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

export default useRetry;
