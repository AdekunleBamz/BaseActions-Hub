"use client";

import { ReactNode } from "react";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  label?: ReactNode;
  labelPosition?: "left" | "center" | "right";
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  variant = "solid",
  label,
  labelPosition = "center",
  className = "",
}: DividerProps) {
  const variantClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  const labelPositionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  if (orientation === "vertical") {
    return (
      <div
        className={`
          h-full w-px bg-white/10
          ${className}
        `}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div
        className={`flex items-center gap-4 ${labelPositionClasses[labelPosition]} ${className}`}
        role="separator"
      >
        {labelPosition !== "left" && (
          <div className={`flex-1 border-t border-white/10 ${variantClasses[variant]}`} />
        )}
        <span className="text-sm text-gray-500 px-2">{label}</span>
        {labelPosition !== "right" && (
          <div className={`flex-1 border-t border-white/10 ${variantClasses[variant]}`} />
        )}
      </div>
    );
  }

  return (
    <hr
      className={`
        border-0 border-t border-white/10
        ${variantClasses[variant]}
        ${className}
      `}
      role="separator"
    />
  );
}
