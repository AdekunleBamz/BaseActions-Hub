"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  leftIcon,
  rightIcon,
}: LinkButtonProps) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
  };

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const Component = external ? "a" : Link;

  return (
    <Component
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...externalProps}
    >
      {leftIcon}
      {variant === "primary" ? <span>{children}</span> : children}
      {rightIcon}
      {external && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </Component>
  );
}
