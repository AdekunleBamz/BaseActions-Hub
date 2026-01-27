"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  showClearButton?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "ghost";
  className?: string;
}

/**
 * SearchBar - Main search input component
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onSubmit,
  onClear,
  disabled = false,
  autoFocus = false,
  showClearButton = true,
  size = "md",
  variant = "default",
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: "h-9 text-sm px-3",
    md: "h-11 text-base px-4",
    lg: "h-14 text-lg px-5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantClasses = {
    default: `
      bg-white/5 border border-white/10
      ${isFocused ? "border-blue-500/50 bg-white/10" : "hover:bg-white/[0.07]"}
    `,
    filled: `
      bg-gray-800/80 border-none
      ${isFocused ? "bg-gray-700/80 ring-2 ring-blue-500/30" : "hover:bg-gray-800"}
    `,
    ghost: `
      bg-transparent border-b border-white/10 rounded-none
      ${isFocused ? "border-blue-500" : "hover:border-white/20"}
    `,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      {/* Search icon */}
      <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
        <svg
          className={`${iconSizes[size]} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full rounded-xl transition-all duration-200
          text-white placeholder-gray-500
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          pl-10 ${showClearButton && value ? "pr-10" : "pr-4"}
        `}
      />

      {/* Clear button */}
      {showClearButton && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-0 inset-y-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}

/**
 * SearchWithSuggestions - Search with autocomplete dropdown
 */
interface Suggestion {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface SearchWithSuggestionsProps extends Omit<SearchBarProps, "onSubmit"> {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  isLoading?: boolean;
  maxSuggestions?: number;
  emptyMessage?: string;
}

export function SearchWithSuggestions({
  suggestions,
  onSelect,
  isLoading = false,
  maxSuggestions = 5,
  emptyMessage = "No results found",
  ...searchBarProps
}: SearchWithSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);
  const showDropdown = isOpen && searchBarProps.value.length > 0;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < displayedSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : displayedSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && displayedSuggestions[highlightedIndex]) {
          onSelect(displayedSuggestions[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [showDropdown, highlightedIndex, displayedSuggestions, onSelect]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <div onFocus={() => setIsOpen(true)}>
        <SearchBar {...searchBarProps} />
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full z-50 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </div>
          ) : displayedSuggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            <ul role="listbox">
              {displayedSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => {
                    onSelect(suggestion);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    flex items-center gap-3 px-4 py-3 cursor-pointer
                    ${index === highlightedIndex
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-white hover:bg-white/5"
                    }
                  `}
                >
                  {suggestion.icon && (
                    <span className="text-lg">{suggestion.icon}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{suggestion.label}</p>
                    {suggestion.sublabel && (
                      <p className="text-sm text-gray-500 truncate">
                        {suggestion.sublabel}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * useSearch - Hook for search state management
 */
interface UseSearchOptions<T> {
  items: T[];
  searchFields: (keyof T)[];
  minChars?: number;
  debounceMs?: number;
}

export function useSearch<T>({
  items,
  searchFields,
  minChars = 2,
  debounceMs = 300,
}: UseSearchOptions<T>) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = debouncedQuery.length >= minChars
    ? items.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(debouncedQuery.toLowerCase());
          }
          return false;
        })
      )
    : items;

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasQuery: query.length >= minChars,
    clearSearch: () => setQuery(""),
  };
}

/**
 * AddressSearch - Specialized search for wallet addresses
 */
interface AddressSearchProps {
  onSearch: (address: string) => void;
  onValidAddress?: (address: string) => void;
  className?: string;
}

export function AddressSearch({
  onSearch,
  onValidAddress,
  className = "",
}: AddressSearchProps) {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    
    if (newValue.length === 0) {
      setIsValid(null);
    } else if (newValue.length === 42) {
      const valid = validateAddress(newValue);
      setIsValid(valid);
      if (valid) {
        onValidAddress?.(newValue);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = (submittedValue: string) => {
    if (validateAddress(submittedValue)) {
      onSearch(submittedValue);
    }
  };

  return (
    <div className={className}>
      <SearchBar
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Search by address (0x...)"
        variant="filled"
      />
      
      {isValid === false && value.length > 0 && (
        <p className="mt-2 text-sm text-red-400">
          Please enter a valid Ethereum address
        </p>
      )}
      
      {isValid === true && (
        <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Valid address
        </p>
      )}
    </div>
  );
}
