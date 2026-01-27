'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Pagination hook for handling paginated data
 */
export function usePagination(options: PaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 10, totalItems = 0 } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(totalItems);

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const updateTotal = useCallback((newTotal: number) => {
    setTotal(newTotal);
    const newTotalPages = Math.ceil(newTotal / pageSize) || 1;
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  }, [page, pageSize]);

  // Generate page numbers for UI
  const getPageNumbers = useCallback(
    (maxVisible = 5): (number | 'ellipsis')[] => {
      const pages: (number | 'ellipsis')[] = [];
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, page - half);
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start < maxVisible - 1) {
          start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push('ellipsis');
        }

        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== totalPages) {
            pages.push(i);
          }
        }

        if (end < totalPages) {
          if (end < totalPages - 1) pages.push('ellipsis');
          pages.push(totalPages);
        }
      }

      return pages;
    },
    [page, totalPages]
  );

  const state: PaginationState = {
    page,
    pageSize,
    totalItems: total,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return {
    ...state,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize,
    updateTotal,
    getPageNumbers,
  };
}

/**
 * Infinite scroll pagination hook
 */
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  options: { threshold?: number } = {}
) {
  const { threshold = 100 } = options;
  
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn(page);
      setItems((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, isLoading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  return {
    items,
    hasMore,
    isLoading,
    error,
    loadMore,
    reset,
    loadMoreRef,
  };
}

export default usePagination;
