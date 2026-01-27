"use client";

import { useRef, useEffect, useCallback, type RefObject } from "react";

interface ScrollLockOptions {
  reserveScrollBarGap?: boolean;
}

export function useScrollLock(
  targetRef?: RefObject<HTMLElement>,
  options: ScrollLockOptions = {}
) {
  const scrollPosition = useRef(0);
  const isLocked = useRef(false);

  const lock = useCallback(() => {
    if (isLocked.current) return;

    const target = targetRef?.current || document.body;
    scrollPosition.current = window.scrollY;

    // Calculate scrollbar width if needed
    const scrollBarWidth = options.reserveScrollBarGap
      ? window.innerWidth - document.documentElement.clientWidth
      : 0;

    target.style.overflow = "hidden";
    target.style.position = "fixed";
    target.style.top = `-${scrollPosition.current}px`;
    target.style.width = "100%";

    if (scrollBarWidth > 0) {
      target.style.paddingRight = `${scrollBarWidth}px`;
    }

    isLocked.current = true;
  }, [targetRef, options.reserveScrollBarGap]);

  const unlock = useCallback(() => {
    if (!isLocked.current) return;

    const target = targetRef?.current || document.body;

    target.style.overflow = "";
    target.style.position = "";
    target.style.top = "";
    target.style.width = "";
    target.style.paddingRight = "";

    window.scrollTo(0, scrollPosition.current);
    isLocked.current = false;
  }, [targetRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isLocked.current) {
        unlock();
      }
    };
  }, [unlock]);

  return { lock, unlock, isLocked: isLocked.current };
}

/**
 * Hook to detect scroll direction
 */
export function useScrollDirection(threshold = 10) {
  const scrollY = useRef(0);
  const lastScrollY = useRef(0);
  const direction = useRef<"up" | "down" | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      const diff = scrollY.current - lastScrollY.current;

      if (Math.abs(diff) > threshold) {
        direction.current = diff > 0 ? "down" : "up";
        lastScrollY.current = scrollY.current;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return direction.current;
}

/**
 * Hook to scroll to element
 */
export function useScrollTo() {
  const scrollToElement = useCallback(
    (element: HTMLElement | string, options?: ScrollIntoViewOptions) => {
      const target =
        typeof element === "string"
          ? document.querySelector(element)
          : element;

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
          ...options,
        });
      }
    },
    []
  );

  const scrollToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior,
    });
  }, []);

  return { scrollToElement, scrollToTop, scrollToBottom };
}
