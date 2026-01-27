"use client";

import { memo, useMemo } from "react";

interface AvatarProps {
  address?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-6 h-6 text-[8px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
  xl: "w-12 h-12 text-base",
} as const;

// Generate a consistent color based on address for visual differentiation
function getGradientFromAddress(address?: string): string {
  if (!address) return "from-blue-500 to-purple-500";
  
  const hash = address.slice(2, 10);
  const num = parseInt(hash, 16);
  const gradients = [
    "from-blue-500 to-purple-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-yellow-500 to-orange-500",
    "from-cyan-500 to-blue-500",
    "from-violet-500 to-purple-500",
  ];
  
  return gradients[num % gradients.length];
}

export const Avatar = memo(function Avatar({
  address,
  src,
  alt = "Avatar",
  size = "md",
  className = "",
}: AvatarProps) {
  // Generate initials from address - memoized
  const initials = useMemo(
    () => (address ? address.slice(2, 4).toUpperCase() : "??"),
    [address]
  );

  const gradient = useMemo(
    () => getGradientFromAddress(address),
    [address]
  );

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center font-bold text-white ${className}`}
      role="img"
      aria-label={alt}
    >
      {initials}
    </div>
  );
});
