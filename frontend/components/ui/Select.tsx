"use client";

import { forwardRef, useState, useRef, useEffect, useCallback, ReactNode } from "react";

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  isRequired?: boolean;
  className?: string;
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      options,
      value,
      onChange,
      label,
      placeholder = "Select an option",
      error,
      hint,
      disabled = false,
      isRequired,
      className = "",
      leftIcon,
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        const selectableOptions = options.filter((opt) => !opt.disabled);

        switch (event.key) {
          case "Enter":
          case " ":
            event.preventDefault();
            if (isOpen && focusedIndex >= 0) {
              onChange(selectableOptions[focusedIndex].value);
              setIsOpen(false);
            } else {
              setIsOpen(true);
            }
            break;
          case "Escape":
            setIsOpen(false);
            break;
          case "ArrowDown":
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setFocusedIndex((prev) =>
                prev < selectableOptions.length - 1 ? prev + 1 : 0
              );
            }
            break;
          case "ArrowUp":
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setFocusedIndex((prev) =>
                prev > 0 ? prev - 1 : selectableOptions.length - 1
              );
            }
            break;
        }
      },
      [disabled, isOpen, focusedIndex, options, onChange]
    );

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    useEffect(() => {
      if (!isOpen) {
        setFocusedIndex(-1);
      }
    }, [isOpen]);

    return (
      <div ref={containerRef} className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {isRequired && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <button
          ref={ref}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label}
          className={`
            w-full input-modern flex items-center justify-between gap-2
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${error ? "border-red-500/50 focus:border-red-500" : ""}
            ${isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : ""}
          `}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {leftIcon && <span className="text-gray-400 flex-shrink-0">{leftIcon}</span>}
            <span className={`truncate ${selectedOption ? "text-white" : "text-gray-500"}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute z-50 w-full mt-2 glass rounded-xl py-2 max-h-60 overflow-auto animate-scaleIn origin-top"
            style={{ width: containerRef.current?.offsetWidth }}
          >
            {options.map((option, index) => {
              const selectableIndex = options
                .filter((o, i) => i < index && !o.disabled)
                .length;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-2 text-left transition-colors
                    ${option.disabled
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                    ${option.value === value ? "bg-blue-500/20 text-blue-400" : ""}
                    ${focusedIndex === selectableIndex && !option.disabled ? "bg-white/10 text-white" : ""}
                  `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);
