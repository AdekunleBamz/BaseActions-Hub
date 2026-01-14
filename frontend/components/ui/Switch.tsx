"use client";

import { forwardRef } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      checked,
      onChange,
      label,
      description,
      disabled = false,
      size = "md",
      className = "",
    },
    ref
  ) {
    const sizeConfig = {
      sm: {
        track: "w-8 h-4",
        thumb: "w-3 h-3",
        translate: "translate-x-4",
      },
      md: {
        track: "w-11 h-6",
        thumb: "w-5 h-5",
        translate: "translate-x-5",
      },
      lg: {
        track: "w-14 h-7",
        thumb: "w-6 h-6",
        translate: "translate-x-7",
      },
    };

    const config = sizeConfig[size];

    return (
      <div className={`flex items-center ${className}`}>
        <button
          ref={ref}
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex flex-shrink-0 ${config.track}
            border-2 border-transparent rounded-full cursor-pointer
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
            ${checked ? "bg-blue-500" : "bg-gray-600"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block ${config.thumb}
              rounded-full bg-white shadow-lg
              transform transition duration-200 ease-in-out
              ${checked ? config.translate : "translate-x-0"}
            `}
          />
        </button>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span
                className={`text-sm font-medium ${disabled ? "text-gray-500" : "text-white"}`}
              >
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
