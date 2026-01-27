"use client";

import { ReactNode, forwardRef, useState } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "success" | "gradient";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loadingText?: string;
  haptic?: boolean;
  ariaLabel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
  leftIcon,
  rightIcon,
  loadingText,
  haptic = false,
  ariaLabel,
}, ref) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = "font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 touch-target active:scale-[0.98]";
  
  const variantClasses = {
    primary: "btn-primary focus-visible:ring-blue-500",
    secondary: "btn-secondary focus-visible:ring-gray-500",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white focus-visible:ring-white/20",
    danger: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 focus-visible:ring-red-500",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 focus-visible:ring-white/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 focus-visible:ring-green-500",
    gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white hover:opacity-90 focus-visible:ring-purple-500 animate-gradient",
  };

  const sizeClasses = {
    xs: "py-1.5 px-3 text-xs",
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
    xl: "py-5 px-10 text-xl",
  };

  const isDisabled = disabled || loading;

  const handleClick = () => {
    if (isDisabled) return;
    
    // Haptic feedback for mobile
    if (haptic && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsPressed(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsPressed(false);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? "opacity-50 cursor-not-allowed !scale-100" : ""
      } ${isPressed ? "scale-[0.98]" : ""} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
      )}
      {!loading && leftIcon}
      {loading && loadingText ? loadingText : (variant === "primary" ? <span>{children}</span> : children)}
      {!loading && rightIcon}
    </button>
  );
});
