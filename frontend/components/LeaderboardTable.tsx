'use client';

import React from 'react';

interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  points: number;
  signatures: number;
  streak: number;
  badges: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  showStreak?: boolean;
  showBadges?: boolean;
  onRowClick?: (entry: LeaderboardEntry) => void;
}

export function LeaderboardTable({
  entries,
  isLoading = false,
  showStreak = true,
  showBadges = true,
  onRowClick,
}: LeaderboardTableProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <span className="text-sm">🥇</span>
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
            <span className="text-sm">🥈</span>
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <span className="text-sm">🥉</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-400">{rank}</span>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Points</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Signs</th>
              {showStreak && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Streak</th>}
              {showBadges && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Badges</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-800/50">
                <td className="px-4 py-4">
                  <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-16 bg-gray-800 rounded animate-pulse ml-auto" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-12 bg-gray-800 rounded animate-pulse ml-auto" />
                </td>
                {showStreak && (
                  <td className="px-4 py-4">
                    <div className="h-4 w-12 bg-gray-800 rounded animate-pulse ml-auto" />
                  </td>
                )}
                {showBadges && (
                  <td className="px-4 py-4">
                    <div className="h-4 w-8 bg-gray-800 rounded animate-pulse ml-auto" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Signs</th>
            {showStreak && (
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
            )}
            {showBadges && (
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {entries.map((entry) => (
            <tr
              key={entry.address}
              onClick={() => onRowClick?.(entry)}
              className={`
                transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-gray-800/50' : ''}
                ${entry.isCurrentUser ? 'bg-blue-900/20' : ''}
              `}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                {getRankIcon(entry.rank)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                  <div>
                    <div className="font-medium text-white">
                      {entry.ensName || formatAddress(entry.address)}
                    </div>
                    {entry.ensName && (
                      <div className="text-xs text-gray-500">
                        {formatAddress(entry.address)}
                      </div>
                    )}
                  </div>
                  {entry.isCurrentUser && (
                    <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                      You
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <span className="text-white font-medium">
                  {entry.points.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <span className="text-gray-400">
                  {entry.signatures.toLocaleString()}
                </span>
              </td>
              {showStreak && (
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <span className={`
                    ${entry.streak >= 7 ? 'text-orange-400' : 'text-gray-400'}
                  `}>
                    {entry.streak > 0 ? `🔥 ${entry.streak}` : '-'}
                  </span>
                </td>
              )}
              {showBadges && (
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <span className="text-gray-400">
                    {entry.badges > 0 ? `🏅 ${entry.badges}` : '-'}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Leaderboard Podium Component
interface LeaderboardPodiumProps {
  top3: LeaderboardEntry[];
}

export function LeaderboardPodium({ top3 }: LeaderboardPodiumProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const orderedTop3 = [top3[1], top3[0], top3[2]].filter(Boolean);

  const heights = ['h-24', 'h-32', 'h-20'];
  const colors = [
    'from-gray-400/20 to-gray-500/20 border-gray-400',
    'from-yellow-400/20 to-yellow-500/20 border-yellow-400',
    'from-amber-600/20 to-amber-700/20 border-amber-600',
  ];

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {orderedTop3.map((entry, index) => (
        <div key={entry?.address || index} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-2 border-2 border-white/20" />
          <p className="font-medium text-white text-sm mb-1">
            {entry?.ensName || (entry?.address ? formatAddress(entry.address) : '-')}
          </p>
          <p className="text-xs text-gray-400 mb-2">
            {entry?.points.toLocaleString() || 0} pts
          </p>
          <div
            className={`
              w-20 ${heights[index]} rounded-t-lg
              bg-gradient-to-t ${colors[index]} border-t-2
              flex items-start justify-center pt-2
            `}
          >
            <span className="text-2xl">
              {index === 0 ? '🥈' : index === 1 ? '🥇' : '🥉'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Leaderboard Filters
interface LeaderboardFiltersProps {
  timeframe: 'all' | 'weekly' | 'monthly';
  onTimeframeChange: (timeframe: 'all' | 'weekly' | 'monthly') => void;
}

export function LeaderboardFilters({
  timeframe,
  onTimeframeChange,
}: LeaderboardFiltersProps) {
  const timeframes = [
    { value: 'all' as const, label: 'All Time' },
    { value: 'weekly' as const, label: 'This Week' },
    { value: 'monthly' as const, label: 'This Month' },
  ];

  return (
    <div className="flex gap-2">
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onTimeframeChange(tf.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${timeframe === tf.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}

export default LeaderboardTable;
