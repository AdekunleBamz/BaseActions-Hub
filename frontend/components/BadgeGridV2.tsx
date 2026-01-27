'use client';

import React from 'react';

interface Badge {
  id: number;
  type: number;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt?: number;
  imageUrl?: string;
}

interface BadgeGridProps {
  badges: Badge[];
  isLoading?: boolean;
  onBadgeClick?: (badge: Badge) => void;
  showLocked?: boolean;
  lockedBadges?: Badge[];
}

const rarityConfig = {
  common: {
    gradient: 'from-gray-500 to-gray-600',
    border: 'border-gray-500',
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    glow: '',
  },
  uncommon: {
    gradient: 'from-green-500 to-emerald-600',
    border: 'border-green-500',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  rare: {
    gradient: 'from-blue-500 to-cyan-600',
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  epic: {
    gradient: 'from-purple-500 to-pink-600',
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/30',
  },
  legendary: {
    gradient: 'from-yellow-500 to-orange-600',
    border: 'border-yellow-500',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30 animate-pulse-slow',
  },
};

const badgeEmojis: Record<number, string> = {
  0: '✍️', // SIGNER
  1: '💪', // SUPPORTER
  2: '🔥', // STREAK_3
  3: '⚡', // STREAK_7
  4: '🏆', // STREAK_30
  5: '🌟', // EARLY_ADOPTER
  6: '👑', // TOP_10
  7: '🐋', // WHALE
  8: '🎨', // COLLECTOR
  9: '📢', // INFLUENCER
};

export function BadgeGrid({
  badges,
  isLoading = false,
  onBadgeClick,
  showLocked = false,
  lockedBadges = [],
}: BadgeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const allBadges = showLocked 
    ? [...badges, ...lockedBadges.map(b => ({ ...b, isLocked: true }))]
    : badges;

  if (allBadges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-4xl">🏅</span>
        </div>
        <p className="text-gray-400 mb-2">No badges earned yet</p>
        <p className="text-sm text-gray-500">
          Start signing guestbooks to earn your first badge!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {allBadges.map((badge) => {
        const config = rarityConfig[badge.rarity];
        const isLocked = 'isLocked' in badge && badge.isLocked;

        return (
          <button
            key={`${badge.type}-${badge.id}`}
            onClick={() => !isLocked && onBadgeClick?.(badge)}
            disabled={isLocked}
            className={`
              relative aspect-square rounded-2xl p-4 
              border-2 transition-all transform
              ${isLocked
                ? 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed'
                : `${config.bg} ${config.border} hover:scale-105 cursor-pointer shadow-lg ${config.glow}`
              }
            `}
          >
            {/* Rarity indicator */}
            {!isLocked && (
              <div className={`
                absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs
                bg-gradient-to-r ${config.gradient} text-white font-medium
              `}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </div>
            )}

            {/* Badge Icon */}
            <div className="flex flex-col items-center justify-center h-full">
              <span className={`text-4xl mb-2 ${isLocked ? 'grayscale' : ''}`}>
                {badgeEmojis[badge.type] || '🏅'}
              </span>
              <p className={`text-sm font-medium text-center ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                {badge.name}
              </p>
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-2xl">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Badge Detail Modal
interface BadgeDetailProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeDetail({ badge, onClose }: BadgeDetailProps) {
  const config = rarityConfig[badge.rarity];

  return (
    <div className="p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center">
        {/* Badge Display */}
        <div className={`
          w-32 h-32 mx-auto mb-4 rounded-3xl 
          border-4 ${config.border} ${config.bg}
          flex items-center justify-center
          shadow-xl ${config.glow}
        `}>
          <span className="text-6xl">{badgeEmojis[badge.type] || '🏅'}</span>
        </div>

        {/* Rarity Badge */}
        <div className={`
          inline-block px-4 py-1 rounded-full text-sm font-medium mb-4
          bg-gradient-to-r ${config.gradient} text-white
        `}>
          {badge.rarity.toUpperCase()}
        </div>

        {/* Name & Description */}
        <h3 className="text-2xl font-bold text-white mb-2">{badge.name}</h3>
        <p className="text-gray-400 mb-6">{badge.description}</p>

        {/* Earned Date */}
        {badge.earnedAt && (
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Earned on</p>
            <p className="text-white font-medium">
              {new Date(badge.earnedAt * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Badge Counter
interface BadgeCounterProps {
  earned: number;
  total: number;
  className?: string;
}

export function BadgeCounter({ earned, total, className = '' }: BadgeCounterProps) {
  const percentage = Math.round((earned / total) * 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-400">
        {earned}/{total}
      </span>
    </div>
  );
}

export default BadgeGrid;
