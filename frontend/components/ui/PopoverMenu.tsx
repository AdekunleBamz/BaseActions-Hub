"use client";

import { useState, useRef, useEffect } from "react";

interface PopoverMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * PopoverMenu - Interactive popover with menu items
 */
export function PopoverMenu({
  trigger,
  children,
  position = "bottom",
  align = "center",
  className = "",
}: PopoverMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const getPositionClasses = () => {
    const alignClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    };

    switch (position) {
      case "top":
        return `bottom-full mb-2 ${alignClasses[align]}`;
      case "bottom":
        return `top-full mt-2 ${alignClasses[align]}`;
      case "left":
        return "right-full top-0 mr-2";
      case "right":
        return "left-full top-0 ml-2";
      default:
        return `top-full mt-2 ${alignClasses[align]}`;
    }
  };

  return (
    <div ref={popoverRef} className={`relative inline-flex ${className}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        role="button" 
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 ${getPositionClasses()}
            min-w-[200px]
            bg-gray-900/95 backdrop-blur-xl
            border border-white/10 rounded-xl
            shadow-xl overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Dropdown menu item
 */
interface DropdownItemProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label: string;
  description?: string;
  destructive?: boolean;
  disabled?: boolean;
  closeOnClick?: boolean;
}

export function DropdownItem({
  onClick,
  icon,
  label,
  description,
  destructive = false,
  disabled = false,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5
        text-left transition-colors
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${destructive
          ? "text-red-400 hover:bg-red-500/10"
          : "text-white hover:bg-white/10"
        }
      `}
      role="menuitem"
    >
      {icon && <span className="flex-shrink-0 text-lg">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{label}</p>
        {description && (
          <p className={`text-xs truncate ${destructive ? "text-red-400/70" : "text-gray-500"}`}>
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

/**
 * Dropdown divider
 */
export function DropdownDivider() {
  return <div className="my-1 h-px bg-white/10" role="separator" />;
}

/**
 * Dropdown header
 */
interface DropdownHeaderProps {
  title: string;
  subtitle?: string;
}

export function DropdownHeader({ title, subtitle }: DropdownHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-white/10">
      <p className="text-sm font-semibold text-white">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

/**
 * Context menu triggered by right-click
 */
interface ContextMenuProps {
  children: React.ReactNode;
  menuContent: React.ReactNode;
  className?: string;
}

export function ContextMenu({
  children,
  menuContent,
  className = "",
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsOpen(true);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClick = () => setIsOpen(false);

    if (isOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className={`relative ${className}`}
    >
      {children}

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 min-w-[180px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: position.x,
            top: position.y,
          }}
          role="menu"
        >
          {menuContent}
        </div>
      )}
    </div>
  );
}

/**
 * More options button with popover
 */
interface MoreOptionsProps {
  options: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    destructive?: boolean;
  }>;
  className?: string;
}

export function MoreOptions({ options, className = "" }: MoreOptionsProps) {
  return (
    <PopoverMenu
      position="bottom"
      align="end"
      trigger={
        <button
          className={`
            p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10
            transition-colors
            ${className}
          `}
          aria-label="More options"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      }
    >
      {options.map((option) => (
        <DropdownItem
          key={option.id}
          label={option.label}
          icon={option.icon}
          onClick={option.onClick}
          destructive={option.destructive}
        />
      ))}
    </PopoverMenu>
  );
}
