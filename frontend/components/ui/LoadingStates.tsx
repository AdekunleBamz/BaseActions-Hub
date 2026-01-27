"use client";

import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  variant?: "default" | "fullscreen" | "inline";
  blur?: boolean;
  className?: string;
}

/**
 * LoadingOverlay - Overlay with loading indicator
 */
export function LoadingOverlay({
  isVisible,
  text = "Loading...",
  variant = "default",
  blur = true,
  className = "",
}: LoadingOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show && !isVisible) return null;

  const variantClasses = {
    default: "absolute inset-0 rounded-xl",
    fullscreen: "fixed inset-0 z-50",
    inline: "relative min-h-[200px]",
  };

  return (
    <div
      className={`
        flex items-center justify-center
        transition-opacity duration-200
        ${variantClasses[variant]}
        ${blur ? "backdrop-blur-sm" : ""}
        ${isVisible ? "opacity-100" : "opacity-0"}
        ${className}
      `}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {text && <p className="text-gray-300 font-medium">{text}</p>}
      </div>
    </div>
  );
}

/**
 * LoadingSpinner - Animated spinner
 */
interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "currentColor",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3 border",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
    xl: "w-12 h-12 border-3",
  };

  return (
    <div
      className={`
        rounded-full animate-spin
        border-blue-500 border-t-transparent
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ borderColor: color, borderTopColor: "transparent" }}
    />
  );
}

/**
 * LoadingDots - Animated dots loader
 */
interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function LoadingDots({
  size = "md",
  color,
  className = "",
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5 gap-1",
    md: "w-2 h-2 gap-1.5",
    lg: "w-3 h-3 gap-2",
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            rounded-full bg-blue-500 animate-pulse
            ${sizeClasses[size].split(" ").slice(0, 2).join(" ")}
          `}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * LoadingPulse - Pulsing placeholder
 */
interface LoadingPulseProps {
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
}

export function LoadingPulse({
  width = "100%",
  height = "1rem",
  rounded = "md",
  className = "",
}: LoadingPulseProps) {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`bg-white/10 animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * SkeletonCard - Card-shaped skeleton loader
 */
interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
  className?: string;
}

export function SkeletonCard({
  lines = 3,
  showAvatar = true,
  showImage = false,
  className = "",
}: SkeletonCardProps) {
  return (
    <div className={`p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
      {showImage && (
        <LoadingPulse height="160px" rounded="lg" className="mb-4" />
      )}

      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <LoadingPulse width="40px" height="40px" rounded="full" />
          <div className="flex-1 space-y-2">
            <LoadingPulse width="120px" height="14px" />
            <LoadingPulse width="80px" height="12px" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <LoadingPulse
            key={i}
            width={i === lines - 1 ? "60%" : "100%"}
            height="14px"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonList - List of skeleton items
 */
interface SkeletonListProps {
  count?: number;
  itemHeight?: string;
  gap?: string;
  className?: string;
}

export function SkeletonList({
  count = 5,
  itemHeight = "60px",
  gap = "0.75rem",
  className = "",
}: SkeletonListProps) {
  return (
    <div className={`space-y-3 ${className}`} style={{ gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
          style={{ height: itemHeight }}
        >
          <LoadingPulse width="40px" height="40px" rounded="full" />
          <div className="flex-1 space-y-2">
            <LoadingPulse width="50%" height="14px" />
            <LoadingPulse width="30%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonTable - Table skeleton loader
 */
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = "",
}: SkeletonTableProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 ${className}`}>
      <table className="w-full">
        {showHeader && (
          <thead className="bg-white/5">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <LoadingPulse width="80px" height="14px" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowI) => (
            <tr key={rowI} className="border-t border-white/5">
              {Array.from({ length: columns }).map((_, colI) => (
                <td key={colI} className="px-4 py-4">
                  <LoadingPulse
                    width={colI === 0 ? "60%" : "80%"}
                    height="14px"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * LoadingButton - Button with loading state
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  spinnerPosition?: "left" | "right";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  spinnerPosition = "left",
  variant = "primary",
  size = "md",
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/10",
    ghost: "bg-transparent hover:bg-white/10 text-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2",
  };

  const spinnerSizes = {
    sm: "xs" as const,
    md: "sm" as const,
    lg: "md" as const,
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium
        rounded-xl transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading && spinnerPosition === "left" && (
        <LoadingSpinner size={spinnerSizes[size]} color="currentColor" />
      )}
      {isLoading && loadingText ? loadingText : children}
      {isLoading && spinnerPosition === "right" && (
        <LoadingSpinner size={spinnerSizes[size]} color="currentColor" />
      )}
    </button>
  );
}

/**
 * PageLoader - Full page loading state
 */
interface PageLoaderProps {
  text?: string;
  showLogo?: boolean;
}

export function PageLoader({ text = "Loading...", showLogo = true }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950 z-50">
      {showLogo && (
        <div className="text-4xl mb-8 animate-bounce">🔵</div>
      )}
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-400">{text}</p>
    </div>
  );
}

/**
 * useLoading - Hook for loading state management
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(100);
  };

  const updateProgress = (value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  };

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await fn();
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
    updateProgress,
    withLoading,
  };
}
