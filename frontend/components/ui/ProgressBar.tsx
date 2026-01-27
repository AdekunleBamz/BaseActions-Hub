"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "striped" | "animated";
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

/**
 * ProgressBar - Linear progress indicator
 */
export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  color = "blue",
  showLabel = false,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  };

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  const gradientClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-cyan-400",
    green: "bg-gradient-to-r from-green-500 to-emerald-400",
    yellow: "bg-gradient-to-r from-yellow-500 to-orange-400",
    red: "bg-gradient-to-r from-red-500 to-pink-400",
    purple: "bg-gradient-to-r from-purple-500 to-pink-400",
  };

  const getBarClass = () => {
    if (variant === "gradient") return gradientClasses[color];
    return colorClasses[color];
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`
          w-full ${sizeClasses[size]} rounded-full
          bg-gray-800 overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${getBarClass()}
            ${variant === "striped" ? "bg-striped" : ""}
            ${variant === "animated" ? "bg-striped animate-stripe" : ""}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * CircularProgress - Circular progress indicator
 */
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = "blue",
  showValue = true,
  label,
  className = "",
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    yellow: "stroke-yellow-500",
    red: "stroke-red-500",
    purple: "stroke-purple-500",
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-gray-800"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${colorClasses[color]} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {(showValue || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className="text-lg font-bold text-white">
              {Math.round(percentage)}%
            </span>
          )}
          {label && (
            <span className="text-xs text-gray-400">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * StepProgress - Multi-step progress indicator
 */
interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  variant?: "dots" | "bars" | "numbers";
  className?: string;
}

export function StepProgress({
  currentStep,
  totalSteps,
  labels,
  variant = "bars",
  className = "",
}: StepProgressProps) {
  return (
    <div className={className}>
      {variant === "dots" && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300
                ${i < currentStep
                  ? "bg-blue-500 scale-100"
                  : i === currentStep
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-700"
                }
              `}
            />
          ))}
        </div>
      )}

      {variant === "bars" && (
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`
                h-1 flex-1 rounded-full transition-all duration-300
                ${i <= currentStep ? "bg-blue-500" : "bg-gray-700"}
              `}
            />
          ))}
        </div>
      )}

      {variant === "numbers" && (
        <div className="flex items-center">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-medium text-sm transition-all duration-300
                  ${i < currentStep
                    ? "bg-blue-500 text-white"
                    : i === currentStep
                    ? "bg-blue-500/20 text-blue-400 ring-2 ring-blue-500"
                    : "bg-gray-800 text-gray-500"
                  }
                `}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`
                    w-8 h-0.5 transition-all duration-300
                    ${i < currentStep ? "bg-blue-500" : "bg-gray-700"}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {labels && labels.length > 0 && (
        <div className="flex justify-between mt-2">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`
                text-xs transition-colors
                ${i <= currentStep ? "text-white" : "text-gray-500"}
              `}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * AnimatedProgress - Progress with counting animation
 */
interface AnimatedProgressProps {
  value: number;
  max?: number;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  duration = 1500,
  onComplete,
  className = "",
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const startTime = performance.now();
    const startValue = displayValue;
    const targetValue = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <ProgressBar
      value={displayValue}
      max={max}
      variant="gradient"
      showLabel
      className={className}
    />
  );
}

/**
 * Custom styles for striped progress bars
 */
const stripedStyles = `
  .bg-striped {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }

  @keyframes stripe {
    from {
      background-position: 1rem 0;
    }
    to {
      background-position: 0 0;
    }
  }

  .animate-stripe {
    animation: stripe 1s linear infinite;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleId = "progress-bar-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = stripedStyles;
    document.head.appendChild(style);
  }
}
