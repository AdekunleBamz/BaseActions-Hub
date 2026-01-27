"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  initialSnap?: number;
  showHandle?: boolean;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

/**
 * BottomSheet - Mobile-friendly bottom sheet component with drag gestures
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  showHandle = true,
  showOverlay = true,
  closeOnOverlayClick = true,
  className = "",
}: BottomSheetProps) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startSnapHeight = useRef(0);

  const currentHeight = snapPoints[currentSnapIndex] * 100;

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentSnapIndex(initialSnap);
      setDragOffset(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialSnap]);

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    startY.current = clientY;
    startSnapHeight.current = snapPoints[currentSnapIndex] * window.innerHeight;
  }, [currentSnapIndex, snapPoints]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;

    const deltaY = clientY - startY.current;
    const newHeight = startSnapHeight.current - deltaY;
    const maxHeight = snapPoints[snapPoints.length - 1] * window.innerHeight;
    const minHeight = snapPoints[0] * window.innerHeight * 0.5;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setDragOffset(-deltaY);
    }
  }, [isDragging, snapPoints]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const currentHeight = startSnapHeight.current + dragOffset;
    const windowHeight = window.innerHeight;

    // Find closest snap point
    let closestIndex = 0;
    let closestDistance = Infinity;

    snapPoints.forEach((snap, index) => {
      const snapHeight = snap * windowHeight;
      const distance = Math.abs(currentHeight - snapHeight);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // If dragged down significantly below first snap point, close
    if (currentHeight < snapPoints[0] * windowHeight * 0.5) {
      onClose();
    } else {
      setCurrentSnapIndex(closestIndex);
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, snapPoints, onClose]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse handlers for desktop
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Keyboard handler for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculatedHeight = isDragging
    ? `calc(${currentHeight}vh + ${dragOffset}px)`
    : `${currentHeight}vh`;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      {showOverlay && (
        <div
          className={`
            absolute inset-0 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          absolute bottom-0 left-0 right-0
          bg-gray-900/95 backdrop-blur-xl
          rounded-t-3xl
          border-t border-white/10
          shadow-2xl
          transition-[height] duration-300 ease-out
          ${isDragging ? "transition-none" : ""}
          ${className}
        `}
        style={{ height: calculatedHeight }}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Bottom sheet"}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => handleDragStart(e.clientY)}
          >
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto h-full px-6 pb-6">
          {children}
        </div>

        {/* Snap point indicators */}
        {snapPoints.length > 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {snapPoints.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSnapIndex(index)}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all
                  ${currentSnapIndex === index ? "bg-blue-500 scale-125" : "bg-gray-600"}
                `}
                aria-label={`Snap to ${Math.round(snapPoints[index] * 100)}%`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * useBottomSheet - Hook for managing bottom sheet state
 */
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * ActionSheet - Specialized bottom sheet for action menus
 */
interface ActionSheetAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onClick: () => void;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  actions,
}: ActionSheetProps) {
  const handleActionClick = (action: ActionSheetAction) => {
    action.onClick();
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[0.4]}
      initialSnap={0}
      title={title}
    >
      <div className="space-y-2 pt-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-colors
              ${action.destructive
                ? "text-red-400 hover:bg-red-500/10"
                : "text-white hover:bg-white/10"
              }
            `}
          >
            {action.icon && <span className="text-xl">{action.icon}</span>}
            <span className="font-medium">{action.label}</span>
          </button>
        ))}

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-2 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </BottomSheet>
  );
}
