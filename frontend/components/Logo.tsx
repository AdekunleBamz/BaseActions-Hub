"use client";

import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = false, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden glow-blue`}>
        <Image
          src="/icon-512.png"
          alt="BaseActions"
          fill
          className="object-cover"
        />
      </div>
      {showText && (
        <span className="text-xl font-bold gradient-text">BaseActions</span>
      )}
    </div>
  );
}
