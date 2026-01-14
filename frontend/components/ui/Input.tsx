"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", leftIcon, rightIcon, leftAddon, rightAddon, isRequired, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "input-modern",
      filled: "input-modern bg-white/10",
      flushed: "bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 focus:border-blue-500 focus:ring-0",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="flex items-center px-3 h-full bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">
              {leftAddon}
            </span>
          )}
          {leftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`${variantClasses[variant]} ${error ? "border-red-500/50 focus:border-red-500" : ""} ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${leftAddon ? "rounded-l-none" : ""} ${rightAddon ? "rounded-r-none" : ""} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-gray-400 pointer-events-none">
              {rightIcon}
            </span>
          )}
          {rightAddon && (
            <span className="flex items-center px-3 h-full bg-white/5 border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">
              {rightAddon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
