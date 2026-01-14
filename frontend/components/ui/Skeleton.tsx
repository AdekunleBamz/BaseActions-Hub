"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "text" ? "1rem" : undefined),
  };

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function SignatureCardSkeleton() {
  return (
    <div className="signature-card animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width={50} height={12} />
      </div>
      <Skeleton height={20} className="mb-2" />
      <Skeleton width="60%" height={20} />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton width={60} height={32} className="mb-2" />
          <Skeleton width={80} height={14} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
    </div>
  );
}
