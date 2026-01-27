'use client';

import React from 'react';

// Skeleton Component for loading states
interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height, 
  animate = true 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-800';
  const animateClasses = animate ? 'animate-pulse' : '';
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-md',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div 
      className={`${baseClasses} ${animateClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Skeleton Text Lines
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          height="1rem"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

// Card Skeleton
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 rounded-2xl bg-gray-900/50 border border-gray-800 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" className="w-1/3" />
          <Skeleton height="0.75rem" className="w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

// Signature Card Skeleton
export function SkeletonSignatureCard() {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton height="1rem" className="w-24" />
            <Skeleton height="0.75rem" className="w-16" />
          </div>
          <Skeleton height="0.875rem" className="w-full" />
          <Skeleton height="0.875rem" className="w-2/3" />
        </div>
      </div>
    </div>
  );
}

// Leaderboard Row Skeleton
export function SkeletonLeaderboardRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <Skeleton width={24} height={24} className="rounded" />
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton height="1rem" className="w-32 mb-2" />
        <Skeleton height="0.75rem" className="w-20" />
      </div>
      <div className="text-right">
        <Skeleton height="1rem" className="w-16 mb-2" />
        <Skeleton height="0.75rem" className="w-12" />
      </div>
    </div>
  );
}

// Stats Card Skeleton
export function SkeletonStatsCard() {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton height="1rem" className="w-24" />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <Skeleton height="2rem" className="w-20 mb-2" />
      <Skeleton height="0.75rem" className="w-16" />
    </div>
  );
}

// Badge Grid Skeleton
export function SkeletonBadgeGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
          <Skeleton variant="circular" width={64} height={64} className="mx-auto mb-3" />
          <Skeleton height="1rem" className="w-20 mx-auto mb-2" />
          <Skeleton height="0.75rem" className="w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Profile Skeleton
export function SkeletonProfile() {
  return (
    <div className="flex flex-col items-center text-center p-8">
      <Skeleton variant="circular" width={96} height={96} className="mb-4" />
      <Skeleton height="1.5rem" className="w-48 mb-2" />
      <Skeleton height="1rem" className="w-32 mb-4" />
      <div className="flex gap-4 justify-center">
        <Skeleton height="0.875rem" className="w-20" />
        <Skeleton height="0.875rem" className="w-20" />
        <Skeleton height="0.875rem" className="w-20" />
      </div>
    </div>
  );
}

// Table Skeleton
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-gray-900/80 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="1rem" className={i === 0 ? 'w-12' : 'flex-1'} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="p-4 flex gap-4 border-t border-gray-800"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              height="1rem" 
              className={colIndex === 0 ? 'w-12' : 'flex-1'} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Activity Feed Skeleton
export function SkeletonActivityFeed({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton variant="circular" width={36} height={36} />
          <div className="flex-1">
            <Skeleton height="0.875rem" className="w-full mb-2" />
            <Skeleton height="0.75rem" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Navigation Skeleton
export function SkeletonNavigation() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton height="1.25rem" className="w-32" />
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Skeleton height="1rem" className="w-16" />
        <Skeleton height="1rem" className="w-16" />
        <Skeleton height="1rem" className="w-16" />
        <Skeleton height="1rem" className="w-16" />
      </div>
      <Skeleton height="2.5rem" className="w-32 rounded-xl" />
    </div>
  );
}

// Form Skeleton
export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton height="1rem" className="w-20 mb-2" />
        <Skeleton height="3rem" className="w-full rounded-xl" />
      </div>
      <div>
        <Skeleton height="1rem" className="w-24 mb-2" />
        <Skeleton height="6rem" className="w-full rounded-xl" />
      </div>
      <Skeleton height="3rem" className="w-full rounded-xl" />
    </div>
  );
}

export default {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonSignatureCard,
  SkeletonLeaderboardRow,
  SkeletonStatsCard,
  SkeletonBadgeGrid,
  SkeletonProfile,
  SkeletonTable,
  SkeletonActivityFeed,
  SkeletonNavigation,
  SkeletonForm,
};
