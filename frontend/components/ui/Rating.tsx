"use client";

import { forwardRef, useState } from "react";

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  allowHalf?: boolean;
  showValue?: boolean;
  icon?: "star" | "heart" | "fire";
  className?: string;
}

const StarIcon = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="half-fill">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={half ? "url(#half-fill)" : filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FireIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2c.4 4.26 4 6.5 4 10 0 3.5-2.24 6-5 6-2.76 0-5-2.5-5-6 0-6 6-10 6-10z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      max = 5,
      onChange,
      readOnly = false,
      disabled = false,
      size = "md",
      allowHalf = false,
      showValue = false,
      icon = "star",
      className,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const value = controlledValue ?? internalValue;
    const displayValue = hoverValue ?? value;

    const sizeStyles = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    const iconColors = {
      star: "text-yellow-400",
      heart: "text-red-400",
      fire: "text-orange-400",
    };

    const handleClick = (index: number, isHalf: boolean) => {
      if (readOnly || disabled) return;
      
      const newValue = allowHalf && isHalf ? index + 0.5 : index + 1;
      
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleMouseMove = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly || disabled) return;

      if (allowHalf) {
        const rect = e.currentTarget.getBoundingClientRect();
        const isHalf = e.clientX - rect.left < rect.width / 2;
        setHoverValue(isHalf ? index + 0.5 : index + 1);
      } else {
        setHoverValue(index + 1);
      }
    };

    const handleMouseLeave = () => {
      setHoverValue(null);
    };

    const renderIcon = (index: number) => {
      const filled = displayValue >= index + 1;
      const half = allowHalf && displayValue === index + 0.5;

      switch (icon) {
        case "heart":
          return <HeartIcon filled={filled} />;
        case "fire":
          return <FireIcon filled={filled} />;
        default:
          return <StarIcon filled={filled} half={half} />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }).map((_, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            className={cn(
              sizeStyles[size],
              iconColors[icon],
              "transition-transform",
              !readOnly && !disabled && "hover:scale-110 cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed",
              readOnly && "cursor-default"
            )}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const isHalf = e.clientX - rect.left < rect.width / 2;
              handleClick(index, isHalf);
            }}
            onMouseMove={(e) => handleMouseMove(index, e)}
            aria-label={`Rate ${index + 1} out of ${max}`}
          >
            {renderIcon(index)}
          </button>
        ))}
        {showValue && (
          <span className="ml-2 text-sm text-gray-400">
            {displayValue.toFixed(allowHalf ? 1 : 0)} / {max}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";
