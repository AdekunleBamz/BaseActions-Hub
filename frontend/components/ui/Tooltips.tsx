"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ============================================================================
// TOOLTIP V2
// ============================================================================

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipTrigger = "hover" | "click" | "focus";

interface TooltipV2Props {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger | TooltipTrigger[];
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  maxWidth?: number;
  className?: string;
}

export function TooltipV2({
  children,
  content,
  placement = "top",
  trigger = "hover",
  delay = 200,
  disabled = false,
  arrow = true,
  maxWidth = 250,
  className = "",
}: TooltipV2Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
      case "right":
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollX + 8;
        break;
    }

    setPosition({ top, left });
  }, [placement]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition);
      window.addEventListener("resize", calculatePosition);
    }
    return () => {
      window.removeEventListener("scroll", calculatePosition);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isVisible, calculatePosition]);

  const show = () => {
    if (disabled) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const toggle = () => {
    if (disabled) return;
    setIsVisible(!isVisible);
  };

  const arrowStyles: Record<TooltipPlacement, string> = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={triggers.includes("hover") ? show : undefined}
        onMouseLeave={triggers.includes("hover") ? hide : undefined}
        onClick={triggers.includes("click") ? toggle : undefined}
        onFocus={triggers.includes("focus") ? show : undefined}
        onBlur={triggers.includes("focus") ? hide : undefined}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            fixed z-[9999] px-3 py-2 text-sm font-medium rounded-lg shadow-lg
            bg-gray-900 dark:bg-gray-700 text-white
            animate-in fade-in-0 zoom-in-95 duration-150
            ${className}
          `}
          style={{
            top: position.top,
            left: position.left,
            maxWidth,
          }}
        >
          {content}
          {arrow && (
            <div
              className={`absolute w-0 h-0 border-4 border-gray-900 dark:border-gray-700 ${arrowStyles[placement]}`}
            />
          )}
        </div>
      )}
    </>
  );
}

// ============================================================================
// POPOVER V2
// ============================================================================

interface PopoverV2Props {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: "click" | "hover";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  className?: string;
  contentClassName?: string;
}

export function PopoverV2({
  children,
  content,
  placement = "bottom",
  trigger = "click",
  open: controlledOpen,
  onOpenChange,
  closeOnClickOutside = true,
  className = "",
  contentClassName = "",
}: PopoverV2Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeOnClickOutside]);

  const placementStyles: Record<TooltipPlacement, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div
        onClick={trigger === "click" ? () => setOpen(!isOpen) : undefined}
        onMouseEnter={trigger === "hover" ? () => setOpen(true) : undefined}
        onMouseLeave={trigger === "hover" ? () => setOpen(false) : undefined}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={contentRef}
          className={`
            absolute z-50 min-w-[200px]
            bg-white dark:bg-gray-800 rounded-xl shadow-xl
            border border-gray-200 dark:border-gray-700
            animate-in fade-in-0 zoom-in-95 duration-150
            ${placementStyles[placement]}
            ${contentClassName}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HOVER CARD
// ============================================================================

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  side?: "top" | "bottom";
  className?: string;
}

export function HoverCard({
  children,
  content,
  delay = 300,
  side = "bottom",
  className = "",
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-80
            ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"}
            left-1/2 -translate-x-1/2
            bg-white dark:bg-gray-800 rounded-xl shadow-2xl
            border border-gray-200 dark:border-gray-700
            p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-200
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// USER HOVER CARD
// ============================================================================

interface UserHoverCardProps {
  address: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  stats?: {
    signatures?: number;
    badges?: number;
    points?: number;
  };
  children: React.ReactNode;
  className?: string;
}

export function UserHoverCard({
  address,
  displayName,
  avatar,
  bio,
  stats,
  children,
  className = "",
}: UserHoverCardProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <HoverCard
      className={className}
      content={
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName || shortAddress}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                {(displayName || shortAddress).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {displayName || shortAddress}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {shortAddress}
              </p>
            </div>
          </div>
          {bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {bio}
            </p>
          )}
          {stats && (
            <div className="flex gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              {stats.signatures !== undefined && (
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {stats.signatures}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Signatures
                  </p>
                </div>
              )}
              {stats.badges !== undefined && (
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {stats.badges}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Badges
                  </p>
                </div>
              )}
              {stats.points !== undefined && (
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {stats.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Points
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      }
    >
      {children}
    </HoverCard>
  );
}

// ============================================================================
// INFO TOOLTIP
// ============================================================================

interface InfoTooltipProps {
  content: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function InfoTooltip({
  content,
  size = "md",
  className = "",
}: InfoTooltipProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";

  return (
    <TooltipV2 content={content} className={className}>
      <button
        type="button"
        className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
      >
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </TooltipV2>
  );
}

// ============================================================================
// COPY TOOLTIP
// ============================================================================

interface CopyTooltipProps {
  text: string;
  children: React.ReactNode;
  successMessage?: string;
  className?: string;
}

export function CopyTooltip({
  text,
  children,
  successMessage = "Copied!",
  className = "",
}: CopyTooltipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <TooltipV2
      content={copied ? successMessage : "Click to copy"}
      className={className}
    >
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center cursor-pointer"
      >
        {children}
      </button>
    </TooltipV2>
  );
}

export default TooltipV2;
