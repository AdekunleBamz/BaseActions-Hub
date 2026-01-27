"use client";

import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  rounded?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      label,
      variant = "ghost",
      size = "md",
      loading = false,
      rounded = true,
      disabled,
      className = "",
      ...props
    },
    ref
  ) {
    const baseClasses = `inline-flex items-center justify-center transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900`;

    const variantClasses = {
      primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
      secondary: "bg-white/10 text-white hover:bg-white/20 focus:ring-white/30",
      ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/10 focus:ring-white/20",
      danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 focus:ring-red-500",
    };

    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${rounded ? "rounded-full" : "rounded-lg"}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg className={`animate-spin ${iconSizes[size]}`} viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <span className={iconSizes[size]}>{icon}</span>
        )}
      </button>
    );
  }
);
