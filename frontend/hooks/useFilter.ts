'use client';

import { useState, useCallback, useMemo } from 'react';

interface FilterConfig<T> {
  key: keyof T;
  type: 'exact' | 'includes' | 'range' | 'custom';
  value: unknown;
  customFn?: (item: T, value: unknown) => boolean;
}

interface UseFilterOptions<T> {
  caseSensitive?: boolean;
  initialFilters?: FilterConfig<T>[];
}

/**
 * Filtering hook for arrays
 */
export function useFilter<T extends Record<string, unknown>>(
  items: T[],
  options: UseFilterOptions<T> = {}
) {
  const { caseSensitive = false, initialFilters = [] } = options;

  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKeys, setSearchKeys] = useState<(keyof T)[]>([]);

  const addFilter = useCallback((filter: FilterConfig<T>) => {
    setFilters((prev) => {
      const existing = prev.findIndex((f) => f.key === filter.key);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = filter;
        return updated;
      }
      return [...prev, filter];
    });
  }, []);

  const removeFilter = useCallback((key: keyof T) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setSearchQuery('');
  }, []);

  const updateFilter = useCallback((key: keyof T, value: unknown) => {
    setFilters((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value } : f))
    );
  }, []);

  const matchesFilter = useCallback(
    (item: T, filter: FilterConfig<T>): boolean => {
      const itemValue = item[filter.key];

      switch (filter.type) {
        case 'exact':
          if (!caseSensitive && typeof itemValue === 'string' && typeof filter.value === 'string') {
            return itemValue.toLowerCase() === filter.value.toLowerCase();
          }
          return itemValue === filter.value;

        case 'includes':
          if (typeof itemValue === 'string' && typeof filter.value === 'string') {
            const a = caseSensitive ? itemValue : itemValue.toLowerCase();
            const b = caseSensitive ? filter.value : filter.value.toLowerCase();
            return a.includes(b);
          }
          if (Array.isArray(itemValue)) {
            return itemValue.includes(filter.value);
          }
          return false;

        case 'range':
          if (typeof itemValue === 'number' && Array.isArray(filter.value)) {
            const [min, max] = filter.value as [number, number];
            return itemValue >= min && itemValue <= max;
          }
          return true;

        case 'custom':
          return filter.customFn?.(item, filter.value) ?? true;

        default:
          return true;
      }
    },
    [caseSensitive]
  );

  const matchesSearch = useCallback(
    (item: T): boolean => {
      if (!searchQuery) return true;
      
      const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();
      const keysToSearch = searchKeys.length > 0 ? searchKeys : (Object.keys(item) as (keyof T)[]);

      return keysToSearch.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          const v = caseSensitive ? value : value.toLowerCase();
          return v.includes(query);
        }
        if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        return false;
      });
    },
    [searchQuery, searchKeys, caseSensitive]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const passesFilters = filters.every((filter) => matchesFilter(item, filter));
      const passesSearch = matchesSearch(item);
      return passesFilters && passesSearch;
    });
  }, [items, filters, matchesFilter, matchesSearch]);

  const activeFilterCount = useMemo(() => {
    return filters.filter((f) => f.value !== null && f.value !== undefined && f.value !== '').length;
  }, [filters]);

  return {
    filteredItems,
    filters,
    searchQuery,
    activeFilterCount,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    setSearchQuery,
    setSearchKeys,
  };
}

/**
 * Quick filter presets
 */
export function useQuickFilters<T>(
  items: T[],
  presets: Record<string, (item: T) => boolean>
) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!activePreset || !presets[activePreset]) return items;
    return items.filter(presets[activePreset]);
  }, [items, activePreset, presets]);

  const applyPreset = useCallback((presetKey: string | null) => {
    setActivePreset(presetKey);
  }, []);

  const presetKeys = Object.keys(presets);

  return {
    filteredItems,
    activePreset,
    applyPreset,
    presetKeys,
  };
}

export default useFilter;
