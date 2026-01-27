"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: string;
  rightAddon?: string;
  isRequired?: boolean;
  variant?: "default" | "filled" | "flushed";
  success?: boolean;
  showCharCount?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    hint, 
    className = "", 
    leftIcon, 
    rightIcon, 
    leftAddon, 
    rightAddon, 
    isRequired, 
    variant = "default", 
    success,
    showCharCount,
    onClear,
    showClearButton,
    maxLength,
    value,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const variantClasses = {
      default: "input-modern",
      filled: "input-modern bg-white/10",
      flushed: "bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 focus:border-blue-500 focus:ring-0",
    };

    const stateClasses = error 
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
      : success 
        ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/20"
        : "";

    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
            <span>
              {label}
              {isRequired && <span className="text-red-400 ml-1">*</span>}
            </span>
            {showCharCount && maxLength && (
              <span className={`text-xs ${charCount > maxLength * 0.9 ? "text-orange-400" : "text-gray-500"}`}>
                {charCount}/{maxLength}
              </span>
            )}
          </label>
        )}
        <div className={`relative flex items-center transition-all ${isFocused ? "scale-[1.01]" : ""}`}>
          {leftAddon && (
            <span className="flex items-center px-3 h-full bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">
              {leftAddon}
            </span>
          )}
          {leftIcon && (
            <span className={`absolute left-3 transition-colors ${isFocused ? "text-blue-400" : "text-gray-400"} pointer-events-none`}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            value={value}
            maxLength={maxLength}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`${variantClasses[variant]} ${stateClasses} ${leftIcon ? "pl-10" : ""} ${rightIcon || showClearButton ? "pr-10" : ""} ${leftAddon ? "rounded-l-none" : ""} ${rightAddon ? "rounded-r-none" : ""} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
            {...props}
          />
          {showClearButton && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Clear input"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {rightIcon && !showClearButton && (
            <span className="absolute right-3 text-gray-400 pointer-events-none">
              {rightIcon}
            </span>
          )}
          {success && !rightIcon && !showClearButton && (
            <span className="absolute right-3 text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          {rightAddon && (
            <span className="flex items-center px-3 h-full bg-white/5 border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">
              {rightAddon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-slide-in-up">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${props.id}-hint`} className="mt-2 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
