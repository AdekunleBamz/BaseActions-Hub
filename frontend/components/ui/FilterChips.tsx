"use client";

import { useState } from "react";

interface FilterChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "rounded" | "pill";
  className?: string;
}

/**
 * FilterChips - Chip-based filter selection component
 */
export function FilterChips({
  chips,
  selected,
  onChange,
  multiSelect = true,
  size = "md",
  variant = "default",
  className = "",
}: FilterChipsProps) {
  const handleChipClick = (chipId: string) => {
    if (multiSelect) {
      if (selected.includes(chipId)) {
        onChange(selected.filter((id) => id !== chipId));
      } else {
        onChange([...selected, chipId]);
      }
    } else {
      onChange(selected.includes(chipId) ? [] : [chipId]);
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  const variantClasses = {
    default: "rounded-lg",
    rounded: "rounded-xl",
    pill: "rounded-full",
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => {
        const isSelected = selected.includes(chip.id);

        return (
          <button
            key={chip.id}
            onClick={() => handleChipClick(chip.id)}
            className={`
              inline-flex items-center font-medium
              transition-all duration-200
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${isSelected
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
              }
            `}
          >
            {chip.icon && <span className="flex-shrink-0">{chip.icon}</span>}
            <span>{chip.label}</span>
            {chip.count !== undefined && (
              <span
                className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isSelected ? "bg-white/20" : "bg-white/10"}
                `}
              >
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * FilterChipsWithClear - Filter chips with clear all button
 */
interface FilterChipsWithClearProps extends FilterChipsProps {
  onClearAll?: () => void;
  clearLabel?: string;
}

export function FilterChipsWithClear({
  onClearAll,
  clearLabel = "Clear all",
  selected,
  ...props
}: FilterChipsWithClearProps) {
  return (
    <div className="flex items-center gap-3">
      <FilterChips selected={selected} {...props} />
      
      {selected.length > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {clearLabel}
        </button>
      )}
    </div>
  );
}

/**
 * BadgeFilter - Pre-configured filter for badge types
 */
interface BadgeFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  showCounts?: boolean;
  counts?: Record<string, number>;
}

const badgeTypes: FilterChip[] = [
  { id: "first_sign", label: "First Sign", icon: "✍️" },
  { id: "early_adopter", label: "Early Adopter", icon: "🌟" },
  { id: "streak_7", label: "7 Day Streak", icon: "🔥" },
  { id: "streak_30", label: "30 Day Streak", icon: "💎" },
  { id: "popular", label: "Popular Signer", icon: "👑" },
  { id: "top_10", label: "Top 10", icon: "🏆" },
  { id: "referrer", label: "Referrer", icon: "🤝" },
  { id: "whale", label: "Whale", icon: "🐋" },
  { id: "collector", label: "Collector", icon: "🎨" },
  { id: "veteran", label: "Veteran", icon: "⚔️" },
];

export function BadgeFilter({
  selected,
  onChange,
  showCounts = false,
  counts = {},
}: BadgeFilterProps) {
  const chipsWithCounts = badgeTypes.map((chip) => ({
    ...chip,
    count: showCounts ? counts[chip.id] : undefined,
  }));

  return (
    <FilterChips
      chips={chipsWithCounts}
      selected={selected}
      onChange={onChange}
      variant="pill"
      size="sm"
    />
  );
}

/**
 * RarityFilter - Pre-configured filter for badge rarities
 */
interface RarityFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const rarityTypes: FilterChip[] = [
  { id: "common", label: "Common", icon: "⚪" },
  { id: "rare", label: "Rare", icon: "🔵" },
  { id: "epic", label: "Epic", icon: "🟣" },
  { id: "legendary", label: "Legendary", icon: "🟡" },
  { id: "mythic", label: "Mythic", icon: "🔴" },
];

export function RarityFilter({ selected, onChange }: RarityFilterProps) {
  return (
    <FilterChips
      chips={rarityTypes}
      selected={selected}
      onChange={onChange}
      variant="rounded"
    />
  );
}

/**
 * TimeRangeFilter - Pre-configured filter for time ranges
 */
interface TimeRangeFilterProps {
  selected: string;
  onChange: (selected: string) => void;
}

const timeRanges: FilterChip[] = [
  { id: "1h", label: "1H" },
  { id: "24h", label: "24H" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "all", label: "All Time" },
];

export function TimeRangeFilter({ selected, onChange }: TimeRangeFilterProps) {
  return (
    <FilterChips
      chips={timeRanges}
      selected={selected ? [selected] : []}
      onChange={(ids) => onChange(ids[0] || "")}
      multiSelect={false}
      variant="pill"
      size="sm"
    />
  );
}

/**
 * StatusFilter - Pre-configured filter for status types
 */
interface StatusFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const statusTypes: FilterChip[] = [
  { id: "active", label: "Active", icon: "🟢" },
  { id: "pinned", label: "Pinned", icon: "📌" },
  { id: "edited", label: "Edited", icon: "✏️" },
  { id: "deleted", label: "Deleted", icon: "🗑️" },
];

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
  return (
    <FilterChips
      chips={statusTypes}
      selected={selected}
      onChange={onChange}
    />
  );
}

/**
 * useFilters - Hook for managing filter state
 */
interface UseFiltersOptions {
  initialFilters?: Record<string, string[]>;
}

export function useFilters(options: UseFiltersOptions = {}) {
  const [filters, setFilters] = useState<Record<string, string[]>>(
    options.initialFilters || {}
  );

  const setFilter = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const toggleFilterValue = (key: string, value: string) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (values) => values.length > 0
  );

  const activeFilterCount = Object.values(filters).reduce(
    (acc, values) => acc + values.length,
    0
  );

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    toggleFilterValue,
    hasActiveFilters,
    activeFilterCount,
  };
}

/**
 * ActiveFilters - Display currently active filters with remove buttons
 */
interface ActiveFiltersProps {
  filters: Record<string, string[]>;
  labels?: Record<string, string>;
  onRemove: (key: string, value: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({
  filters,
  labels = {},
  onRemove,
  onClearAll,
  className = "",
}: ActiveFiltersProps) {
  const activeFilters = Object.entries(filters)
    .filter(([_, values]) => values.length > 0)
    .flatMap(([key, values]) =>
      values.map((value) => ({ key, value }))
    );

  if (activeFilters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-400">Filters:</span>
      
      {activeFilters.map(({ key, value }) => (
        <span
          key={`${key}-${value}`}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg"
        >
          <span>{labels[`${key}.${value}`] || value}</span>
          <button
            onClick={() => onRemove(key, value)}
            className="hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}

      {onClearAll && activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-400 hover:text-white transition-colors ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
