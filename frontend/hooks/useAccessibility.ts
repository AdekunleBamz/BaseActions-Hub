"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createFocusTrap,
  createFocusRestore,
  announce,
  createRovingTabindex,
  prefersReducedMotion,
} from "@/lib/accessibility";

// ============================================================================
// useFocusTrap - Trap focus within a container (for modals, dialogs)
// ============================================================================

export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) {
      trapRef.current?.deactivate();
      trapRef.current = null;
      return;
    }

    trapRef.current = createFocusTrap(container);
    trapRef.current.activate();

    return () => {
      trapRef.current?.deactivate();
      trapRef.current = null;
    };
  }, [isActive]);

  return containerRef;
}

// ============================================================================
// useFocusRestore - Save and restore focus (for modals)
// ============================================================================

export function useFocusRestore(shouldRestore: boolean) {
  const focusRestoreRef = useRef(createFocusRestore());

  useEffect(() => {
    if (shouldRestore) {
      focusRestoreRef.current.save();
    }

    return () => {
      if (shouldRestore) {
        focusRestoreRef.current.restore();
      }
    };
  }, [shouldRestore]);

  return focusRestoreRef.current;
}

// ============================================================================
// useAnnounce - Announce messages to screen readers
// ============================================================================

export function useAnnounce() {
  const announceMessage = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      announce(message, priority);
    },
    []
  );

  return announceMessage;
}

// ============================================================================
// useRovingTabindex - Keyboard navigation for widget groups
// ============================================================================

export function useRovingTabindex<T extends HTMLElement>(
  selector: string,
  isActive = true
) {
  const containerRef = useRef<T>(null);
  const rovingRef = useRef<ReturnType<typeof createRovingTabindex> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) {
      rovingRef.current?.destroy();
      rovingRef.current = null;
      return;
    }

    rovingRef.current = createRovingTabindex(container, selector);
    rovingRef.current.init();

    return () => {
      rovingRef.current?.destroy();
      rovingRef.current = null;
    };
  }, [selector, isActive]);

  return containerRef;
}

// ============================================================================
// useReducedMotion - Check user's motion preference
// ============================================================================

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Initial check
    setReducedMotion(prefersReducedMotion());

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

// ============================================================================
// useAriaLive - Create a persistent live region
// ============================================================================

export function useAriaLive(
  priority: "polite" | "assertive" = "polite"
) {
  const [message, setMessage] = useState("");
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create the live region element
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", priority);
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.setAttribute("role", priority === "assertive" ? "alert" : "status");
    
    Object.assign(liveRegion.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    });

    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      if (liveRegionRef.current?.parentNode) {
        liveRegionRef.current.parentNode.removeChild(liveRegionRef.current);
      }
    };
  }, [priority]);

  useEffect(() => {
    if (liveRegionRef.current && message) {
      // Clear and set for reliable announcement
      liveRegionRef.current.textContent = "";
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message;
        }
      }, 50);
    }
  }, [message]);

  return setMessage;
}

// ============================================================================
// useTabNavigation - Handle tab list keyboard navigation
// ============================================================================

interface UseTabNavigationOptions {
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
}

export function useTabNavigation(
  tabCount: number,
  selectedIndex: number,
  onSelect: (index: number) => void,
  options: UseTabNavigationOptions = {}
) {
  const { orientation = "horizontal", loop = true } = options;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isHorizontal = orientation === "horizontal";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

      let newIndex = selectedIndex;

      switch (e.key) {
        case nextKey:
          e.preventDefault();
          newIndex = selectedIndex + 1;
          if (newIndex >= tabCount) {
            newIndex = loop ? 0 : tabCount - 1;
          }
          break;
        case prevKey:
          e.preventDefault();
          newIndex = selectedIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? tabCount - 1 : 0;
          }
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = tabCount - 1;
          break;
        default:
          return;
      }

      if (newIndex !== selectedIndex) {
        onSelect(newIndex);
      }
    },
    [selectedIndex, tabCount, orientation, loop, onSelect]
  );

  return { handleKeyDown };
}

// ============================================================================
// useSkipLink - Handle skip link functionality
// ============================================================================

export function useSkipLink() {
  const skipToMain = useCallback(() => {
    const main = document.getElementById("main-content") || document.querySelector("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
      main.addEventListener("blur", () => main.removeAttribute("tabindex"), {
        once: true,
      });
    }
  }, []);

  return { skipToMain };
}

// ============================================================================
// useKeyboardUser - Detect if user is using keyboard
// ============================================================================

export function useKeyboardUser(): boolean {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}
