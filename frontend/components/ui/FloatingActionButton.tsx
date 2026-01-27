"use client";

import { useCallback, useState, useRef, useEffect } from "react";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  actions?: FABAction[];
  variant?: "primary" | "secondary" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

interface FABAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "success" | "warning";
}

const variantStyles = {
  primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/30",
  secondary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-500/30",
  success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30",
  warning: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/30",
};

const sizeStyles = {
  sm: "w-12 h-12 text-lg",
  md: "w-14 h-14 text-xl",
  lg: "w-16 h-16 text-2xl",
};

const positionStyles = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
};

/**
 * FloatingActionButton - Primary action button that floats above content
 * Supports speed dial pattern with expandable actions
 */
export function FloatingActionButton({
  icon,
  onClick,
  label,
  position = "bottom-right",
  actions = [],
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasActions = actions.length > 0;

  const handleClick = useCallback(() => {
    if (hasActions) {
      setIsExpanded(!isExpanded);
    } else if (onClick) {
      onClick();
    }
  }, [hasActions, isExpanded, onClick]);

  const handleActionClick = useCallback((action: FABAction) => {
    action.onClick();
    setIsExpanded(false);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isExpanded]);

  return (
    <div
      ref={containerRef}
      className={`fixed ${positionStyles[position]} z-40 ${className}`}
    >
      {/* Speed Dial Actions */}
      {hasActions && (
        <div
          className={`
            absolute bottom-full mb-3 left-1/2 -translate-x-1/2
            flex flex-col-reverse items-center gap-2
            transition-all duration-300
            ${isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center gap-3 group"
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
              }}
            >
              {/* Label */}
              <span
                className={`
                  px-3 py-1.5 rounded-lg
                  bg-gray-900/95 text-white text-sm font-medium
                  whitespace-nowrap shadow-lg
                  transition-all duration-200
                  opacity-0 group-hover:opacity-100
                  translate-x-2 group-hover:translate-x-0
                `}
              >
                {action.label}
              </span>

              {/* Action Button */}
              <button
                onClick={() => handleActionClick(action)}
                className={`
                  w-10 h-10 rounded-full
                  ${variantStyles[action.variant || "secondary"]}
                  text-white shadow-lg
                  flex items-center justify-center
                  transition-all duration-300
                  hover:scale-110
                  focus:outline-none focus:ring-2 focus:ring-white/30
                `}
                aria-label={action.label}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] -z-10"
          aria-hidden="true"
        />
      )}

      {/* Main FAB Button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          rounded-full text-white shadow-lg
          flex items-center justify-center
          transition-all duration-300
          hover:scale-105 hover:shadow-xl
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-white/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isExpanded ? "rotate-45" : "rotate-0"}
        `}
        aria-label={label || "Action button"}
        aria-expanded={hasActions ? isExpanded : undefined}
      >
        {icon}
      </button>

      {/* Label tooltip */}
      {label && !hasActions && (
        <span
          className={`
            absolute right-full mr-3 top-1/2 -translate-y-1/2
            px-3 py-1.5 rounded-lg
            bg-gray-900/95 text-white text-sm font-medium
            whitespace-nowrap shadow-lg
            opacity-0 group-hover:opacity-100
            pointer-events-none
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * ScrollToTopFAB - Pre-configured FAB for scrolling to top
 */
export function ScrollToTopFAB({
  showAfter = 300,
  className = "",
}: {
  showAfter?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isVisible) return null;

  return (
    <FloatingActionButton
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      }
      onClick={scrollToTop}
      label="Scroll to top"
      variant="secondary"
      size="sm"
      className={`transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    />
  );
}

/**
 * QuickActionsFAB - FAB with predefined quick actions
 */
export function QuickActionsFAB({
  onSign,
  onShare,
  onLeaderboard,
  className = "",
}: {
  onSign?: () => void;
  onShare?: () => void;
  onLeaderboard?: () => void;
  className?: string;
}) {
  const actions: FABAction[] = [];

  if (onSign) {
    actions.push({
      id: "sign",
      icon: "✍️",
      label: "Sign Guestbook",
      onClick: onSign,
      variant: "primary",
    });
  }

  if (onShare) {
    actions.push({
      id: "share",
      icon: "🔗",
      label: "Share",
      onClick: onShare,
      variant: "success",
    });
  }

  if (onLeaderboard) {
    actions.push({
      id: "leaderboard",
      icon: "🏆",
      label: "Leaderboard",
      onClick: onLeaderboard,
      variant: "warning",
    });
  }

  return (
    <FloatingActionButton
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      }
      actions={actions}
      label="Quick Actions"
      className={className}
    />
  );
}
