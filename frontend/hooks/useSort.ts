'use client';

import { useState, useCallback, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortState<T> {
  key: keyof T | null;
  direction: SortDirection;
}

interface UseSortOptions<T> {
  initialKey?: keyof T;
  initialDirection?: SortDirection;
  customComparators?: Partial<Record<keyof T, (a: T, b: T) => number>>;
}

/**
 * Sorting hook for arrays
 */
export function useSort<T extends Record<string, unknown>>(
  items: T[],
  options: UseSortOptions<T> = {}
) {
  const { initialKey, initialDirection = 'asc', customComparators = {} } = options;

  const [sortState, setSortState] = useState<SortState<T>>({
    key: initialKey ?? null,
    direction: initialDirection,
  });

  const toggleSort = useCallback((key: keyof T) => {
    setSortState((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const setSort = useCallback((key: keyof T, direction: SortDirection) => {
    setSortState({ key, direction });
  }, []);

  const clearSort = useCallback(() => {
    setSortState({ key: null, direction: 'asc' });
  }, []);

  const sortedItems = useMemo(() => {
    if (!sortState.key) return items;

    const key = sortState.key;
    const direction = sortState.direction;
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...items].sort((a, b) => {
      // Use custom comparator if provided
      if (customComparators[key]) {
        return customComparators[key]!(a, b) * multiplier;
      }

      const aVal = a[key];
      const bVal = b[key];

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Handle different types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * multiplier;
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return (aVal.getTime() - bVal.getTime()) * multiplier;
      }

      // Default comparison
      return String(aVal).localeCompare(String(bVal)) * multiplier;
    });
  }, [items, sortState, customComparators]);

  const getSortIndicator = useCallback(
    (key: keyof T): 'asc' | 'desc' | null => {
      if (sortState.key !== key) return null;
      return sortState.direction;
    },
    [sortState]
  );

  return {
    sortedItems,
    sortKey: sortState.key,
    sortDirection: sortState.direction,
    toggleSort,
    setSort,
    clearSort,
    getSortIndicator,
  };
}

/**
 * Multi-column sorting hook
 */
export function useMultiSort<T extends Record<string, unknown>>(
  items: T[],
  maxSortColumns = 3
) {
  const [sortColumns, setSortColumns] = useState<SortState<T>[]>([]);

  const addSort = useCallback(
    (key: keyof T, direction: SortDirection = 'asc') => {
      setSortColumns((prev) => {
        const filtered = prev.filter((s) => s.key !== key);
        const newSort = [...filtered, { key, direction }];
        return newSort.slice(-maxSortColumns);
      });
    },
    [maxSortColumns]
  );

  const removeSort = useCallback((key: keyof T) => {
    setSortColumns((prev) => prev.filter((s) => s.key !== key));
  }, []);

  const clearAllSorts = useCallback(() => {
    setSortColumns([]);
  }, []);

  const sortedItems = useMemo(() => {
    if (sortColumns.length === 0) return items;

    return [...items].sort((a, b) => {
      for (const { key, direction } of sortColumns) {
        if (!key) continue;

        const multiplier = direction === 'asc' ? 1 : -1;
        const aVal = a[key];
        const bVal = b[key];

        if (aVal == null && bVal == null) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        if (comparison !== 0) {
          return comparison * multiplier;
        }
      }
      return 0;
    });
  }, [items, sortColumns]);

  return {
    sortedItems,
    sortColumns,
    addSort,
    removeSort,
    clearAllSorts,
  };
}

export default useSort;
