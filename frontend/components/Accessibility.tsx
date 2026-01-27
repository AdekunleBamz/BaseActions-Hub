"use client";

import { cn } from "@/lib/utils";
import { skipLinks } from "@/lib/accessibility";

interface SkipLinkProps {
  className?: string;
}

/**
 * Skip links for keyboard users to bypass navigation
 * These are visually hidden until focused
 */
export function SkipLinks({ className }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.setAttribute("tabindex", "-1");
      target.focus();
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true }
      );
      // Scroll into view
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cn("skip-links", className)}>
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className={cn(
            "absolute left-0 z-[9999] -translate-y-full p-4",
            "bg-accent-primary text-white font-medium",
            "transition-transform duration-200",
            "focus:translate-y-0",
            "focus:outline-none focus:ring-2 focus:ring-accent-secondary"
          )}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}

/**
 * Visually hidden content that remains accessible to screen readers
 */
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as: Component = "span" }: VisuallyHiddenProps) {
  return (
    <Component
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden",
        "whitespace-nowrap border-0",
        "[clip:rect(0,0,0,0)]"
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Announce content to screen readers only when it changes
 */
interface LiveRegionProps {
  children: React.ReactNode;
  priority?: "polite" | "assertive";
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  priority = "polite",
  atomic = true,
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      role={priority === "assertive" ? "alert" : "status"}
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden",
        "whitespace-nowrap border-0",
        "[clip:rect(0,0,0,0)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Focus ring indicator for keyboard users
 */
interface FocusRingProps {
  children: React.ReactNode;
  className?: string;
  offset?: "tight" | "normal" | "loose";
}

export function FocusRing({
  children,
  className,
  offset = "normal",
}: FocusRingProps) {
  const offsetClasses = {
    tight: "focus-within:ring-offset-0",
    normal: "focus-within:ring-offset-2",
    loose: "focus-within:ring-offset-4",
  };

  return (
    <div
      className={cn(
        "focus-within:ring-2 focus-within:ring-accent-primary",
        "focus-within:ring-offset-dark-bg-primary",
        "rounded-lg transition-shadow",
        offsetClasses[offset],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Accessible icon button with required label
 */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  showLabel?: boolean;
  labelPosition?: "left" | "right";
}

export function IconButton({
  label,
  icon,
  showLabel = false,
  labelPosition = "right",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={!showLabel ? label : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "p-2 rounded-lg",
        "hover:bg-dark-bg-tertiary transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2",
        "focus:ring-offset-dark-bg-primary",
        className
      )}
      {...props}
    >
      {showLabel && labelPosition === "left" && <span>{label}</span>}
      {icon}
      {showLabel && labelPosition === "right" && <span>{label}</span>}
      {!showLabel && <VisuallyHidden>{label}</VisuallyHidden>}
    </button>
  );
}

/**
 * External link with proper accessibility attributes
 */
interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({
  children,
  showIcon = true,
  className,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1",
        "text-accent-primary hover:underline",
        "focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2",
        "focus:ring-offset-dark-bg-primary rounded",
        className
      )}
      {...props}
    >
      {children}
      {showIcon && (
        <svg
          aria-hidden="true"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
      <VisuallyHidden>(opens in new tab)</VisuallyHidden>
    </a>
  );
}

/**
 * Loading announcement for async operations
 */
interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  loadedMessage?: string;
}

export function LoadingAnnouncer({
  isLoading,
  loadingMessage = "Loading...",
  loadedMessage = "Content loaded",
}: LoadingAnnouncerProps) {
  return (
    <LiveRegion priority="polite">
      {isLoading ? loadingMessage : loadedMessage}
    </LiveRegion>
  );
}
