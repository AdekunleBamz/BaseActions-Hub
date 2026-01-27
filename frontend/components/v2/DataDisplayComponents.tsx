'use client';

import React from 'react';

// ============================================================================
// DATA DISPLAY COMPONENTS V2
// ============================================================================

interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  loading,
  emptyMessage = 'No data available',
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                  `}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && sortColumn === col.key && (
                      <svg
                        className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  transition-colors
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      px-6 py-4 text-sm text-gray-700 dark:text-gray-300
                      ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    `}
                  >
                    {col.render ? col.render(item, index) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export function CardGrid({ children, columns = 3, gap = 'md' }: CardGridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}

interface ListItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  avatar?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export function ListItem({ title, description, icon, avatar, trailing, onClick, href }: ListItemProps) {
  const content = (
    <>
      {avatar && (
        <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
      )}
      {icon && !avatar && (
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{description}</p>
        )}
      </div>
      {trailing}
    </>
  );

  const className = `
    flex items-center gap-4 p-4 rounded-xl transition-colors
    ${onClick || href ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
  `;

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <div onClick={onClick} className={className}>
      {content}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function StatCard({ title, value, change, icon, trend, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  const trendColors = {
    up: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    down: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    neutral: 'text-gray-600 bg-gray-100 dark:bg-gray-800',
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && trend && (
            <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
              {trend === 'up' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'pending';
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const statusColors = {
    completed: 'bg-green-600',
    current: 'bg-blue-600',
    pending: 'bg-gray-300 dark:bg-gray-600',
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${statusColors[item.status || 'pending']}
                ${item.status === 'pending' ? 'text-gray-600 dark:text-gray-400' : 'text-white'}
              `}
            >
              {item.icon || (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 my-2 bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
            </div>
            {item.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: Array<{ src?: string; name: string }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, index) => (
        <div
          key={index}
          className={`
            ${sizes[size]} rounded-full border-2 border-white dark:border-gray-900
            flex items-center justify-center
            ${avatar.src ? '' : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium'}
          `}
        >
          {avatar.src ? (
            <img src={avatar.src} alt={avatar.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            avatar.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizes[size]} rounded-full border-2 border-white dark:border-gray-900
            bg-gray-200 dark:bg-gray-700 flex items-center justify-center
            text-gray-600 dark:text-gray-300 font-medium
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${openItems.has(item.id) ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openItems.has(item.id) && (
            <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-300">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}

interface TagProps {
  children: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ children, variant = 'default', size = 'md', removable, onRemove }: TagProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${variants[variant]} ${sizes[size]}
      `}
    >
      {children}
      {removable && (
        <button onClick={onRemove} className="ml-1 hover:opacity-70">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

interface DataListProps {
  items: Array<{ label: string; value: React.ReactNode }>;
}

export function DataList({ items }: DataListProps) {
  return (
    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((item, index) => (
        <div key={index} className="py-3 flex justify-between">
          <dt className="text-sm text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default {
  Table,
  CardGrid,
  ListItem,
  StatCard,
  Timeline,
  AvatarGroup,
  Accordion,
  Tag,
  DataList,
};
