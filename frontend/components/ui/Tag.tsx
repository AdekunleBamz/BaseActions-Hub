"use client";

import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  icon,
  className = "",
}: TagProps) {
  const variantClasses = {
    default: "bg-white/10 text-gray-300",
    primary: "bg-blue-500/20 text-blue-400",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
    outline: "bg-transparent border border-white/20 text-gray-300",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Remove tag"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

interface TagGroupProps {
  children: ReactNode;
  className?: string;
}

export function TagGroup({ children, className = "" }: TagGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  );
}
