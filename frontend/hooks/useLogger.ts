import { useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger';

/**
 * Hook for using the logger with component context
 * Automatically logs mount/unmount events in debug mode
 */
export function useLogger(componentName: string) {
  useEffect(() => {
    logger.debug(`${componentName} mounted`);
    return () => {
      logger.debug(`${componentName} unmounted`);
    };
  }, [componentName]);

  return useMemo(() => logger.create(componentName), [componentName]);
}

/**
 * Hook to log changes in dependencies
 */
export function useLogChanges(componentName: string, props: Record<string, unknown>) {
  useEffect(() => {
    logger.debug(`${componentName} props changed`, props);
  }, [componentName, props]);
}
