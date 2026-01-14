"use client";

interface GradientOrbProps {
  color: "blue" | "purple" | "cyan";
  size?: "sm" | "md" | "lg";
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
}

export function GradientOrb({ color, size = "md", position, delay = 0 }: GradientOrbProps) {
  const colorClasses = {
    blue: "bg-blue-500/40",
    purple: "bg-purple-500/40",
    cyan: "bg-cyan-500/30",
  };

  const sizeClasses = {
    sm: "w-64 h-64",
    md: "w-80 h-80",
    lg: "w-96 h-96",
  };

  return (
    <div
      className={`orb ${colorClasses[color]} ${sizeClasses[size]} animate-pulse-glow`}
      style={{
        ...position,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export function HeroBackground() {
  return (
    <>
      <GradientOrb color="blue" size="lg" position={{ top: "-12rem", left: "-12rem" }} />
      <GradientOrb color="purple" size="md" position={{ top: "5rem", right: "0" }} delay={1} />
      <GradientOrb color="cyan" size="sm" position={{ bottom: "0", left: "25%" }} delay={2} />
    </>
  );
}
