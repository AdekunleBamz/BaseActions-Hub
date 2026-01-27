"use client";

import { ReactNode, forwardRef } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "bordered" | "elevated" | "interactive";
  onClick?: () => void;
  as?: "div" | "article" | "section";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
  variant = "default",
  onClick,
  as: Component = "div",
}, ref) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const variantClasses = {
    default: "glass",
    bordered: "glass border-2 border-white/10",
    elevated: "glass shadow-xl shadow-black/20",
    interactive: "glass cursor-pointer active:scale-[0.98]",
  };

  const handleClick = onClick ? onClick : undefined;
  const isClickable = !!onClick || variant === "interactive";

  return (
    <Component
      ref={ref}
      onClick={handleClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`
        ${variantClasses[variant]} rounded-2xl
        ${paddingClasses[padding]}
        ${hover ? "hover:border-white/10 hover:-translate-y-1 transition-all duration-300" : ""}
        ${glow ? "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]" : ""}
        ${isClickable ? "focus:outline-none focus:ring-2 focus:ring-blue-500/50" : ""}
        ${className}
      `}
    >
      {children}
    </Component>
  );
});
