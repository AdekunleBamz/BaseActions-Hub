'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export function StatsCardV2({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  size = 'md',
}: StatsCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const valueSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const variantClasses = {
    default: 'bg-gray-900/50 border border-gray-800',
    gradient: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30',
    glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
  };

  return (
    <div className={`rounded-2xl ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className={`font-bold text-white ${valueSizes[size]}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      <div className="flex items-center justify-between mt-1">
        {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <svg className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>{trend.value}%</span>
            {trend.label && <span className="text-gray-500">{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Grid Component
interface StatsGridV2Props {
  stats: Array<{
    id: string;
    title: string;
    value: string | number;
    icon?: string;
    color?: string;
  }>;
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}

export function StatsGridV2({ stats, columns = 4, isLoading = false }: StatsGridV2Props) {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid ${columnClasses[columns]} gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800 animate-pulse">
            <div className="h-3 w-16 bg-gray-800 rounded mb-3" />
            <div className="h-8 w-24 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-4`}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            {stat.icon && <span className="text-lg">{stat.icon}</span>}
            <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.title}</span>
          </div>
          <p className={`text-2xl font-bold ${stat.color || 'text-white'}`}>
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// User Stats Profile Card
interface UserStatsProfileProps {
  address: string;
  ensName?: string;
  totalPoints: number;
  rank?: number;
  signatures: number;
  streak: number;
  badges: number;
  joinedAt?: number;
  isLoading?: boolean;
}

export function UserStatsProfile({
  address,
  ensName,
  totalPoints,
  rank,
  signatures,
  streak,
  badges,
  joinedAt,
  isLoading = false,
}: UserStatsProfileProps) {
  const formatAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-800" />
          <div>
            <div className="h-6 w-32 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-800 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 w-12 mx-auto bg-gray-800 rounded mb-1" />
              <div className="h-3 w-16 mx-auto bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          {rank && rank <= 10 && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold">
              #{rank}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            {ensName || formatAddress(address)}
          </h3>
          {ensName && (
            <p className="text-sm text-gray-500">{formatAddress(address)}</p>
          )}
          {joinedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Joined {new Date(joinedAt * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-xl bg-gray-800/50">
          <p className="text-2xl font-bold text-blue-400">{totalPoints.toLocaleString()}</p>
          <p className="text-xs text-gray-500 uppercase">Points</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-800/50">
          <p className="text-2xl font-bold text-green-400">{signatures.toLocaleString()}</p>
          <p className="text-xs text-gray-500 uppercase">Signs</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-800/50">
          <p className="text-2xl font-bold text-orange-400">
            {streak > 0 ? `🔥 ${streak}` : '-'}
          </p>
          <p className="text-xs text-gray-500 uppercase">Streak</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-800/50">
          <p className="text-2xl font-bold text-purple-400">
            {badges > 0 ? `🏅 ${badges}` : '-'}
          </p>
          <p className="text-xs text-gray-500 uppercase">Badges</p>
        </div>
      </div>
    </div>
  );
}

// Activity Feed Item
interface ActivityItemProps {
  type: 'sign' | 'badge' | 'reaction' | 'streak';
  title: string;
  description: string;
  timestamp: number;
  icon?: string;
}

export function ActivityItem({
  type,
  title,
  description,
  timestamp,
  icon,
}: ActivityItemProps) {
  const typeIcons = {
    sign: '✍️',
    badge: '🏅',
    reaction: '❤️',
    streak: '🔥',
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts * 1000;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
        {icon || typeIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0">
        {formatTime(timestamp)}
      </span>
    </div>
  );
}

export default StatsCardV2;
