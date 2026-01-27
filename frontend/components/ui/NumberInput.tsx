"use client";

import { forwardRef, useState, useCallback } from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  isRequired?: boolean;
  precision?: number;
  showStepper?: boolean;
  className?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      label,
      error,
      hint,
      disabled = false,
      isRequired,
      precision = 0,
      showStepper = true,
      className = "",
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const clamp = useCallback(
      (val: number): number => {
        let result = val;
        if (min !== undefined) result = Math.max(min, result);
        if (max !== undefined) result = Math.min(max, result);
        return Number(result.toFixed(precision));
      },
      [min, max, precision]
    );

    const handleIncrement = () => {
      if (disabled) return;
      onChange(clamp(value + step));
    };

    const handleDecrement = () => {
      if (disabled) return;
      onChange(clamp(value - step));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        onChange(clamp(newValue));
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      onChange(clamp(value));
    };

    const isAtMin = min !== undefined && value <= min;
    const isAtMax = max !== undefined && value >= max;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className={`relative flex ${showStepper ? "" : ""}`}>
          {showStepper && (
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || isAtMin}
              className={`
                px-3 py-2 bg-white/5 border border-r-0 border-white/10 rounded-l-xl
                text-gray-400 hover:bg-white/10 hover:text-white transition-colors
                ${disabled || isAtMin ? "opacity-50 cursor-not-allowed" : ""}
              `}
              aria-label="Decrease"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          )}
          <input
            ref={ref}
            type="number"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={`
              input-modern flex-1 text-center
              ${showStepper ? "rounded-none" : ""}
              ${error ? "border-red-500/50 focus:border-red-500" : ""}
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            `}
          />
          {showStepper && (
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || isAtMax}
              className={`
                px-3 py-2 bg-white/5 border border-l-0 border-white/10 rounded-r-xl
                text-gray-400 hover:bg-white/10 hover:text-white transition-colors
                ${disabled || isAtMax ? "opacity-50 cursor-not-allowed" : ""}
              `}
              aria-label="Increase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);
