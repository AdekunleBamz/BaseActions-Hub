"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * AnimatedCounter - Smoothly animates number changes
 * Uses easeOutExpo for a satisfying counting effect
 */
export function AnimatedCounter({
  value,
  duration = 1500,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  onComplete,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Easing function: easeOutExpo
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const startValue = previousValue.current;
      const diff = value - startValue;
      const currentValue = startValue + diff * easedProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        previousValue.current = value;
        onComplete?.();
      }
    },
    [value, duration, onComplete]
  );

  useEffect(() => {
    if (value !== previousValue.current) {
      startTimeRef.current = null;
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animate]);

  const formattedValue = displayValue.toFixed(decimals);
  
  // Add thousand separators
  const parts = formattedValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const finalValue = parts.join(".");

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {finalValue}
      {suffix}
    </span>
  );
}

/**
 * AnimatedPercentage - Shows percentage with animated changes
 */
export function AnimatedPercentage({
  value,
  duration = 1000,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedCounter
      value={value}
      duration={duration}
      decimals={1}
      suffix="%"
      className={className}
    />
  );
}

/**
 * AnimatedCurrency - Shows currency with animated changes
 */
export function AnimatedCurrency({
  value,
  duration = 1500,
  currency = "ETH",
  decimals = 4,
  className = "",
}: {
  value: number;
  duration?: number;
  currency?: string;
  decimals?: number;
  className?: string;
}) {
  return (
    <AnimatedCounter
      value={value}
      duration={duration}
      decimals={decimals}
      suffix={` ${currency}`}
      className={className}
    />
  );
}

/**
 * CountUpOnView - Only starts counting when element is in viewport
 */
export function CountUpOnView({
  value,
  duration = 1500,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {isVisible ? (
        <AnimatedCounter
          value={value}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
