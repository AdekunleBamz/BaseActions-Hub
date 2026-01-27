"use client";

import { useState } from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "glass" | "gradient" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Card - Base card component with variants
 */
export function Card({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  clickable = false,
  onClick,
  className = "",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const variantClasses = {
    default: "bg-white/5 border border-white/10",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    gradient: "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20",
    outlined: "bg-transparent border-2 border-white/20",
    elevated: "bg-gray-900 border border-white/10 shadow-xl",
  };

  const hoverClasses = hover
    ? "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-white/20"
    : "";

  const clickableClasses = clickable
    ? "cursor-pointer active:scale-[0.98]"
    : "";

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        rounded-xl
        ${paddingClasses[padding]}
        ${variantClasses[variant]}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - Card header section
 */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className = "",
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="text-2xl flex-shrink-0">{icon}</div>
        )}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
}

/**
 * CardContent - Card content area
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}

/**
 * CardFooter - Card footer section
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * InteractiveCard - Card with expand functionality
 */
interface InteractiveCardProps extends Omit<CardProps, "children"> {
  header: React.ReactNode;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
  defaultExpanded?: boolean;
}

export function InteractiveCard({
  header,
  content,
  expandedContent,
  defaultExpanded = false,
  ...cardProps
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card {...cardProps}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">{header}</div>
        {expandedContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-4">{content}</div>

      {expandedContent && isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top-2">
          {expandedContent}
        </div>
      )}
    </Card>
  );
}

/**
 * FeatureCardV2 - Enhanced feature showcase card
 */
interface FeatureCardV2Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  link?: { href: string; label: string };
  className?: string;
}

export function FeatureCardV2({
  icon,
  title,
  description,
  badge,
  link,
  className = "",
}: FeatureCardV2Props) {
  return (
    <Card variant="glass" hover className={className}>
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{title}</h3>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">{description}</p>
          {link && (
            <a
              href={link.href}
              className="inline-flex items-center gap-1 text-blue-400 text-sm mt-2 hover:text-blue-300 transition-colors"
            >
              {link.label}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * SignatureCardV2 - Enhanced signature display card
 */
interface SignatureCardV2Props {
  address: string;
  message: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
  isPinned?: boolean;
  isEdited?: boolean;
  onReact?: (emoji: string) => void;
  className?: string;
}

export function SignatureCardV2({
  address,
  message,
  timestamp,
  reactions = [],
  isPinned = false,
  isEdited = false,
  onReact,
  className = "",
}: SignatureCardV2Props) {
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Card variant={isPinned ? "gradient" : "default"} className={className}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {address.slice(2, 4).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-white text-sm">{truncatedAddress}</span>
            {isPinned && <span className="text-xs">📌</span>}
            {isEdited && (
              <span className="text-xs text-gray-500">(edited)</span>
            )}
          </div>

          {/* Message */}
          <p className="text-gray-300">{message}</p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {timestamp.toLocaleDateString()} at{" "}
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>

            {/* Reactions */}
            {reactions.length > 0 && (
              <div className="flex items-center gap-1">
                {reactions.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => onReact?.(r.emoji)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                  >
                    <span>{r.emoji}</span>
                    <span className="text-gray-400">{r.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * ActionCard - Card with prominent action button
 */
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
  disabled?: boolean;
  className?: string;
}

export function ActionCard({
  icon,
  title,
  description,
  action,
  disabled = false,
  className = "",
}: ActionCardProps) {
  return (
    <Card variant="glass" className={className}>
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <p className="text-gray-400 text-sm mt-2 mb-6">{description}</p>
        <button
          onClick={action.onClick}
          disabled={disabled}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
        >
          {action.label}
        </button>
      </div>
    </Card>
  );
}

/**
 * MetricCard - Card for displaying a single metric
 */
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  trend = "neutral",
  className = "",
}: MetricCardProps) {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${trendColors[trend]}`}>
              {trendIcons[trend]} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-60">{icon}</div>
        )}
      </div>
    </Card>
  );
}
