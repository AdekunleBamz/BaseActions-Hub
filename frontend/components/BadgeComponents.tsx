'use client';

import React, { useState } from 'react';
import { Card, Chip, Avatar } from './DisplayComponents';

// Badge data
const BADGES = [
  {
    id: 0,
    name: 'First Sign',
    description: 'Signed your first guestbook',
    emoji: '✍️',
    rarity: 'common',
    color: 'from-gray-500 to-gray-600',
  },
  {
    id: 1,
    name: 'Explorer',
    description: 'Signed 10 different guestbooks',
    emoji: '🧭',
    rarity: 'common',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: 'Social Butterfly',
    description: 'Signed 50 guestbooks',
    emoji: '🦋',
    rarity: 'uncommon',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    name: 'Streak Master',
    description: 'Maintained a 7-day signing streak',
    emoji: '🔥',
    rarity: 'uncommon',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    name: 'Collector',
    description: 'Collected 100+ reactions on your messages',
    emoji: '⭐',
    rarity: 'rare',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 5,
    name: 'Pioneer',
    description: 'One of the first 1000 users',
    emoji: '🚀',
    rarity: 'rare',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 6,
    name: 'Influencer',
    description: 'Referred 10 new users',
    emoji: '💫',
    rarity: 'epic',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 7,
    name: 'OG',
    description: 'Participated in the beta launch',
    emoji: '👑',
    rarity: 'legendary',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 8,
    name: 'Whale',
    description: 'Top 10 on the leaderboard',
    emoji: '🐋',
    rarity: 'legendary',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 9,
    name: 'VIP',
    description: 'Special recognition badge',
    emoji: '💎',
    rarity: 'legendary',
    color: 'from-purple-400 to-pink-400',
  },
];

const RARITY_COLORS = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

// Single Badge Card
interface BadgeCardProps {
  badgeId: number;
  earned?: boolean;
  earnedAt?: Date;
  tokenId?: number;
  onClick?: () => void;
}

export function BadgeCard({ badgeId, earned = false, earnedAt, onClick }: BadgeCardProps) {
  const badge = BADGES[badgeId];
  if (!badge) return null;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
        earned
          ? `bg-gradient-to-br ${badge.color} shadow-lg hover:shadow-xl hover:scale-105`
          : 'bg-gray-900 border border-gray-800 opacity-50 grayscale hover:opacity-70'
      }`}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS]}`} />

      {/* Badge emoji */}
      <div className="text-5xl mb-4">{badge.emoji}</div>

      {/* Badge info */}
      <h3 className="font-bold text-white mb-1">{badge.name}</h3>
      <p className="text-sm text-white/70">{badge.description}</p>

      {/* Earned date */}
      {earned && earnedAt && (
        <p className="text-xs text-white/50 mt-3">
          Earned {earnedAt.toLocaleDateString()}
        </p>
      )}

      {/* Lock icon for unearned */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Badge Grid
interface BadgeGridProps {
  earnedBadges: { badgeId: number; earnedAt: Date; tokenId?: number }[];
  showAll?: boolean;
  onBadgeClick?: (badgeId: number) => void;
}

export function BadgeGrid({ earnedBadges, showAll = false, onBadgeClick }: BadgeGridProps) {
  const earnedMap = new Map(earnedBadges.map((b) => [b.badgeId, b]));

  const badgesToShow = showAll
    ? BADGES
    : BADGES.filter((b) => earnedMap.has(b.id));

  if (badgesToShow.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-white mb-2">No badges yet</h3>
        <p className="text-gray-500">Start signing guestbooks to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {badgesToShow.map((badge) => {
        const earnedData = earnedMap.get(badge.id);
        return (
          <BadgeCard
            key={badge.id}
            badgeId={badge.id}
            earned={!!earnedData}
            earnedAt={earnedData?.earnedAt}
            tokenId={earnedData?.tokenId}
            onClick={() => onBadgeClick?.(badge.id)}
          />
        );
      })}
    </div>
  );
}

// Badge Detail Modal Content
interface BadgeDetailProps {
  badgeId: number;
  earned?: boolean;
  earnedAt?: Date;
  tokenId?: number;
  holdersCount?: number;
}

export function BadgeDetail({ badgeId, earned, earnedAt, tokenId, holdersCount }: BadgeDetailProps) {
  const badge = BADGES[badgeId];
  if (!badge) return null;

  const rarityLabel = badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1);

  return (
    <div className="text-center">
      {/* Large badge */}
      <div
        className={`w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center text-6xl bg-gradient-to-br ${badge.color} shadow-2xl`}
      >
        {badge.emoji}
      </div>

      {/* Name and rarity */}
      <h2 className="text-2xl font-bold text-white mb-2">{badge.name}</h2>
      <Chip variant={badge.rarity === 'legendary' ? 'warning' : 'default'}>
        {rarityLabel}
      </Chip>

      {/* Description */}
      <p className="text-gray-400 mt-4 mb-6">{badge.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gray-900">
          <p className="text-2xl font-bold text-white">{holdersCount || '?'}</p>
          <p className="text-sm text-gray-500">Holders</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900">
          <p className="text-2xl font-bold text-white">
            {earned ? 'Owned' : 'Locked'}
          </p>
          <p className="text-sm text-gray-500">Status</p>
        </div>
      </div>

      {/* Earned info */}
      {earned && tokenId && (
        <div className="p-4 rounded-xl bg-green-900/20 border border-green-500/30 mb-6">
          <p className="text-green-400 text-sm">
            Token ID: #{tokenId} • Earned on {earnedAt?.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* How to earn */}
      {!earned && (
        <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30">
          <p className="text-blue-400 text-sm">
            <span className="font-medium">How to earn:</span> {badge.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Profile Badge Summary
interface BadgeSummaryProps {
  earnedBadges: { badgeId: number; earnedAt: Date }[];
  maxDisplay?: number;
}

export function BadgeSummary({ earnedBadges, maxDisplay = 5 }: BadgeSummaryProps) {
  const displayBadges = earnedBadges.slice(0, maxDisplay);
  const remaining = earnedBadges.length - maxDisplay;

  return (
    <div className="flex items-center gap-1">
      {displayBadges.map((earnedBadge) => {
        const badge = BADGES[earnedBadge.badgeId];
        return badge ? (
          <div
            key={earnedBadge.badgeId}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${badge.color}`}
            title={badge.name}
          >
            {badge.emoji}
          </div>
        ) : null;
      })}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium bg-gray-800 text-gray-400">
          +{remaining}
        </div>
      )}
      {earnedBadges.length === 0 && (
        <span className="text-sm text-gray-500">No badges</span>
      )}
    </div>
  );
}

// Badge Progress
interface BadgeProgressProps {
  badgeId: number;
  currentValue: number;
  targetValue: number;
}

export function BadgeProgress({ badgeId, currentValue, targetValue }: BadgeProgressProps) {
  const badge = BADGES[badgeId];
  if (!badge) return null;

  const progress = Math.min((currentValue / targetValue) * 100, 100);
  const isComplete = currentValue >= targetValue;

  return (
    <Card className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isComplete ? `bg-gradient-to-br ${badge.color}` : 'bg-gray-800'
        }`}
      >
        {badge.emoji}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-white">{badge.name}</span>
          <span className="text-sm text-gray-500">
            {currentValue}/{targetValue}
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${badge.color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isComplete && (
        <Chip variant="success" size="sm">
          Claimable
        </Chip>
      )}
    </Card>
  );
}

// Rarity Filter
interface RarityFilterProps {
  selectedRarity: string | null;
  onRarityChange: (rarity: string | null) => void;
}

export function RarityFilter({ selectedRarity, onRarityChange }: RarityFilterProps) {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => onRarityChange(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedRarity === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        All
      </button>
      {rarities.map((rarity) => (
        <button
          key={rarity}
          onClick={() => onRarityChange(rarity)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            selectedRarity === rarity
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${RARITY_COLORS[rarity as keyof typeof RARITY_COLORS]}`} />
          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
        </button>
      ))}
    </div>
  );
}

// Export badge data for use elsewhere
export { BADGES, RARITY_COLORS };

export default {
  BadgeCard,
  BadgeGrid,
  BadgeDetail,
  BadgeSummary,
  BadgeProgress,
  RarityFilter,
  BADGES,
  RARITY_COLORS,
};
