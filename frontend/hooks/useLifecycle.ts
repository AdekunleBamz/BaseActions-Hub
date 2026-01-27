import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * Run effect only once on mount
 */
export function useMount(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}

/**
 * Run effect only on unmount
 */
export function useUnmount(effect: () => void) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    return () => {
      effectRef.current();
    };
  }, []);
}

/**
 * Run effect only on updates (skips first render)
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    } else {
      return effect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Check if component is mounted
 */
export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return () => isMounted.current;
}

/**
 * Log lifecycle events
 */
export function useLifecycleLogger(componentName: string, props?: Record<string, unknown>) {
  useMount(() => console.debug(`[${componentName}] mounted`));
  useUnmount(() => console.debug(`[${componentName}] unmounted`));
  useUpdateEffect(() => console.debug(`[${componentName}] updated`, props), [props]);
}
