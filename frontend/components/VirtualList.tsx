"use client";

import { useRef, useState, useEffect, useMemo, useCallback, type ReactNode } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  containerHeight?: number | string;
  gap?: number;
}

/**
 * A simple virtualized list component that only renders visible items
 * Useful for long lists like leaderboards or signature lists
 */
export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  className = "",
  containerHeight = 400,
  gap = 0,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerClientHeight, setContainerClientHeight] = useState(
    typeof containerHeight === "number" ? containerHeight : 400
  );

  // Calculate visible range
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const totalItemHeight = itemHeight + gap;
    const start = Math.max(0, Math.floor(scrollTop / totalItemHeight) - overscan);
    const visibleCount = Math.ceil(containerClientHeight / totalItemHeight) + 2 * overscan;
    const end = Math.min(items.length - 1, start + visibleCount);

    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items.slice(start, end + 1),
    };
  }, [items, itemHeight, gap, scrollTop, containerClientHeight, overscan]);

  // Total height for scroll container
  const totalHeight = useMemo(
    () => items.length * (itemHeight + gap) - gap,
    [items.length, itemHeight, gap]
  );

  // Offset for visible items
  const offsetY = useMemo(
    () => startIndex * (itemHeight + gap),
    [startIndex, itemHeight, gap]
  );

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Update container height on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerClientHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Don't virtualize small lists
  if (items.length <= 20) {
    return (
      <div className={className} style={{ display: "flex", flexDirection: "column", gap }}>
        {items.map((item, index) => (
          <div key={index} style={{ minHeight: itemHeight }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      role="list"
      aria-label={`List with ${items.length} items`}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
            display: "flex",
            flexDirection: "column",
            gap,
          }}
        >
          {visibleItems.map((item, localIndex) => {
            const actualIndex = startIndex + localIndex;
            return (
              <div
                key={actualIndex}
                style={{ minHeight: itemHeight }}
                role="listitem"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for intersection observer based lazy loading
 */
export function useLazyLoad(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}
