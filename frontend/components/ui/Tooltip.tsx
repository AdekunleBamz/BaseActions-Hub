"use client";

import { useState, useRef, ReactNode, useCallback, useEffect } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
  className = "",
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay, disabled]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  // Check if tooltip would overflow and adjust position
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPosition = position;

      if (position === "top" && triggerRect.top - tooltipRect.height < 10) {
        newPosition = "bottom";
      } else if (position === "bottom" && triggerRect.bottom + tooltipRect.height > viewportHeight - 10) {
        newPosition = "top";
      } else if (position === "left" && triggerRect.left - tooltipRect.width < 10) {
        newPosition = "right";
      } else if (position === "right" && triggerRect.right + tooltipRect.width > viewportWidth - 10) {
        newPosition = "left";
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent",
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute ${positionClasses[actualPosition]}
            px-3 py-2 text-sm text-white bg-gray-800 rounded-lg
            shadow-lg z-50 whitespace-nowrap animate-fadeIn
          `}
        >
          {content}
          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 border-4
              ${arrowClasses[actualPosition]}
            `}
          />
        </div>
      )}
    </div>
  );
}
