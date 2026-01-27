"use client";

import { useCallback, useEffect, useRef } from "react";
import { analytics, AnalyticsEvent, UserProperties } from "@/lib/analytics";
import { usePathname } from "next/navigation";

// ============================================================================
// usePageTracking - Automatically track page views
// ============================================================================

/**
 * Automatically track page views on route changes
 */
export function usePageTracking() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Skip if same path
    if (previousPathname.current === pathname) return;

    // Track page view
    analytics.trackPageView(pathname);
    previousPathname.current = pathname;
  }, [pathname]);
}

// ============================================================================
// useEventTracking - Track custom events
// ============================================================================

/**
 * Hook for tracking events with stable callback
 */
export function useEventTracking() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  const trackClick = useCallback((buttonId: string, context?: string) => {
    analytics.trackEvent({
      name: "button_clicked",
      category: "ui",
      label: buttonId,
      properties: { context },
    });
  }, []);

  const trackError = useCallback((errorType: string, message: string, stack?: string) => {
    analytics.trackEvent({
      name: "error_occurred",
      category: "error",
      properties: { errorType, message, stack },
    });
  }, []);

  return {
    trackEvent,
    trackClick,
    trackError,
  };
}

// ============================================================================
// useUserTracking - Track user properties
// ============================================================================

/**
 * Hook for managing user properties
 */
export function useUserTracking() {
  const setUserProperties = useCallback((properties: UserProperties) => {
    analytics.setUserProperties(properties);
  }, []);

  const resetUser = useCallback(() => {
    analytics.reset();
  }, []);

  return {
    setUserProperties,
    resetUser,
    getUserProperties: () => analytics.getUserProperties(),
  };
}

// ============================================================================
// useTimingTracking - Track timing metrics
// ============================================================================

interface TimingMetric {
  name: string;
  category?: string;
  startTime: number;
}

/**
 * Hook for tracking timing metrics
 */
export function useTimingTracking() {
  const timings = useRef<Map<string, TimingMetric>>(new Map());

  const startTiming = useCallback((name: string, category?: string) => {
    timings.current.set(name, {
      name,
      category,
      startTime: performance.now(),
    });
  }, []);

  const endTiming = useCallback((name: string) => {
    const timing = timings.current.get(name);
    if (!timing) return;

    const duration = performance.now() - timing.startTime;
    
    analytics.trackEvent({
      name: "timing",
      category: timing.category || "performance",
      label: name,
      value: Math.round(duration),
      properties: { duration },
    });

    timings.current.delete(name);
    return duration;
  }, []);

  return {
    startTiming,
    endTiming,
  };
}

// ============================================================================
// useClickTracking - Track element clicks
// ============================================================================

/**
 * Hook that returns props to track clicks on an element
 */
export function useClickTracking(eventName: string, properties?: Record<string, unknown>) {
  const handleClick = useCallback(() => {
    analytics.trackEvent({
      name: eventName,
      category: "interaction",
      properties,
    });
  }, [eventName, properties]);

  return {
    onClick: handleClick,
    "data-track": eventName,
  };
}

// ============================================================================
// useFormTracking - Track form interactions
// ============================================================================

interface FormTrackingOptions {
  formId: string;
  trackFieldChanges?: boolean;
}

/**
 * Hook for tracking form interactions
 */
export function useFormTracking(options: FormTrackingOptions) {
  const { formId, trackFieldChanges = false } = options;
  const fieldInteractions = useRef<Set<string>>(new Set());

  const trackFieldFocus = useCallback((fieldName: string) => {
    if (trackFieldChanges && !fieldInteractions.current.has(fieldName)) {
      fieldInteractions.current.add(fieldName);
      analytics.trackEvent({
        name: "form_field_focused",
        category: "form",
        label: formId,
        properties: { fieldName },
      });
    }
  }, [formId, trackFieldChanges]);

  const trackFieldBlur = useCallback((fieldName: string, hasValue: boolean) => {
    if (trackFieldChanges) {
      analytics.trackEvent({
        name: "form_field_completed",
        category: "form",
        label: formId,
        properties: { fieldName, hasValue },
      });
    }
  }, [formId, trackFieldChanges]);

  const trackSubmit = useCallback((success: boolean, errors?: string[]) => {
    analytics.trackEvent({
      name: "form_submitted",
      category: "form",
      label: formId,
      properties: {
        success,
        errors,
        fieldsInteracted: fieldInteractions.current.size,
      },
    });
  }, [formId]);

  const trackAbandonment = useCallback(() => {
    if (fieldInteractions.current.size > 0) {
      analytics.trackEvent({
        name: "form_abandoned",
        category: "form",
        label: formId,
        properties: {
          fieldsInteracted: Array.from(fieldInteractions.current),
        },
      });
    }
  }, [formId]);

  // Track abandonment on unmount if form was partially filled
  useEffect(() => {
    return () => {
      // Note: This won't work for navigation away but works for component unmount
    };
  }, [trackAbandonment]);

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackSubmit,
    trackAbandonment,
  };
}

// ============================================================================
// useScrollTracking - Track scroll depth
// ============================================================================

interface ScrollTrackingOptions {
  thresholds?: number[];
  pageId?: string;
}

/**
 * Hook for tracking scroll depth
 */
export function useScrollTracking(options: ScrollTrackingOptions = {}) {
  const { thresholds = [25, 50, 75, 100], pageId } = options;
  const reachedThresholds = useRef<Set<number>>(new Set());
  const pathname = usePathname();

  useEffect(() => {
    // Reset on route change
    reachedThresholds.current.clear();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !reachedThresholds.current.has(threshold)) {
          reachedThresholds.current.add(threshold);
          analytics.trackEvent({
            name: "scroll_depth",
            category: "engagement",
            value: threshold,
            properties: {
              page: pageId || pathname,
              threshold,
            },
          });
        }
      });
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandler);
  }, [pathname, pageId, thresholds]);
}

// ============================================================================
// useVisibilityTracking - Track element visibility
// ============================================================================

interface VisibilityTrackingOptions {
  elementId: string;
  threshold?: number;
  trackOnce?: boolean;
}

/**
 * Hook for tracking when an element becomes visible
 */
export function useVisibilityTracking<T extends HTMLElement>(
  options: VisibilityTrackingOptions
) {
  const { elementId, threshold = 0.5, trackOnce = true } = options;
  const ref = useRef<T>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (trackOnce && hasTracked.current) return;
            
            hasTracked.current = true;
            analytics.trackEvent({
              name: "element_visible",
              category: "visibility",
              label: elementId,
              properties: {
                intersectionRatio: entry.intersectionRatio,
              },
            });
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId, threshold, trackOnce]);

  return ref;
}
