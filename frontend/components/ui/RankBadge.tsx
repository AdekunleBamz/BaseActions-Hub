"use client";

import { useState } from "react";

interface RankBadgeProps {
  rank: number;
  size?: "sm" | "md" | "lg";
  showAnimation?: boolean;
  className?: string;
}

/**
 * RankBadge - Display ranking position with special styling for top 3
 */
export function RankBadge({
  rank,
  size = "md",
  showAnimation = true,
  className = "",
}: RankBadgeProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const getRankStyle = () => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-br from-yellow-400 to-amber-600",
          shadow: "shadow-lg shadow-yellow-500/30",
          icon: "👑",
          animation: showAnimation ? "animate-pulse" : "",
        };
      case 2:
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-500",
          shadow: "shadow-lg shadow-gray-400/30",
          icon: "🥈",
          animation: "",
        };
      case 3:
        return {
          bg: "bg-gradient-to-br from-amber-600 to-amber-800",
          shadow: "shadow-lg shadow-amber-600/30",
          icon: "🥉",
          animation: "",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-700 to-gray-900",
          shadow: "",
          icon: null,
          animation: "",
        };
    }
  };

  const style = getRankStyle();

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${style.bg}
        ${style.shadow}
        ${style.animation}
        rounded-full
        flex items-center justify-center
        font-bold text-white
        ${className}
      `}
    >
      {style.icon && rank <= 3 ? (
        <span className="text-xs">{style.icon}</span>
      ) : (
        `#${rank}`
      )}
    </div>
  );
}

interface RankChangeProps {
  change: number;
  size?: "sm" | "md" | "lg";
  showAnimation?: boolean;
  className?: string;
}

/**
 * RankChange - Shows rank position change with up/down indicators
 */
export function RankChange({
  change,
  size = "md",
  showAnimation = true,
  className = "",
}: RankChangeProps) {
  const [animating, setAnimating] = useState(showAnimation && change !== 0);

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (change === 0) {
    return (
      <span className={`${sizeClasses[size]} text-gray-500 ${className}`}>
        —
      </span>
    );
  }

  const isPositive = change > 0;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";
  const bgClass = isPositive ? "bg-green-500/10" : "bg-red-500/10";
  const icon = isPositive ? "↑" : "↓";
  const animationClass = animating ? (isPositive ? "animate-bounce" : "animate-pulse") : "";

  return (
    <span
      className={`
        ${sizeClasses[size]}
        ${colorClass}
        ${bgClass}
        ${animationClass}
        inline-flex items-center gap-0.5
        px-1.5 py-0.5 rounded-md
        font-medium
        ${className}
      `}
      onAnimationEnd={() => setAnimating(false)}
    >
      {icon}
      {Math.abs(change)}
    </span>
  );
}

interface UserRankCardProps {
  rank: number;
  previousRank?: number;
  username: string;
  address: string;
  points: number;
  avatarUrl?: string;
  badges?: number;
  isCurrentUser?: boolean;
  onClick?: () => void;
}

/**
 * UserRankCard - Full card showing user rank with details
 */
export function UserRankCard({
  rank,
  previousRank,
  username,
  address,
  points,
  avatarUrl,
  badges = 0,
  isCurrentUser = false,
  onClick,
}: UserRankCardProps) {
  const rankChange = previousRank ? previousRank - rank : 0;
  const isTop3 = rank <= 3;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 rounded-xl
        transition-all duration-300 cursor-pointer
        ${isCurrentUser 
          ? "bg-blue-500/10 border border-blue-500/30 ring-2 ring-blue-500/20" 
          : "glass hover:border-blue-500/20"
        }
        ${isTop3 ? "border-l-4" : ""}
        ${rank === 1 ? "border-l-yellow-500" : ""}
        ${rank === 2 ? "border-l-gray-400" : ""}
        ${rank === 3 ? "border-l-amber-600" : ""}
      `}
    >
      {/* Rank */}
      <RankBadge rank={rank} size="lg" />

      {/* Avatar */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        {badges > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {badges}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white truncate">{username}</h3>
          {isCurrentUser && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>

      {/* Points & Change */}
      <div className="text-right">
        <p className="font-bold text-white">
          {points.toLocaleString()}
          <span className="text-gray-500 text-sm ml-1">pts</span>
        </p>
        {previousRank && <RankChange change={rankChange} size="sm" />}
      </div>
    </div>
  );
}
