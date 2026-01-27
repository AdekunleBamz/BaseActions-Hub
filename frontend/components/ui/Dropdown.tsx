"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";

interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  align = "left",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      const selectableItems = items.filter(item => !item.divider && !item.disabled);

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < selectableItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : selectableItems.length - 1
          );
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0 && selectableItems[focusedIndex]) {
            onSelect(selectableItems[focusedIndex].value);
            setIsOpen(false);
          }
          break;
      }
    },
    [isOpen, items, focusedIndex, onSelect]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.divider) return;
    onSelect(item.value);
    setIsOpen(false);
  };

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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
          ref={menuRef}
          role="listbox"
          className={`absolute ${alignmentClasses[align]} mt-2 min-w-[200px] glass rounded-xl py-2 z-50 animate-scaleIn origin-top`}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="h-px bg-white/10 my-2"
                />
              );
            }

            const selectableIndex = items
              .filter((i, idx) => idx < index && !i.divider && !i.disabled)
              .length;

            return (
              <button
                key={item.value}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                role="option"
                aria-selected={focusedIndex === selectableIndex}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors
                  ${item.disabled 
                    ? "text-gray-600 cursor-not-allowed" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                  ${focusedIndex === selectableIndex ? "bg-white/10 text-white" : ""}
                `}
              >
                {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
