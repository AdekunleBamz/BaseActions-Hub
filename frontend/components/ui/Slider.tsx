"use client";

import { forwardRef, useState, useRef, useEffect, useCallback } from "react";

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      disabled = false,
      showValue = false,
      showMinMax = false,
      formatValue = (v) => v.toString(),
      label,
      className,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internalValue;
    const percentage = ((value - min) / (max - min)) * 100;

    const updateValue = useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        if (controlledValue === undefined) {
          setInternalValue(clampedValue);
        }
        onChange?.(clampedValue);
      },
      [min, max, step, disabled, controlledValue, onChange]
    );

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(e.clientX);
    };

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        updateValue(e.clientX);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, updateValue]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = value;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          newValue = Math.min(max, value + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          newValue = Math.max(min, value - step);
          break;
        case "Home":
          newValue = min;
          break;
        case "End":
          newValue = max;
          break;
        default:
          return;
      }

      e.preventDefault();
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && <span className="text-sm text-gray-400">{label}</span>}
            {showValue && (
              <span className="text-sm font-medium text-white">
                {formatValue(value)}
              </span>
            )}
          </div>
        )}
        <div
          ref={trackRef}
          className={cn(
            "relative h-2 bg-white/10 rounded-full cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onMouseDown={handleMouseDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          {/* Fill */}
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
          {/* Thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-transform",
              isDragging && "scale-125",
              !disabled && "hover:scale-110"
            )}
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        </div>
        {showMinMax && (
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{formatValue(min)}</span>
            <span className="text-xs text-gray-500">{formatValue(max)}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";
