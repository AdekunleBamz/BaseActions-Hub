"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, maxLength, showCount = false, value, className = "", ...props }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && currentLength > maxLength * 0.9;

    return (
      <div className="w-full">
        {(label || showCount) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label className="block text-sm font-medium text-gray-300">
                {label}
              </label>
            )}
            {showCount && maxLength && (
              <span className={`text-xs ${isNearLimit ? "text-orange-400" : "text-gray-500"}`}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          value={value}
          className={`input-modern resize-none ${error ? "border-red-500/50 focus:border-red-500" : ""} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
