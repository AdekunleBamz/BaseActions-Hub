'use client';

import React, { useState, useRef, useEffect } from 'react';

// Tooltip Component
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          role="tooltip"
        >
          <div className="px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-xl whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}

// Popover Component
interface PopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Popover({ trigger, content, position = 'bottom', className = '' }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-0 mt-2',
    left: 'right-full top-0 mr-2',
    right: 'left-full top-0 ml-2',
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 ${positionClasses[position]} ${className}`}
        >
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl min-w-[200px]">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

// Dropdown Menu Component
interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 top-full mt-2 ${align === 'left' ? 'left-0' : 'right-0'}`}
        >
          <div className="py-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl min-w-[180px]">
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 border-t border-gray-800" />;
              }

              const itemClasses = `
                flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left
                ${item.disabled
                  ? 'text-gray-600 cursor-not-allowed'
                  : item.danger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
                transition-colors
              `;

              if (item.href) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={itemClasses}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                    {item.label}
                  </a>
                );
              }

              return (
                <button
                  key={index}
                  className={itemClasses}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Tabs Component
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default', fullWidth = false }: TabsProps) {
  const variantClasses = {
    default: {
      container: 'bg-gray-900 rounded-xl p-1',
      tab: 'rounded-lg',
      active: 'bg-gray-800 text-white',
      inactive: 'text-gray-400 hover:text-white',
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-full',
      active: 'bg-blue-600 text-white',
      inactive: 'text-gray-400 hover:text-white hover:bg-gray-800',
    },
    underline: {
      container: 'border-b border-gray-800',
      tab: 'border-b-2 -mb-px rounded-none',
      active: 'border-blue-500 text-white',
      inactive: 'border-transparent text-gray-400 hover:text-white hover:border-gray-600',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''} ${styles.container}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all
            ${fullWidth ? 'flex-1' : ''}
            ${styles.tab}
            ${activeTab === tab.id ? styles.active : styles.inactive}
          `}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={`
              px-1.5 py-0.5 text-xs rounded-full
              ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700'}
            `}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Accordion Component
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export function Accordion({ items, allowMultiple = false, defaultOpen = [] }: AccordionProps) {
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

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-800 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left bg-gray-900/50 hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium text-white">{item.title}</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="p-4 bg-gray-950/50 text-gray-300 text-sm">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'blue',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && <span className="text-gray-300">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-800 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Steps/Stepper Component
interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: string;
  variant?: 'horizontal' | 'vertical';
}

export function Steps({ steps, currentStep, variant = 'horizontal' }: StepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-800'}`} />
                )}
              </div>
              <div className="flex-1 pb-8">
                <p className={`font-medium ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted
                    ? 'bg-green-600 text-white'
                    : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <p className={`text-xs mt-2 ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-800'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default {
  Tooltip,
  Popover,
  DropdownMenu,
  Tabs,
  Accordion,
  ProgressBar,
  Steps,
};
