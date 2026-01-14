"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        glass rounded-2xl
        ${paddingClasses[padding]}
        ${hover ? "hover:border-white/10 hover:-translate-y-1 transition-all duration-300" : ""}
        ${glow ? "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
