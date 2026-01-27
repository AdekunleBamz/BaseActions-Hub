"use client";

import { forwardRef, TextareaHTMLAttributes, useState, useCallback } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
  isRequired?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  variant?: "default" | "filled" | "flushed";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    hint, 
    maxLength, 
    showCount = false, 
    value, 
    className = "", 
    isRequired,
    autoResize = false,
    minRows = 3,
    maxRows = 10,
    variant = "default",
    onChange,
    ...props 
  }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && currentLength > maxLength * 0.9;
    const isOverLimit = maxLength && currentLength > maxLength;

    const variantClasses = {
      default: "input-modern",
      filled: "input-modern bg-white/10",
      flushed: "bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 focus:border-blue-500 focus:ring-0",
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const textarea = e.target;
        textarea.style.height = "auto";
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
        const minHeight = minRows * lineHeight;
        const maxHeight = maxRows * lineHeight;
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
      onChange?.(e);
    }, [autoResize, minRows, maxRows, onChange]);

    return (
      <div className="w-full">
        {(label || showCount) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label className="block text-sm font-medium text-gray-300">
                {label}
                {isRequired && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
            {showCount && maxLength && (
              <span className={`text-xs transition-colors ${isOverLimit ? "text-red-400 font-semibold" : isNearLimit ? "text-orange-400" : "text-gray-500"}`}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          rows={minRows}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
          className={`${variantClasses[variant]} resize-none ${error || isOverLimit ? "border-red-500/50 focus:border-red-500" : ""} ${className}`}
          {...props}
        />
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

Textarea.displayName = "Textarea";
