"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseWindowScrollReturn extends ScrollPosition {
  scrollTo: (options: ScrollToOptions) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  isScrolled: boolean;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
}

export function useWindowScroll(threshold: number = 50): UseWindowScrollReturn {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setPosition({ x: currentScrollX, y: currentScrollY });

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollTo = useCallback((options: ScrollToOptions) => {
    window.scrollTo({
      behavior: "smooth",
      ...options,
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return {
    x: position.x,
    y: position.y,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    isScrolled: position.y > threshold,
    isScrollingUp: scrollDirection === "up",
    isScrollingDown: scrollDirection === "down",
  };
}
