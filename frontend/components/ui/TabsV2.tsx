"use client";

import React, { useState, createContext, useContext, useCallback } from "react";

// ============================================================================
// TABS V2 CONTEXT
// ============================================================================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: "underline" | "pills" | "enclosed" | "soft";
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within TabsV2");
  }
  return context;
}

// ============================================================================
// TABS V2
// ============================================================================

interface TabsV2Props {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "underline" | "pills" | "enclosed" | "soft";
  children: React.ReactNode;
  className?: string;
}

export function TabsV2({
  defaultValue,
  value,
  onValueChange,
  variant = "underline",
  children,
  className = "",
}: TabsV2Props) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const activeTab = value !== undefined ? value : internalValue;

  const setActiveTab = useCallback(
    (id: string) => {
      if (value === undefined) {
        setInternalValue(id);
      }
      onValueChange?.(id);
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// ============================================================================
// TAB LIST
// ============================================================================

interface TabListProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function TabList({ children, className = "", fullWidth = false }: TabListProps) {
  const { variant } = useTabsContext();

  const variantStyles = {
    underline: "border-b border-gray-200 dark:border-gray-700",
    pills: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl",
    enclosed: "border-b border-gray-200 dark:border-gray-700",
    soft: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl",
  };

  return (
    <div
      role="tablist"
      className={`
        flex ${fullWidth ? "" : "w-fit"} gap-1
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ============================================================================
// TAB TRIGGER
// ============================================================================

interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function TabTrigger({
  value,
  children,
  disabled = false,
  icon,
  badge,
  className = "",
}: TabTriggerProps) {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  const baseStyles = "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none";

  const variantStyles = {
    underline: `
      border-b-2 -mb-px
      ${isActive
        ? "border-primary-500 text-primary-600 dark:text-primary-400"
        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
      }
    `,
    pills: `
      rounded-lg
      ${isActive
        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }
    `,
    enclosed: `
      border border-b-0 rounded-t-lg -mb-px
      ${isActive
        ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
        : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
      }
    `,
    soft: `
      rounded-lg
      ${isActive
        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }
    `,
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </button>
  );
}

// ============================================================================
// TAB CONTENT
// ============================================================================

interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabContent({
  value,
  children,
  className = "",
  forceMount = false,
}: TabContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!forceMount && !isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={`
        pt-4 animate-in fade-in-0 duration-200
        ${forceMount && !isActive ? "hidden" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ============================================================================
// VERTICAL TABS
// ============================================================================

interface VerticalTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; badge?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function VerticalTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
  className = "",
}: VerticalTabsProps) {
  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Tab List */}
      <div className="w-48 flex-shrink-0">
        <nav className="space-y-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg
                transition-all duration-200 text-left
                ${activeTab === tab.id
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-l-2 border-primary-500"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="flex-1">{tab.label}</span>
              {tab.badge && <span className="flex-shrink-0">{tab.badge}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1" role="tabpanel">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// SCROLLABLE TABS
// ============================================================================

interface ScrollableTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: "underline" | "pills";
  className?: string;
}

export function ScrollableTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
  className = "",
}: ScrollableTabsProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-x-auto scrollbar-hide">
        <div
          className={`
            flex gap-1 min-w-max
            ${variant === "underline" ? "border-b border-gray-200 dark:border-gray-700" : "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl"}
          `}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${variant === "underline"
                  ? `border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`
                  : `rounded-lg ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Fade indicators */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 pointer-events-none" />
    </div>
  );
}

// ============================================================================
// SEGMENTED CONTROL
// ============================================================================

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((opt) => opt.value === value);

  const sizeStyles = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5",
  };

  return (
    <div
      className={`
        relative inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 pointer-events-none" : ""}
        ${className}
      `}
    >
      {/* Active indicator */}
      <div
        className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-200"
        style={{
          left: `calc(${(activeIndex / options.length) * 100}% + 4px)`,
          width: `calc(${100 / options.length}% - 8px)`,
        }}
      />

      {/* Options */}
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`
            relative z-10 flex items-center justify-center gap-2 font-medium
            transition-colors duration-200
            ${fullWidth ? "flex-1" : ""}
            ${sizeStyles[size]}
            ${value === option.value
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }
          `}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// ICON TABS (For mobile navigation)
// ============================================================================

interface IconTabsProps {
  tabs: { id: string; icon: React.ReactNode; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function IconTabs({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: IconTabsProps) {
  return (
    <div className={`flex justify-around bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex flex-col items-center gap-1 px-4 py-2 min-w-[64px]
            transition-colors duration-200
            ${activeTab === tab.id
              ? "text-primary-500"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }
          `}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// USE TABS HOOK
// ============================================================================

export function useTabs(defaultTab: string) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const selectTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return { activeTab, selectTab };
}

export default TabsV2;
