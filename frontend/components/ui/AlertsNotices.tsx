"use client";

import { useState, useEffect } from "react";

interface AlertBannerProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

/**
 * AlertBanner - Full-width alert banner
 */
export function AlertBanner({
  type,
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
  icon,
  className = "",
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const typeStyles = {
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: icon || "ℹ️",
      iconColor: "text-blue-400",
    },
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: icon || "✓",
      iconColor: "text-green-400",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: icon || "⚠️",
      iconColor: "text-yellow-400",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: icon || "✕",
      iconColor: "text-red-400",
    },
  };

  const styles = typeStyles[type];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        flex items-center gap-4 px-4 py-3
        ${styles.bg} ${styles.border} border rounded-xl
        ${className}
      `}
    >
      <span className={`text-xl ${styles.iconColor}`}>{styles.icon}</span>

      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-white">{title}</p>}
        <p className={`text-gray-300 ${title ? "text-sm" : ""}`}>{message}</p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          {action.label}
        </button>
      )}

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * InlineAlert - Compact inline alert
 */
interface InlineAlertProps {
  type: "info" | "success" | "warning" | "error";
  message: string;
  className?: string;
}

export function InlineAlert({ type, message, className = "" }: InlineAlertProps) {
  const typeStyles = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
  };

  const icons = {
    info: "ℹ️",
    success: "✓",
    warning: "⚠️",
    error: "✕",
  };

  return (
    <p className={`flex items-center gap-2 text-sm ${typeStyles[type]} ${className}`}>
      <span>{icons[type]}</span>
      {message}
    </p>
  );
}

/**
 * InfoBox - Information box with optional expandable content
 */
interface InfoBoxProps {
  title: string;
  content: string;
  expandedContent?: string;
  icon?: React.ReactNode;
  variant?: "default" | "highlighted";
  className?: string;
}

export function InfoBox({
  title,
  content,
  expandedContent,
  icon = "💡",
  variant = "default",
  className = "",
}: InfoBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variantClasses = {
    default: "bg-white/5 border border-white/10",
    highlighted: "bg-blue-500/10 border border-blue-500/30",
  };

  return (
    <div className={`p-4 rounded-xl ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white">{title}</h4>
          <p className="text-gray-400 text-sm mt-1">{content}</p>
          
          {expandedContent && (
            <>
              {isExpanded && (
                <p className="text-gray-400 text-sm mt-2">{expandedContent}</p>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 text-sm mt-2 hover:text-blue-300"
              >
                {isExpanded ? "Show less" : "Learn more"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Callout - Highlighted callout box
 */
interface CalloutProps {
  type: "note" | "tip" | "important" | "warning";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ type, title, children, className = "" }: CalloutProps) {
  const typeStyles = {
    note: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      accent: "bg-blue-500",
      icon: "📝",
      defaultTitle: "Note",
    },
    tip: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      accent: "bg-green-500",
      icon: "💡",
      defaultTitle: "Tip",
    },
    important: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      accent: "bg-purple-500",
      icon: "⭐",
      defaultTitle: "Important",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      accent: "bg-yellow-500",
      icon: "⚠️",
      defaultTitle: "Warning",
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`
        relative pl-4 py-3 pr-4 rounded-r-xl
        ${styles.bg} ${styles.border} border-l-4
        ${className}
      `}
      style={{ borderLeftColor: styles.accent.replace("bg-", "") }}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accent} rounded-l`}
      />
      <div className="flex items-start gap-2">
        <span>{styles.icon}</span>
        <div>
          <p className="font-medium text-white">
            {title || styles.defaultTitle}
          </p>
          <div className="text-gray-300 text-sm mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * AnnouncementBar - Top of page announcement
 */
interface AnnouncementBarProps {
  message: string;
  link?: { href: string; label: string };
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: "default" | "gradient";
  className?: string;
}

export function AnnouncementBar({
  message,
  link,
  dismissible = true,
  onDismiss,
  variant = "default",
  className = "",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variantClasses = {
    default: "bg-blue-500",
    gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
  };

  return (
    <div
      className={`
        flex items-center justify-center gap-4 px-4 py-2 text-sm
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <span className="text-white">{message}</span>
      
      {link && (
        <a
          href={link.href}
          className="font-medium text-white underline underline-offset-2 hover:no-underline"
        >
          {link.label}
        </a>
      )}

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * StatusIndicator - Live status display
 */
interface StatusIndicatorProps {
  status: "online" | "offline" | "degraded" | "maintenance";
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  showDot = true,
  size = "md",
  className = "",
}: StatusIndicatorProps) {
  const statusStyles = {
    online: { color: "bg-green-500", text: "text-green-400", label: "All systems operational" },
    offline: { color: "bg-red-500", text: "text-red-400", label: "System offline" },
    degraded: { color: "bg-yellow-500", text: "text-yellow-400", label: "Degraded performance" },
    maintenance: { color: "bg-blue-500", text: "text-blue-400", label: "Under maintenance" },
  };

  const styles = statusStyles[status];
  const displayLabel = label || styles.label;

  const sizeClasses = {
    sm: { dot: "w-2 h-2", text: "text-xs" },
    md: { dot: "w-2.5 h-2.5", text: "text-sm" },
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showDot && (
        <div className="relative">
          <div className={`${sizeClasses[size].dot} rounded-full ${styles.color}`} />
          {status === "online" && (
            <div className={`absolute inset-0 ${sizeClasses[size].dot} rounded-full ${styles.color} animate-ping opacity-75`} />
          )}
        </div>
      )}
      <span className={`${sizeClasses[size].text} ${styles.text}`}>
        {displayLabel}
      </span>
    </div>
  );
}
