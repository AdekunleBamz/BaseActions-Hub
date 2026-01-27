"use client";

import { useEffect, useState, useRef } from "react";
import { StatCard } from "./Layout";
import { StatCardSkeleton } from "./ui/Skeleton";
import { useIntersectionObserver } from "@/hooks";

interface StatsGridProps {
  stats: Array<{
    value: string | number;
    label: string;
    icon: string;
    color: "blue" | "purple" | "green" | "orange" | "cyan";
    suffix?: string;
    prefix?: string;
  }>;
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  animated?: boolean;
  staggerDelay?: number;
}

function AnimatedValue({ 
  value, 
  prefix = "", 
  suffix = "",
  shouldAnimate 
}: { 
  value: string | number; 
  prefix?: string;
  suffix?: string;
  shouldAnimate: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) || 0 : value;

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayValue(numericValue);
      return;
    }

    const duration = 1000;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo for snappy feel
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(startValue + (numericValue - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    requestAnimationFrame(animate);
  }, [numericValue, shouldAnimate]);

  // Format with commas
  const formatted = displayValue.toLocaleString();

  return <>{prefix}{formatted}{suffix}</>;
}

export function StatsGrid({ 
  stats, 
  isLoading, 
  columns = 3,
  animated = true,
  staggerDelay = 100,
}: StatsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(gridRef, { threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {[...Array(columns)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className={`grid ${gridClasses[columns]} gap-4 ${animated ? "stagger-children" : ""}`}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={animated ? { animationDelay: `${i * staggerDelay}ms` } : undefined}
        >
          <StatCard
            value={
              animated && hasAnimated ? (
                <AnimatedValue 
                  value={stat.value} 
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  shouldAnimate={hasAnimated}
                />
              ) : (
                `${stat.prefix || ""}${stat.value}${stat.suffix || ""}`
              )
            }
            label={stat.label}
            icon={stat.icon}
            color={stat.color}
          />
        </div>
      ))}
    </div>
  );
}
