"use client";

import { useState, useRef, useCallback, useEffect, ReactNode } from "react";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export function Popover({
  trigger,
  children,
  position = "bottom",
  align = "center",
  closeOnClickOutside = true,
  closeOnEscape = true,
  className = "",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [closeOnClickOutside]
  );

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        setIsOpen(false);
      }
    },
    [closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const alignClasses = {
    start: position === "top" || position === "bottom" ? "left-0" : "top-0",
    center:
      position === "top" || position === "bottom"
        ? "left-1/2 -translate-x-1/2"
        : "top-1/2 -translate-y-1/2",
    end: position === "top" || position === "bottom" ? "right-0" : "bottom-0",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`
            absolute z-50 ${positionClasses[position]} ${alignClasses[align]}
            glass rounded-xl p-4 min-w-[200px]
            animate-scaleIn shadow-xl
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Convenience wrapper for controlled popover
interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

Popover.Content = function PopoverContent({ children, className = "" }: PopoverContentProps) {
  return <div className={className}>{children}</div>;
};

Popover.Close = function PopoverClose({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return <div onClick={onClose}>{children}</div>;
};
