"use client";

interface StatusIndicatorProps {
  status: "online" | "offline" | "busy" | "away" | "pending";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  size = "md",
  pulse = false,
  label,
  showLabel = false,
  className = "",
}: StatusIndicatorProps) {
  const statusConfig = {
    online: { color: "bg-green-500", label: "Online" },
    offline: { color: "bg-gray-500", label: "Offline" },
    busy: { color: "bg-red-500", label: "Busy" },
    away: { color: "bg-yellow-500", label: "Away" },
    pending: { color: "bg-blue-500", label: "Pending" },
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex">
        <span
          className={`${sizeClasses[size]} ${config.color} rounded-full`}
          aria-hidden="true"
        />
        {pulse && status === "online" && (
          <span
            className={`absolute ${sizeClasses[size]} ${config.color} rounded-full animate-ping opacity-75`}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-sm text-gray-400">{displayLabel}</span>
      )}
      <span className="sr-only">{displayLabel}</span>
    </span>
  );
}
