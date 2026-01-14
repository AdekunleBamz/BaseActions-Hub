"use client";

import { ReactNode, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  position?: "left" | "right" | "bottom" | "top";
  size?: "sm" | "md" | "lg" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  position = "right",
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: position === "left" || position === "right" ? "max-w-sm w-full" : "max-h-64",
    md: position === "left" || position === "right" ? "max-w-md w-full" : "max-h-96",
    lg: position === "left" || position === "right" ? "max-w-lg w-full" : "max-h-[70vh]",
    full: position === "left" || position === "right" ? "w-full" : "h-full",
  };

  const positionClasses = {
    left: "left-0 top-0 h-full",
    right: "right-0 top-0 h-full",
    bottom: "bottom-0 left-0 w-full",
    top: "top-0 left-0 w-full",
  };

  const translateClasses = {
    left: isOpen ? "translate-x-0" : "-translate-x-full",
    right: isOpen ? "translate-x-0" : "translate-x-full",
    bottom: isOpen ? "translate-y-0" : "translate-y-full",
    top: isOpen ? "translate-y-0" : "-translate-y-full",
  };

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    },
    [onClose, closeOnOverlayClick]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();

      return () => {
        document.body.style.overflow = "";
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  const drawerContent = (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "drawer-title" : undefined}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Content */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`
          fixed ${positionClasses[position]} ${sizeClasses[size]}
          bg-gray-900 border-white/10
          ${position === "left" ? "border-r" : ""}
          ${position === "right" ? "border-l" : ""}
          ${position === "top" ? "border-b" : ""}
          ${position === "bottom" ? "border-t" : ""}
          transform transition-transform duration-300 ease-out
          ${translateClasses[position]}
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {title && (
              <h2 id="drawer-title" className="text-lg font-bold text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close drawer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
