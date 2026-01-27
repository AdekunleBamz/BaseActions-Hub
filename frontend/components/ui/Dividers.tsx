"use client";

import React from "react";

// ============================================================================
// DIVIDER VARIANTS
// ============================================================================

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted" | "gradient";
  thickness?: "thin" | "default" | "thick";
  color?: "default" | "primary" | "muted" | "accent";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Divider({
  className = "",
  orientation = "horizontal",
  variant = "solid",
  thickness = "default",
  color = "default",
  spacing = "md",
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  const thicknessStyles = {
    thin: isHorizontal ? "h-px" : "w-px",
    default: isHorizontal ? "h-0.5" : "w-0.5",
    thick: isHorizontal ? "h-1" : "w-1",
  };

  const colorStyles = {
    default: "bg-gray-200 dark:bg-gray-700",
    primary: "bg-primary-500/30",
    muted: "bg-gray-100 dark:bg-gray-800",
    accent: "bg-gradient-to-r from-primary-500 to-accent-500",
  };

  const variantStyles = {
    solid: "",
    dashed: "border-t border-dashed border-gray-300 dark:border-gray-600 bg-transparent",
    dotted: "border-t border-dotted border-gray-300 dark:border-gray-600 bg-transparent",
    gradient: "bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent",
  };

  const spacingStyles = {
    none: "",
    sm: isHorizontal ? "my-2" : "mx-2",
    md: isHorizontal ? "my-4" : "mx-4",
    lg: isHorizontal ? "my-6" : "mx-6",
    xl: isHorizontal ? "my-8" : "mx-8",
  };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`
        ${isHorizontal ? "w-full" : "h-full"}
        ${thicknessStyles[thickness]}
        ${variant === "solid" || variant === "gradient" ? colorStyles[color] : ""}
        ${variantStyles[variant]}
        ${spacingStyles[spacing]}
        ${className}
      `}
    />
  );
}

// ============================================================================
// TEXT DIVIDER
// ============================================================================

interface TextDividerProps {
  children: React.ReactNode;
  className?: string;
  lineClassName?: string;
}

export function TextDivider({
  children,
  className = "",
  lineClassName = "",
}: TextDividerProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        className={`flex-1 h-px bg-gray-200 dark:bg-gray-700 ${lineClassName}`}
      />
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {children}
      </span>
      <div
        className={`flex-1 h-px bg-gray-200 dark:bg-gray-700 ${lineClassName}`}
      />
    </div>
  );
}

// ============================================================================
// SECTION DIVIDER
// ============================================================================

interface SectionDividerProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionDivider({
  title,
  subtitle,
  action,
  className = "",
}: SectionDividerProps) {
  return (
    <div className={`relative py-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
      </div>
      {(title || action) && (
        <div className="relative flex justify-center">
          <div className="bg-white dark:bg-gray-900 px-4 flex items-center gap-4">
            {title && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {action}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DOT DIVIDER
// ============================================================================

interface DotDividerProps {
  count?: number;
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "muted";
  className?: string;
}

export function DotDivider({
  count = 3,
  size = "md",
  color = "default",
  className = "",
}: DotDividerProps) {
  const sizeStyles = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  const colorStyles = {
    default: "bg-gray-300 dark:bg-gray-600",
    primary: "bg-primary-500",
    muted: "bg-gray-200 dark:bg-gray-700",
  };

  return (
    <div className={`flex items-center justify-center gap-2 py-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full ${sizeStyles[size]} ${colorStyles[color]}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// WAVE DIVIDER (SVG)
// ============================================================================

interface WaveDividerProps {
  className?: string;
  flip?: boolean;
  color?: string;
}

export function WaveDivider({
  className = "",
  flip = false,
  color = "currentColor",
}: WaveDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16 lg:h-20"
        fill={color}
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
      </svg>
    </div>
  );
}

// ============================================================================
// ZIGZAG DIVIDER
// ============================================================================

interface ZigzagDividerProps {
  className?: string;
  color?: "default" | "primary" | "muted";
}

export function ZigzagDivider({
  className = "",
  color = "default",
}: ZigzagDividerProps) {
  const colorStyles = {
    default: "text-gray-300 dark:text-gray-600",
    primary: "text-primary-500/50",
    muted: "text-gray-200 dark:text-gray-700",
  };

  return (
    <div className={`w-full overflow-hidden ${colorStyles[color]} ${className}`}>
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="w-full h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0,5 L5,0 L10,5 L15,0 L20,5 L25,0 L30,5 L35,0 L40,5 L45,0 L50,5 L55,0 L60,5 L65,0 L70,5 L75,0 L80,5 L85,0 L90,5 L95,0 L100,5" />
      </svg>
    </div>
  );
}

// ============================================================================
// ICON DIVIDER
// ============================================================================

interface IconDividerProps {
  icon: React.ReactNode;
  className?: string;
}

export function IconDivider({ icon, className = "" }: IconDividerProps) {
  return (
    <div className={`flex items-center gap-4 py-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-700" />
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-700" />
    </div>
  );
}

// ============================================================================
// SPACER (Non-visual divider)
// ============================================================================

interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  axis?: "horizontal" | "vertical";
}

export function Spacer({ size = "md", axis = "vertical" }: SpacerProps) {
  const sizeMap = {
    xs: "1",
    sm: "2",
    md: "4",
    lg: "8",
    xl: "12",
    "2xl": "16",
  };

  const dimension = sizeMap[size];
  const isVertical = axis === "vertical";

  return (
    <div
      className={isVertical ? `h-${dimension}` : `w-${dimension}`}
      aria-hidden="true"
      style={{
        [isVertical ? "height" : "width"]: `${parseInt(dimension) * 0.25}rem`,
      }}
    />
  );
}

export default Divider;
