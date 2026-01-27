"use client";

import { useState, useEffect } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  trend?: number[];
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "outlined";
  className?: string;
}

/**
 * StatCard - Display a single statistic
 */
export function StatCard({
  label,
  value,
  change,
  icon,
  trend,
  size = "md",
  variant = "default",
  className = "",
}: StatCardProps) {
  const sizeClasses = {
    sm: {
      container: "p-3",
      value: "text-xl",
      label: "text-xs",
      change: "text-xs",
    },
    md: {
      container: "p-4",
      value: "text-2xl",
      label: "text-sm",
      change: "text-sm",
    },
    lg: {
      container: "p-6",
      value: "text-4xl",
      label: "text-base",
      change: "text-base",
    },
  };

  const variantClasses = {
    default: "bg-white/5 border border-white/10",
    gradient: "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20",
    outlined: "bg-transparent border-2 border-white/20",
  };

  const changeColors = {
    increase: "text-green-400",
    decrease: "text-red-400",
    neutral: "text-gray-400",
  };

  const changeIcons = {
    increase: "↑",
    decrease: "↓",
    neutral: "→",
  };

  return (
    <div
      className={`
        rounded-xl transition-all duration-200
        hover:scale-[1.02] hover:shadow-lg
        ${sizeClasses[size].container}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-gray-400 mb-1 ${sizeClasses[size].label}`}>
            {label}
          </p>
          <p className={`font-bold text-white ${sizeClasses[size].value}`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          
          {change && (
            <p className={`flex items-center gap-1 mt-1 ${changeColors[change.type]} ${sizeClasses[size].change}`}>
              <span>{changeIcons[change.type]}</span>
              <span>{Math.abs(change.value)}%</span>
            </p>
          )}
        </div>

        {icon && (
          <div className="text-2xl opacity-60">{icon}</div>
        )}
      </div>

      {trend && trend.length > 0 && (
        <div className="mt-3 flex items-end gap-0.5 h-8">
          {trend.map((val, i) => {
            const max = Math.max(...trend);
            const height = max > 0 ? (val / max) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 bg-blue-500/30 rounded-t transition-all"
                style={{ height: `${Math.max(height, 10)}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * StatGrid - Grid of stat cards
 */
interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ children, columns = 4, className = "" }: StatGridProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${columnClasses[columns]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * CounterStat - Animated counting stat
 */
interface CounterStatProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function CounterStat({
  label,
  value,
  suffix = "",
  prefix = "",
  duration = 1500,
  decimals = 0,
  className = "",
}: CounterStatProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <div className={`text-center ${className}`}>
      <p className="text-4xl font-bold text-white">
        {prefix}
        {displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        {suffix}
      </p>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  );
}

/**
 * StatComparison - Compare two values
 */
interface StatComparisonProps {
  label: string;
  current: number;
  previous: number;
  format?: (val: number) => string;
  className?: string;
}

export function StatComparison({
  label,
  current,
  previous,
  format = (val) => val.toLocaleString(),
  className = "",
}: StatComparisonProps) {
  const diff = current - previous;
  const percentChange = previous !== 0 ? ((diff / previous) * 100) : 0;
  const isPositive = diff > 0;

  return (
    <div className={`p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{format(current)}</p>
          <p className="text-sm text-gray-500">vs {format(previous)}</p>
        </div>
        
        <div className={`text-right ${isPositive ? "text-green-400" : "text-red-400"}`}>
          <p className="text-lg font-medium">
            {isPositive ? "+" : ""}{format(diff)}
          </p>
          <p className="text-sm">
            {isPositive ? "↑" : "↓"} {Math.abs(percentChange).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * LeaderboardStat - Stat card for leaderboard display
 */
interface LeaderboardStatProps {
  rank: number;
  address: string;
  value: number;
  valueLabel?: string;
  avatarUrl?: string;
  highlight?: boolean;
  className?: string;
}

export function LeaderboardStat({
  rank,
  address,
  value,
  valueLabel = "points",
  avatarUrl,
  highlight = false,
  className = "",
}: LeaderboardStatProps) {
  const getRankEmoji = () => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl transition-all
        ${highlight
          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
          : "bg-white/5 border border-white/10"
        }
        ${className}
      `}
    >
      <div className="text-2xl font-bold w-12 text-center">
        {getRankEmoji()}
      </div>

      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {address.slice(2, 4)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <p className="text-sm text-gray-400">
          {value.toLocaleString()} {valueLabel}
        </p>
      </div>
    </div>
  );
}

/**
 * MiniStat - Compact inline stat
 */
interface MiniStatProps {
  icon?: React.ReactNode;
  value: string | number;
  label?: string;
  className?: string;
}

export function MiniStat({ icon, value, label, className = "" }: MiniStatProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="font-medium text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      {label && <span className="text-gray-500">{label}</span>}
    </div>
  );
}

/**
 * StreakStat - Display streak information
 */
interface StreakStatProps {
  current: number;
  best: number;
  isActive?: boolean;
  className?: string;
}

export function StreakStat({
  current,
  best,
  isActive = true,
  className = "",
}: StreakStatProps) {
  return (
    <div className={`p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400">Current Streak</span>
        {isActive && (
          <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
            Active
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">{current}</span>
        <span className="text-gray-400">days</span>
        <span className="text-2xl ml-1">🔥</span>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">Best: {best} days</span>
        {current >= best && current > 0 && (
          <span className="text-yellow-400">🏆 New Record!</span>
        )}
      </div>
    </div>
  );
}
