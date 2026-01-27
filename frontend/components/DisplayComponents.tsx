'use client';

import React from 'react';
import Link from 'next/link';

// Avatar Component
interface AvatarProps {
  src?: string | null;
  alt?: string;
  address?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

function getColorFromAddress(address: string): string {
  const colors = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
  ];
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function Avatar({ src, alt, address, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = sizeClasses[size];
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    );
  }

  if (address) {
    const gradient = getColorFromAddress(address);
    const initials = address.slice(2, 4).toUpperCase();
    
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-medium ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gray-700 flex items-center justify-center text-gray-400 ${className}`}
    >
      <svg className="w-1/2 h-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
}

// Avatar Group
interface AvatarGroupProps {
  avatars: Array<{ src?: string; address?: string; alt?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-gray-950 rounded-full">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-medium ring-2 ring-gray-950`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'glass';
}

export function Card({ 
  children, 
  className = '', 
  hoverable = false, 
  padding = 'md',
  variant = 'default'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-gray-900/50 border border-gray-800',
    gradient: 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  };

  return (
    <div
      className={`
        rounded-2xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverable ? 'hover:border-gray-700 hover:bg-gray-900/70 transition-all cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Badge/Chip Component
interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const chipVariants = {
  default: 'bg-gray-800 text-gray-300',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const chipSizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function Chip({ children, variant = 'default', size = 'md', icon, onRemove, className = '' }: ChipProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${chipVariants[variant]}
        ${chipSizes[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Divider Component
interface DividerProps {
  text?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ text, className = '', orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={`w-px h-full bg-gray-800 ${className}`} />;
  }

  if (text) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-sm text-gray-500">{text}</span>
        <div className="flex-1 h-px bg-gray-800" />
      </div>
    );
  }

  return <div className={`h-px bg-gray-800 ${className}`} />;
}

// Link Card Component
interface LinkCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  external?: boolean;
  className?: string;
}

export function LinkCard({ href, title, description, icon, external = false, className = '' }: LinkCardProps) {
  const content = (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl border border-gray-800
        bg-gray-900/50 hover:bg-gray-900 hover:border-gray-700
        transition-all group cursor-pointer
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-500 truncate">{description}</p>
        )}
      </div>
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

// Stat Pill Component
interface StatPillProps {
  value: string | number;
  label: string;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatPill({ value, label, trend, className = '' }: StatPillProps) {
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-800 ${className}`}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
      {trend && (
        <span className={`text-xs ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
  );
}

// Icon Button Component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'solid';
  label?: string;
}

export function IconButton({ 
  icon, 
  size = 'md', 
  variant = 'default', 
  label,
  className = '',
  ...props 
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    default: 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700',
    ghost: 'hover:bg-gray-800 text-gray-400 hover:text-white',
    solid: 'bg-blue-600 hover:bg-blue-500 text-white',
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg flex items-center justify-center transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}

// Badge Counter
interface BadgeCounterProps {
  count: number;
  max?: number;
  variant?: 'default' | 'dot';
  className?: string;
}

export function BadgeCounter({ count, max = 99, variant = 'default', className = '' }: BadgeCounterProps) {
  if (count === 0) return null;

  if (variant === 'dot') {
    return (
      <span className={`w-2 h-2 rounded-full bg-red-500 ${className}`} />
    );
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5
        text-xs font-medium text-white bg-red-500 rounded-full
        ${className}
      `}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}

// Section Component
interface SectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, action, children, className = '' }: SectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            {description && <p className="text-gray-500 mt-1">{description}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export default {
  Avatar,
  AvatarGroup,
  Card,
  Chip,
  Divider,
  LinkCard,
  StatPill,
  IconButton,
  BadgeCounter,
  Section,
};
