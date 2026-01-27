"use client";

import { forwardRef } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      onChange,
      label,
      description,
      disabled = false,
      indeterminate = false,
      error,
      size = "md",
      className = "",
    },
    ref
  ) {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const iconSizes = {
      sm: "w-3 h-3",
      md: "w-3.5 h-3.5",
      lg: "w-4 h-4",
    };

    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="sr-only"
              aria-describedby={description ? "checkbox-description" : undefined}
            />
            <div
              onClick={() => !disabled && onChange(!checked)}
              className={`
                ${sizeClasses[size]}
                rounded border-2 cursor-pointer
                transition-all duration-200
                flex items-center justify-center
                ${checked || indeterminate
                  ? "bg-blue-500 border-blue-500"
                  : "bg-transparent border-gray-500 hover:border-gray-400"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${error ? "border-red-500" : ""}
                focus-within:ring-2 focus-within:ring-blue-500/50
              `}
            >
              {checked && !indeterminate && (
                <svg
                  className={`${iconSizes[size]} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {indeterminate && (
                <svg
                  className={`${iconSizes[size]} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 12h14"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                className={`text-sm font-medium cursor-pointer ${
                  disabled ? "text-gray-500" : "text-white"
                }`}
                onClick={() => !disabled && onChange(!checked)}
              >
                {label}
              </label>
            )}
            {description && (
              <p id="checkbox-description" className="text-xs text-gray-500 mt-0.5">
                {description}
              </p>
            )}
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
