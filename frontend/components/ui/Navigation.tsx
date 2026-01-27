"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

/**
 * DropdownMenu - Generic dropdown menu
 */
export function DropdownMenu({
  trigger,
  children,
  align = "left",
  className = "",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 z-50
            min-w-[180px] py-1
            bg-gray-900/95 backdrop-blur-xl
            border border-white/10 rounded-xl
            shadow-xl
            ${alignClasses[align]}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * DropdownItem - Menu item
 */
interface DropdownItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}

export function DropdownItem({
  icon,
  children,
  onClick,
  disabled = false,
  destructive = false,
  className = "",
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 text-left
        transition-colors
        ${disabled
          ? "opacity-50 cursor-not-allowed text-gray-500"
          : destructive
            ? "text-red-400 hover:bg-red-500/10"
            : "text-white hover:bg-white/5"
        }
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/**
 * DropdownDivider - Menu separator
 */
export function DropdownDivider() {
  return <div className="my-1 border-t border-white/10" />;
}

/**
 * DropdownLabel - Section label
 */
interface DropdownLabelProps {
  children: React.ReactNode;
}

export function DropdownLabel({ children }: DropdownLabelProps) {
  return (
    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
      {children}
    </div>
  );
}

/**
 * Accordion - Expandable sections
 */
interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: "default" | "bordered" | "separated";
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  variant = "default",
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const variantClasses = {
    default: "",
    bordered: "border border-white/10 rounded-xl overflow-hidden",
    separated: "space-y-2",
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            className={`
              ${variant === "separated" ? "border border-white/10 rounded-xl overflow-hidden" : ""}
              ${variant === "bordered" && !isLast ? "border-b border-white/10" : ""}
            `}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-xl">{item.icon}</span>}
                <span className="font-medium text-white">{item.title}</span>
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
              <div className="px-4 pb-4 text-gray-400">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Breadcrumbs - Navigation breadcrumbs
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator = "/",
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <span
                className={`flex items-center gap-1.5 ${isLast ? "text-white font-medium" : "text-gray-400"}`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            )}

            {!isLast && (
              <span className="text-gray-600">{separator}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Pagination - Page navigation
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className = "",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | "dots")[] = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= 3 + 2 * siblingCount; i++) {
        pages.push(i);
      }
      pages.push("dots");
      pages.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push("dots");
      for (let i = totalPages - (2 + 2 * siblingCount); i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      pages.push(1);
      pages.push("dots");
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push("dots");
      pages.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((page, index) => (
        page === "dots" ? (
          <span key={`dots-${index}`} className="px-2 text-gray-600">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[36px] h-9 px-2 rounded-lg font-medium transition-colors
              ${page === currentPage
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

/**
 * usePagination - Hook for pagination state
 */
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const goToFirst = useCallback(() => goToPage(1), [goToPage]);
  const goToLast = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);
  const goToPrev = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);
  const goToNext = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToFirst,
    goToLast,
    goToPrev,
    goToNext,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
