"use client";

interface AvatarProps {
  address?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  address,
  src,
  alt = "Avatar",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-[8px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
  };

  // Generate initials from address
  const initials = address ? address.slice(2, 4).toUpperCase() : "??";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white ${className}`}
    >
      {initials}
    </div>
  );
}
