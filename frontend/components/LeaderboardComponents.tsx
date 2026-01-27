'use client';

import React, { useState } from 'react';
import { Card, Avatar, Chip } from './DisplayComponents';
import { Tabs } from './OverlayComponents';

// Leaderboard Entry interface
interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  avatar?: string;
  points: number;
  signatureCount: number;
  badgeCount: number;
  streak?: number;
  change?: 'up' | 'down' | 'same' | 'new';
}

// Leaderboard Header with timeframe selector
interface LeaderboardHeaderProps {
  timeframe: 'all' | 'monthly' | 'weekly';
  onTimeframeChange: (tf: 'all' | 'monthly' | 'weekly') => void;
  totalParticipants: number;
  lastUpdated?: Date;
}

export function LeaderboardHeader({
  timeframe,
  onTimeframeChange,
  totalParticipants,
  lastUpdated,
}: LeaderboardHeaderProps) {
  const tabs = [
    { id: 'all', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">
            {totalParticipants.toLocaleString()} participants competing for glory
          </p>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={timeframe}
          onChange={(tf) => onTimeframeChange(tf as 'all' | 'monthly' | 'weekly')}
          variant="pills"
        />
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

// Top 3 Podium
interface PodiumProps {
  entries: LeaderboardEntry[];
}

export function Podium({ entries }: PodiumProps) {
  const [first, second, third] = entries;

  const PodiumSpot = ({
    entry,
    position,
  }: {
    entry: LeaderboardEntry | undefined;
    position: 1 | 2 | 3;
  }) => {
    if (!entry) return null;

    const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
    const colors = {
      1: 'from-yellow-500 to-amber-600',
      2: 'from-gray-300 to-gray-400',
      3: 'from-amber-700 to-amber-800',
    };
    const crowns = { 1: '👑', 2: '🥈', 3: '🥉' };
    const order = { 1: 'order-2', 2: 'order-1', 3: 'order-3' };

    const shortAddress = `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`;

    return (
      <div className={`flex flex-col items-center ${order[position]}`}>
        {/* Medal */}
        <div className="text-3xl mb-2">{crowns[position]}</div>

        {/* Avatar */}
        <div className="relative">
          <Avatar
            src={entry.avatar}
            name={entry.ensName || entry.address}
            size="lg"
            className="ring-4 ring-gray-800"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center text-sm font-bold text-white">
            {position}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="font-semibold text-white truncate max-w-24">
            {entry.ensName || shortAddress}
          </p>
          <p className="text-xl font-bold text-white">
            {entry.points.toLocaleString()}
            <span className="text-sm text-gray-500 ml-1">pts</span>
          </p>
        </div>

        {/* Podium */}
        <div
          className={`w-24 ${heights[position]} mt-4 rounded-t-xl bg-gradient-to-b ${colors[position]} flex items-end justify-center pb-4`}
        >
          <span className="text-4xl font-bold text-white/30">{position}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-8 py-8">
      <div className="flex items-end justify-center gap-4">
        <PodiumSpot entry={second} position={2} />
        <PodiumSpot entry={first} position={1} />
        <PodiumSpot entry={third} position={3} />
      </div>
    </Card>
  );
}

// Leaderboard Row
interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export function LeaderboardRow({ entry, isCurrentUser }: LeaderboardRowProps) {
  const shortAddress = `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`;

  const changeIcons = {
    up: (
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    same: <span className="text-gray-500">-</span>,
    new: <Chip size="sm" variant="success">NEW</Chip>,
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
        isCurrentUser
          ? 'bg-blue-900/20 border border-blue-500/30'
          : 'hover:bg-gray-800/50'
      }`}
    >
      {/* Rank */}
      <div className="w-12 text-center">
        <span className="text-xl font-bold text-gray-400">#{entry.rank}</span>
      </div>

      {/* Change indicator */}
      <div className="w-6">{entry.change && changeIcons[entry.change]}</div>

      {/* Avatar */}
      <Avatar
        src={entry.avatar}
        name={entry.ensName || entry.address}
        size="md"
      />

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">
            {entry.ensName || shortAddress}
          </span>
          {isCurrentUser && (
            <Chip size="sm" variant="primary">You</Chip>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{entry.signatureCount} signatures</span>
          <span>{entry.badgeCount} badges</span>
          {entry.streak && entry.streak > 0 && (
            <span className="text-orange-400">🔥 {entry.streak} day streak</span>
          )}
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <span className="text-xl font-bold text-white">
          {entry.points.toLocaleString()}
        </span>
        <span className="text-gray-500 ml-1">pts</span>
      </div>
    </div>
  );
}

// Leaderboard Table
interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserAddress?: string;
  showPodium?: boolean;
}

export function LeaderboardTable({
  entries,
  currentUserAddress,
  showPodium = true,
}: LeaderboardTableProps) {
  const podiumEntries = showPodium ? entries.slice(0, 3) : [];
  const tableEntries = showPodium ? entries.slice(3) : entries;

  return (
    <div>
      {showPodium && podiumEntries.length >= 3 && <Podium entries={podiumEntries} />}

      <Card className="divide-y divide-gray-800">
        {tableEntries.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No entries to display
          </div>
        ) : (
          tableEntries.map((entry) => (
            <LeaderboardRow
              key={entry.address}
              entry={entry}
              isCurrentUser={
                currentUserAddress?.toLowerCase() === entry.address.toLowerCase()
              }
            />
          ))
        )}
      </Card>
    </div>
  );
}

// User's Position Card
interface UserPositionCardProps {
  entry: LeaderboardEntry;
  totalParticipants: number;
}

export function UserPositionCard({ entry, totalParticipants }: UserPositionCardProps) {
  const percentile = Math.round((1 - entry.rank / totalParticipants) * 100);

  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
          #{entry.rank}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-1">Your Position</h3>
          <p className="text-gray-400">
            You're in the top {100 - percentile}% of all participants!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {entry.points.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{entry.signatureCount}</p>
            <p className="text-sm text-gray-500">Signatures</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{entry.badgeCount}</p>
            <p className="text-sm text-gray-500">Badges</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Stats Summary
interface LeaderboardStatsProps {
  stats: {
    totalPoints: number;
    totalSignatures: number;
    totalBadges: number;
    activeToday: number;
  };
}

export function LeaderboardStats({ stats }: LeaderboardStatsProps) {
  const statItems = [
    {
      label: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      icon: '⭐',
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      label: 'Total Signatures',
      value: stats.totalSignatures.toLocaleString(),
      icon: '✍️',
      color: 'from-blue-500/20 to-purple-500/20',
    },
    {
      label: 'Badges Earned',
      value: stats.totalBadges.toLocaleString(),
      icon: '🏆',
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'Active Today',
      value: stats.activeToday.toLocaleString(),
      icon: '🔥',
      color: 'from-red-500/20 to-pink-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat) => (
        <Card
          key={stat.label}
          className={`bg-gradient-to-br ${stat.color} border-0`}
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-sm text-gray-400">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}

// Pagination
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, i) =>
        typeof page === 'number' ? (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={i} className="text-gray-500">
            ...
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default {
  LeaderboardHeader,
  Podium,
  LeaderboardRow,
  LeaderboardTable,
  UserPositionCard,
  LeaderboardStats,
  Pagination,
};
