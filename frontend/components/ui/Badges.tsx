"use client";

import React from "react";

// ============================================================================
// BADGE VARIANTS
// ============================================================================

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";
type BadgeSize = "xs" | "sm" | "md" | "lg";
type BadgeStyle = "solid" | "soft" | "outline" | "ghost";

interface BadgeV2Props {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: BadgeStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantColors: Record<BadgeVariant, Record<BadgeStyle, string>> = {
  default: {
    solid: "bg-gray-600 text-white",
    soft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
    ghost: "text-gray-600 dark:text-gray-400",
  },
  primary: {
    solid: "bg-primary-500 text-white",
    soft: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    outline: "border border-primary-500 text-primary-600 dark:text-primary-400",
    ghost: "text-primary-600 dark:text-primary-400",
  },
  secondary: {
    solid: "bg-secondary-500 text-white",
    soft: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300",
    outline: "border border-secondary-500 text-secondary-600 dark:text-secondary-400",
    ghost: "text-secondary-600 dark:text-secondary-400",
  },
  success: {
    solid: "bg-green-500 text-white",
    soft: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    outline: "border border-green-500 text-green-600 dark:text-green-400",
    ghost: "text-green-600 dark:text-green-400",
  },
  warning: {
    solid: "bg-yellow-500 text-white",
    soft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    outline: "border border-yellow-500 text-yellow-600 dark:text-yellow-400",
    ghost: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    solid: "bg-red-500 text-white",
    soft: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    outline: "border border-red-500 text-red-600 dark:text-red-400",
    ghost: "text-red-600 dark:text-red-400",
  },
  info: {
    solid: "bg-blue-500 text-white",
    soft: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    outline: "border border-blue-500 text-blue-600 dark:text-blue-400",
    ghost: "text-blue-600 dark:text-blue-400",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "text-[10px] px-1.5 py-0.5 gap-0.5",
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
  lg: "text-base px-3 py-1.5 gap-2",
};

export function BadgeV2({
  children,
  variant = "default",
  size = "sm",
  style = "soft",
  icon,
  iconPosition = "left",
  removable = false,
  onRemove,
  dot = false,
  pulse = false,
  className = "",
}: BadgeV2Props) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantColors[variant][style]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "success" ? "bg-green-400" :
              variant === "error" ? "bg-red-400" :
              variant === "warning" ? "bg-yellow-400" :
              variant === "info" ? "bg-blue-400" :
              variant === "primary" ? "bg-primary-400" :
              "bg-gray-400"
            }`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            variant === "success" ? "bg-green-500" :
            variant === "error" ? "bg-red-500" :
            variant === "warning" ? "bg-yellow-500" :
            variant === "info" ? "bg-blue-500" :
            variant === "primary" ? "bg-primary-500" :
            "bg-gray-500"
          }`} />
        </span>
      )}
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 ml-0.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none"
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
}

// ============================================================================
// STATUS BADGE
// ============================================================================

type StatusType = "online" | "offline" | "away" | "busy" | "dnd";

interface StatusBadgeProps {
  status: StatusType;
  label?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  online: { color: "bg-green-500", label: "Online" },
  offline: { color: "bg-gray-400", label: "Offline" },
  away: { color: "bg-yellow-500", label: "Away" },
  busy: { color: "bg-orange-500", label: "Busy" },
  dnd: { color: "bg-red-500", label: "Do Not Disturb" },
};

export function StatusBadge({
  status,
  label = false,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const dotSize = size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`${dotSize} ${config.color} rounded-full ${status === "online" ? "animate-pulse" : ""}`} />
      {label && (
        <span className={`text-gray-600 dark:text-gray-400 ${
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
        }`}>
          {config.label}
        </span>
      )}
    </span>
  );
}

// ============================================================================
// COUNTER BADGE
// ============================================================================

interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  showZero?: boolean;
  className?: string;
}

export function CounterBadge({
  count,
  max = 99,
  variant = "error",
  size = "sm",
  showZero = false,
  className = "",
}: CounterBadgeProps) {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  const sizeClasses = {
    sm: "min-w-[18px] h-[18px] text-[10px] px-1",
    md: "min-w-[22px] h-[22px] text-xs px-1.5",
    lg: "min-w-[26px] h-[26px] text-sm px-2",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center font-bold rounded-full
        ${variantColors[variant].solid}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {displayCount}
    </span>
  );
}

// ============================================================================
// ICON BADGE (Badge with just an icon)
// ============================================================================

interface IconBadgeProps {
  icon: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  className?: string;
}

export function IconBadge({
  icon,
  variant = "primary",
  size = "md",
  rounded = true,
  className = "",
}: IconBadgeProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${variantColors[variant].soft}
        ${sizeClasses[size]}
        ${rounded ? "rounded-full" : "rounded-lg"}
        ${className}
      `}
    >
      {icon}
    </span>
  );
}

// ============================================================================
// NFT BADGE (Rarity-based badge for NFTs)
// ============================================================================

type RarityLevel = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

interface NFTBadgeProps {
  rarity: RarityLevel;
  label?: string;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
  className?: string;
}

const rarityStyles: Record<RarityLevel, { bg: string; text: string; glow: string }> = {
  common: {
    bg: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-700 dark:text-gray-300",
    glow: "",
  },
  uncommon: {
    bg: "bg-green-200 dark:bg-green-900/50",
    text: "text-green-700 dark:text-green-300",
    glow: "shadow-green-500/20",
  },
  rare: {
    bg: "bg-blue-200 dark:bg-blue-900/50",
    text: "text-blue-700 dark:text-blue-300",
    glow: "shadow-blue-500/30",
  },
  epic: {
    bg: "bg-purple-200 dark:bg-purple-900/50",
    text: "text-purple-700 dark:text-purple-300",
    glow: "shadow-purple-500/40",
  },
  legendary: {
    bg: "bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-900/50 dark:to-orange-900/50",
    text: "text-yellow-700 dark:text-yellow-300",
    glow: "shadow-yellow-500/50",
  },
  mythic: {
    bg: "bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 dark:from-pink-900/50 dark:via-purple-900/50 dark:to-indigo-900/50",
    text: "text-pink-700 dark:text-pink-300",
    glow: "shadow-pink-500/50",
  },
};

export function NFTBadge({
  rarity,
  label,
  size = "md",
  showGlow = true,
  className = "",
}: NFTBadgeProps) {
  const styles = rarityStyles[rarity];
  const displayLabel = label || rarity.charAt(0).toUpperCase() + rarity.slice(1);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full
        ${styles.bg} ${styles.text}
        ${showGlow && rarity !== "common" ? `shadow-lg ${styles.glow}` : ""}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {(rarity === "legendary" || rarity === "mythic") && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {displayLabel}
    </span>
  );
}

// ============================================================================
// VERIFIED BADGE
// ============================================================================

interface VerifiedBadgeProps {
  verified?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({
  verified = true,
  size = "md",
  showLabel = false,
  className = "",
}: VerifiedBadgeProps) {
  if (!verified) return null;

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";

  return (
    <span className={`inline-flex items-center gap-1 text-blue-500 ${className}`}>
      <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {showLabel && (
        <span className={`font-medium ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}`}>
          Verified
        </span>
      )}
    </span>
  );
}

// ============================================================================
// BADGE GROUP
// ============================================================================

interface BadgeGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: BadgeSize;
  className?: string;
}

export function BadgeGroup({
  children,
  max,
  size = "sm",
  className = "",
}: BadgeGroupProps) {
  const childArray = React.Children.toArray(children);
  const displayChildren = max ? childArray.slice(0, max) : childArray;
  const remaining = max ? childArray.length - max : 0;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {displayChildren}
      {remaining > 0 && (
        <BadgeV2 variant="default" size={size} style="soft">
          +{remaining}
        </BadgeV2>
      )}
    </div>
  );
}

export default BadgeV2;
