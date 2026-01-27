"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "badge" | "avatar";
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  lines = 1,
  animated = true,
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
    badge: "rounded-full",
    avatar: "rounded-full",
  };

  const defaultSizes = {
    text: { width: "100%", height: "1rem" },
    circular: { width: "2rem", height: "2rem" },
    rectangular: { width: "100%", height: "4rem" },
    badge: { width: "4rem", height: "1.5rem" },
    avatar: { width: "2.5rem", height: "2.5rem" },
  };

  const style: React.CSSProperties = {
    width: width || defaultSizes[variant].width,
    height: height || defaultSizes[variant].height,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton ${variantClasses[variant]} ${animated ? "animate-pulse" : ""} ${className}`}
            style={{
              ...style,
              width: i === lines - 1 ? "75%" : style.width, // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${animated ? "" : "opacity-50"} ${className}`}
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

export function BadgeCardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" height={16} className="mb-2" />
          <Skeleton width="80%" height={12} />
        </div>
      </div>
    </div>
  );
}

export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="avatar" width={40} height={40} />
      <div className="flex-1">
        <Skeleton width="40%" height={16} className="mb-1" />
        <Skeleton width="25%" height={12} />
      </div>
      <Skeleton width={60} height={20} />
    </div>
  );
}
