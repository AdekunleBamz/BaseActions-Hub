"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion compound components must be used within an Accordion");
  }
  return context;
}

interface AccordionProps {
  children: ReactNode;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  className?: string;
}

export function Accordion({ 
  children, 
  type = "single", 
  defaultValue,
  className = "" 
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const toggleItem = useCallback((value: string) => {
    setOpenItems(prev => {
      if (type === "single") {
        return prev.includes(value) ? [] : [value];
      }
      return prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
    });
  }, [type]);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionTrigger and AccordionContent must be used within AccordionItem");
  }
  return context;
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

Accordion.Item = function AccordionItem({ value, children, className = "" }: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={`glass rounded-xl overflow-hidden ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

Accordion.Trigger = function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  const { value, isOpen } = useAccordionItemContext();
  const { toggleItem } = useAccordionContext();

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${value}`}
      className={`
        w-full px-4 py-4 flex items-center justify-between text-left
        text-white font-medium hover:bg-white/5 transition-colors
        ${className}
      `}
    >
      <span>{children}</span>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

Accordion.Content = function AccordionContent({ children, className = "" }: AccordionContentProps) {
  const { value, isOpen } = useAccordionItemContext();

  return (
    <div
      id={`accordion-content-${value}`}
      role="region"
      aria-hidden={!isOpen}
      className={`
        overflow-hidden transition-all duration-200
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className={`px-4 pb-4 text-gray-400 ${className}`}>
        {children}
      </div>
    </div>
  );
};
