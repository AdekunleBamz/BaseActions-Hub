"use client";

import { memo } from "react";
import { useTheme, type Theme } from "@/providers/ThemeProvider";

interface ThemeToggleProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
} as const;

export const ThemeToggle = memo(function ThemeToggle({
  size = "md",
  showLabel = false,
  className = "",
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative inline-flex items-center justify-center
        rounded-full
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sun icon */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
        aria-hidden="true"
      >
        ☀️
      </span>
      {/* Moon icon */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
        }`}
        aria-hidden="true"
      >
        🌙
      </span>
      {showLabel && (
        <span className="sr-only">
          {isDark ? "Dark mode" : "Light mode"}
        </span>
      )}
    </button>
  );
});

interface ThemeSwitcherProps {
  className?: string;
}

const themeOptions: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

export const ThemeSwitcher = memo(function ThemeSwitcher({
  className = "",
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          onClick={() => setTheme(option.value)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
            ${
              theme === option.value
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }
          `}
        >
          <span aria-hidden="true">{option.icon}</span>
          <span className="ml-1.5">{option.label}</span>
        </button>
      ))}
    </div>
  );
});
