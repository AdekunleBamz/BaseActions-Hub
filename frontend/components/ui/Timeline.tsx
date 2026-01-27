"use client";

import { useEffect, useRef } from "react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: React.ReactNode;
  status?: "completed" | "active" | "pending";
  metadata?: Record<string, string | number>;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: "default" | "compact" | "detailed";
  showTimestamps?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Timeline - Display chronological events with visual connectors
 */
export function Timeline({
  items,
  variant = "default",
  showTimestamps = true,
  animated = true,
  className = "",
}: TimelineProps) {
  const formatTimestamp = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "completed":
        return {
          dot: "bg-green-500",
          line: "bg-green-500",
          text: "text-green-400",
        };
      case "active":
        return {
          dot: "bg-blue-500 animate-pulse",
          line: "bg-blue-500/50",
          text: "text-blue-400",
        };
      default:
        return {
          dot: "bg-gray-600",
          line: "bg-gray-700",
          text: "text-gray-500",
        };
    }
  };

  return (
    <div className={`relative ${className}`} role="list" aria-label="Timeline">
      {items.map((item, index) => {
        const status = getStatusStyles(item.status);
        const isLast = index === items.length - 1;

        return (
          <TimelineEntry
            key={item.id}
            item={item}
            status={status}
            isLast={isLast}
            variant={variant}
            showTimestamp={showTimestamps}
            formatTimestamp={formatTimestamp}
            animated={animated}
            index={index}
          />
        );
      })}
    </div>
  );
}

interface TimelineEntryProps {
  item: TimelineItem;
  status: { dot: string; line: string; text: string };
  isLast: boolean;
  variant: "default" | "compact" | "detailed";
  showTimestamp: boolean;
  formatTimestamp: (date: Date | string) => string;
  animated: boolean;
  index: number;
}

function TimelineEntry({
  item,
  status,
  isLast,
  variant,
  showTimestamp,
  formatTimestamp,
  animated,
  index,
}: TimelineEntryProps) {
  const entryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !entryRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-x-4");
            entry.target.classList.add("opacity-100", "translate-x-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(entryRef.current);

    return () => observer.disconnect();
  }, [animated]);

  const paddingClass = variant === "compact" ? "pb-4" : "pb-8";
  const dotSize = variant === "compact" ? "w-2 h-2" : "w-3 h-3";

  return (
    <div
      ref={entryRef}
      className={`
        relative flex gap-4 ${!isLast ? paddingClass : ""}
        ${animated ? "opacity-0 translate-x-4 transition-all duration-500" : ""}
      `}
      style={animated ? { transitionDelay: `${index * 100}ms` } : undefined}
      role="listitem"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        {/* Dot or Icon */}
        <div
          className={`
            relative z-10 flex items-center justify-center
            ${item.icon ? "w-10 h-10 rounded-full bg-gray-800 border border-gray-700" : `${dotSize} rounded-full ${status.dot}`}
          `}
        >
          {item.icon}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className={`
              w-0.5 flex-1 mt-2
              ${status.line}
            `}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white truncate">{item.title}</h3>
            {item.description && variant !== "compact" && (
              <p className="mt-1 text-sm text-gray-400">{item.description}</p>
            )}
          </div>

          {showTimestamp && (
            <span className={`text-xs whitespace-nowrap ${status.text}`}>
              {formatTimestamp(item.timestamp)}
            </span>
          )}
        </div>

        {/* Metadata */}
        {item.metadata && variant === "detailed" && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(item.metadata).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-800 text-xs"
              >
                <span className="text-gray-500">{key}:</span>
                <span className="text-gray-300">{value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ActivityTimeline - Specialized timeline for user activity
 */
interface ActivityItem {
  id: string;
  type: "sign" | "badge" | "reaction" | "tip" | "referral" | "streak";
  message: string;
  timestamp: Date | string;
  points?: number;
  txHash?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

export function ActivityTimeline({
  activities,
  maxItems = 10,
  className = "",
}: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    const iconClass = "text-lg";
    switch (type) {
      case "sign":
        return <span className={iconClass}>✍️</span>;
      case "badge":
        return <span className={iconClass}>🏆</span>;
      case "reaction":
        return <span className={iconClass}>❤️</span>;
      case "tip":
        return <span className={iconClass}>💰</span>;
      case "referral":
        return <span className={iconClass}>🔗</span>;
      case "streak":
        return <span className={iconClass}>🔥</span>;
      default:
        return <span className={iconClass}>📌</span>;
    }
  };

  const items: TimelineItem[] = activities.slice(0, maxItems).map((activity) => ({
    id: activity.id,
    title: activity.message,
    description: activity.points ? `+${activity.points} points` : undefined,
    timestamp: activity.timestamp,
    icon: getActivityIcon(activity.type),
    status: "completed" as const,
    metadata: activity.txHash
      ? { tx: `${activity.txHash.slice(0, 6)}...${activity.txHash.slice(-4)}` }
      : undefined,
  }));

  return (
    <Timeline
      items={items}
      variant="compact"
      showTimestamps
      animated
      className={className}
    />
  );
}

/**
 * SignatureTimeline - Timeline showing signature journey
 */
interface SignatureTimelineProps {
  guestbooksCreated: number;
  guestbooksSigned: number;
  totalReactions: number;
  totalTips: number;
  joinDate: Date | string;
  className?: string;
}

export function SignatureTimeline({
  guestbooksCreated,
  guestbooksSigned,
  totalReactions,
  totalTips,
  joinDate,
  className = "",
}: SignatureTimelineProps) {
  const items: TimelineItem[] = [
    {
      id: "joined",
      title: "Joined BaseActions Hub",
      description: "Started your on-chain journey",
      timestamp: joinDate,
      icon: <span className="text-lg">🎉</span>,
      status: "completed",
    },
    ...(guestbooksSigned > 0
      ? [
          {
            id: "first-sign",
            title: `Signed ${guestbooksSigned} guestbook${guestbooksSigned > 1 ? "s" : ""}`,
            description: "Left your mark on-chain",
            timestamp: joinDate, // Would need actual data
            icon: <span className="text-lg">✍️</span>,
            status: "completed" as const,
          },
        ]
      : []),
    ...(guestbooksCreated > 0
      ? [
          {
            id: "created-guestbook",
            title: `Created ${guestbooksCreated} guestbook${guestbooksCreated > 1 ? "s" : ""}`,
            description: "Invited others to sign",
            timestamp: joinDate,
            icon: <span className="text-lg">📖</span>,
            status: "completed" as const,
          },
        ]
      : []),
    ...(totalReactions > 0
      ? [
          {
            id: "reactions",
            title: `Received ${totalReactions} reaction${totalReactions > 1 ? "s" : ""}`,
            description: "Your signatures are loved",
            timestamp: new Date(),
            icon: <span className="text-lg">❤️</span>,
            status: "active" as const,
          },
        ]
      : []),
  ];

  return (
    <Timeline
      items={items}
      variant="detailed"
      showTimestamps
      animated
      className={className}
    />
  );
}
