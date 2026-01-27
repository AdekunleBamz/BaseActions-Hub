"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within a Tabs component");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onChange, children, className = "" }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const activeTab = value !== undefined ? value : internalValue;
  
  const setActiveTab = useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [value, onChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

Tabs.List = function TabList({ children, className = "", variant = "default" }: TabListProps) {
  const variantClasses = {
    default: "flex gap-1 p-1 glass rounded-xl",
    pills: "flex gap-2",
    underline: "flex gap-4 border-b border-white/10",
  };

  return (
    <div
      role="tablist"
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "pills" | "underline";
}

Tabs.Trigger = function TabTrigger({ 
  value, 
  children, 
  className = "", 
  disabled = false,
  variant = "default" 
}: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  const baseClasses = "transition-all duration-200 font-medium";
  
  const variantStyles = {
    default: {
      base: "px-4 py-2 rounded-lg text-sm",
      active: "bg-white/10 text-white",
      inactive: "text-gray-400 hover:text-white hover:bg-white/5",
    },
    pills: {
      base: "px-4 py-2 rounded-full text-sm",
      active: "bg-blue-500 text-white",
      inactive: "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10",
    },
    underline: {
      base: "px-4 py-3 text-sm border-b-2 -mb-px",
      active: "border-blue-500 text-white",
      inactive: "border-transparent text-gray-400 hover:text-white hover:border-white/20",
    },
  };

  const styles = variantStyles[variant];

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={`
        ${baseClasses}
        ${styles.base}
        ${isActive ? styles.active : styles.inactive}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

Tabs.Content = function TabContent({ value, children, className = "" }: TabContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      tabIndex={0}
      className={`animate-fadeIn ${className}`}
    >
      {children}
    </div>
  );
};
