"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "purple" | "green" | "orange" | "cyan" | "red";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "blue",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    blue: "badge-blue",
    purple: "badge-purple",
    green: "badge-green",
    orange: "badge-orange",
    cyan: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span
      className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
