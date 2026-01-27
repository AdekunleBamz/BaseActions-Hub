"use client";

import { useState, useRef, useEffect } from "react";

interface SortOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: "asc" | "desc";
  onDirectionChange?: (direction: "asc" | "desc") => void;
  showDirection?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * SortDropdown - Dropdown for sorting options
 */
export function SortDropdown({
  options,
  value,
  onChange,
  direction = "desc",
  onDirectionChange,
  showDirection = true,
  label = "Sort by",
  size = "md",
  className = "",
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];

  const sizeClasses = {
    sm: "text-xs py-1.5 px-2.5",
    md: "text-sm py-2 px-3",
    lg: "text-base py-2.5 px-4",
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDirection = () => {
    onDirectionChange?.(direction === "asc" ? "desc" : "asc");
  };

  return (
    <div ref={dropdownRef} className={`relative inline-flex ${className}`}>
      {/* Main dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 
          bg-white/5 hover:bg-white/10 
          border border-white/10 
          rounded-l-xl transition-colors
          ${showDirection ? "" : "rounded-r-xl"}
          ${sizeClasses[size]}
        `}
      >
        <span className="text-gray-400">{label}:</span>
        {selectedOption?.icon && <span>{selectedOption.icon}</span>}
        <span className="font-medium text-white">{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform text-gray-400 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Direction toggle button */}
      {showDirection && onDirectionChange && (
        <button
          onClick={toggleDirection}
          className={`
            inline-flex items-center justify-center
            bg-white/5 hover:bg-white/10 
            border border-white/10 border-l-0
            rounded-r-xl transition-colors
            ${sizeClasses[size]}
            px-2
          `}
          title={direction === "asc" ? "Ascending" : "Descending"}
        >
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${direction === "asc" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 min-w-full w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-4 py-2.5 text-left
                transition-colors
                ${option.id === value
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-white hover:bg-white/5"
                }
              `}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
              {option.id === value && (
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * LeaderboardSort - Pre-configured sort for leaderboard
 */
interface LeaderboardSortProps {
  value: string;
  onChange: (value: string) => void;
  direction: "asc" | "desc";
  onDirectionChange: (direction: "asc" | "desc") => void;
}

const leaderboardSortOptions: SortOption[] = [
  { id: "points", label: "Points", icon: "⭐" },
  { id: "signatures", label: "Signatures", icon: "✍️" },
  { id: "streak", label: "Streak", icon: "🔥" },
  { id: "badges", label: "Badges", icon: "🏆" },
  { id: "referrals", label: "Referrals", icon: "🤝" },
  { id: "recent", label: "Recent Activity", icon: "🕐" },
];

export function LeaderboardSort({
  value,
  onChange,
  direction,
  onDirectionChange,
}: LeaderboardSortProps) {
  return (
    <SortDropdown
      options={leaderboardSortOptions}
      value={value}
      onChange={onChange}
      direction={direction}
      onDirectionChange={onDirectionChange}
      label="Sort"
    />
  );
}

/**
 * GuestbookSort - Pre-configured sort for guestbook entries
 */
interface GuestbookSortProps {
  value: string;
  onChange: (value: string) => void;
}

const guestbookSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First", icon: "🆕" },
  { id: "oldest", label: "Oldest First", icon: "📅" },
  { id: "popular", label: "Most Popular", icon: "❤️" },
  { id: "reactions", label: "Most Reactions", icon: "👍" },
];

export function GuestbookSort({ value, onChange }: GuestbookSortProps) {
  return (
    <SortDropdown
      options={guestbookSortOptions}
      value={value}
      onChange={onChange}
      showDirection={false}
    />
  );
}

/**
 * useSort - Hook for sort state management
 */
interface UseSortOptions {
  defaultSort?: string;
  defaultDirection?: "asc" | "desc";
}

export function useSort<T>({
  defaultSort = "newest",
  defaultDirection = "desc",
}: UseSortOptions = {}) {
  const [sortBy, setSortBy] = useState(defaultSort);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultDirection);

  const sortItems = (items: T[], getSortValue: (item: T) => number | string | Date) => {
    return [...items].sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      let comparison = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const toggleDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortItems,
    toggleDirection,
  };
}

/**
 * SortButton - Simple inline sort button
 */
interface SortButtonProps {
  label: string;
  isActive?: boolean;
  direction?: "asc" | "desc" | null;
  onClick: () => void;
  className?: string;
}

export function SortButton({
  label,
  isActive = false,
  direction = null,
  onClick,
  className = "",
}: SortButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 text-sm font-medium
        transition-colors
        ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}
        ${className}
      `}
    >
      {label}
      {isActive && direction && (
        <svg
          className={`w-4 h-4 transition-transform ${direction === "asc" ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )}
    </button>
  );
}

/**
 * TableSort - Sort header for table columns
 */
interface TableSortProps {
  columns: { id: string; label: string }[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  className?: string;
}

export function TableSort({
  columns,
  sortBy,
  sortDirection,
  onSort,
  className = "",
}: TableSortProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {columns.map((column) => (
        <SortButton
          key={column.id}
          label={column.label}
          isActive={sortBy === column.id}
          direction={sortBy === column.id ? sortDirection : null}
          onClick={() => onSort(column.id)}
        />
      ))}
    </div>
  );
}
