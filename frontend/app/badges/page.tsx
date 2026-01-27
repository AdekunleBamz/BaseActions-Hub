'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatAddress } from '@/lib/utils';

// ============================================================================
// BADGES PAGE V2 - Badge Gallery with Filtering
// ============================================================================

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  earnedAt?: number;
  progress?: number;
  maxProgress?: number;
}

const BADGES: Badge[] = [
  // Common Badges
  { id: 'first-sign', name: 'First Signature', description: 'Signed your first guestbook', emoji: '✍️', rarity: 'common', requirement: 'Sign 1 guestbook', progress: 1, maxProgress: 1 },
  { id: 'first-receive', name: 'Welcome Guest', description: 'Received your first signature', emoji: '👋', rarity: 'common', requirement: 'Receive 1 signature' },
  { id: 'reactor', name: 'Reactor', description: 'Reacted to a signature', emoji: '❤️', rarity: 'common', requirement: 'React to 1 signature', progress: 1, maxProgress: 1 },
  
  // Uncommon Badges
  { id: 'sign-10', name: 'Active Signer', description: 'Signed 10 guestbooks', emoji: '📝', rarity: 'uncommon', requirement: 'Sign 10 guestbooks', progress: 7, maxProgress: 10 },
  { id: 'receive-10', name: 'Popular', description: 'Received 10 signatures', emoji: '🌟', rarity: 'uncommon', requirement: 'Receive 10 signatures', progress: 5, maxProgress: 10 },
  { id: 'streak-3', name: 'On Fire', description: '3 day signing streak', emoji: '🔥', rarity: 'uncommon', requirement: '3 day streak', progress: 2, maxProgress: 3 },
  
  // Rare Badges
  { id: 'sign-50', name: 'Power Signer', description: 'Signed 50 guestbooks', emoji: '💪', rarity: 'rare', requirement: 'Sign 50 guestbooks', progress: 25, maxProgress: 50 },
  { id: 'receive-50', name: 'Celebrity', description: 'Received 50 signatures', emoji: '⭐', rarity: 'rare', requirement: 'Receive 50 signatures', progress: 18, maxProgress: 50 },
  { id: 'streak-7', name: 'Streak Master', description: '7 day signing streak', emoji: '🏆', rarity: 'rare', requirement: '7 day streak', progress: 3, maxProgress: 7 },
  { id: 'react-100', name: 'Love Machine', description: 'Gave 100 reactions', emoji: '💕', rarity: 'rare', requirement: 'React 100 times', progress: 42, maxProgress: 100 },
  
  // Epic Badges
  { id: 'sign-100', name: 'Signature Legend', description: 'Signed 100 guestbooks', emoji: '🚀', rarity: 'epic', requirement: 'Sign 100 guestbooks', progress: 25, maxProgress: 100 },
  { id: 'receive-100', name: 'Superstar', description: 'Received 100 signatures', emoji: '💎', rarity: 'epic', requirement: 'Receive 100 signatures', progress: 18, maxProgress: 100 },
  { id: 'streak-30', name: 'Monthly Devotion', description: '30 day signing streak', emoji: '📅', rarity: 'epic', requirement: '30 day streak', progress: 3, maxProgress: 30 },
  
  // Legendary Badges
  { id: 'sign-500', name: 'Hall of Fame', description: 'Signed 500 guestbooks', emoji: '👑', rarity: 'legendary', requirement: 'Sign 500 guestbooks', progress: 25, maxProgress: 500 },
  { id: 'og', name: 'OG', description: 'Early adopter badge', emoji: '🏛️', rarity: 'legendary', requirement: 'Join in first month', earnedAt: Date.now() },
  { id: 'whale', name: 'Whale', description: 'Top 10 on leaderboard', emoji: '🐋', rarity: 'legendary', requirement: 'Reach top 10' },
];

const RARITY_COLORS = {
  common: { bg: 'from-gray-400 to-gray-500', border: 'border-gray-400', text: 'text-gray-600' },
  uncommon: { bg: 'from-green-400 to-emerald-500', border: 'border-green-400', text: 'text-green-600' },
  rare: { bg: 'from-blue-400 to-cyan-500', border: 'border-blue-400', text: 'text-blue-600' },
  epic: { bg: 'from-purple-400 to-pink-500', border: 'border-purple-400', text: 'text-purple-600' },
  legendary: { bg: 'from-amber-400 to-orange-500', border: 'border-amber-400', text: 'text-amber-600' },
};

export default function BadgesPageV2() {
  const { address, isConnected } = useAccount();
  const [selectedRarity, setSelectedRarity] = useState<'all' | Badge['rarity']>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = selectedRarity === 'all' 
    ? BADGES 
    : BADGES.filter(b => b.rarity === selectedRarity);

  const earnedBadges = BADGES.filter(b => b.earnedAt || (b.progress && b.progress >= (b.maxProgress || 1)));
  const inProgressBadges = BADGES.filter(b => !b.earnedAt && b.progress && b.progress < (b.maxProgress || 1));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Badge Collection
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Earn NFT badges for your achievements on BaseActions Hub
            </p>
          </div>

          {/* Summary Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{earnedBadges.length}</span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">/ {BADGES.length} Earned</span>
            </div>
            <div className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressBadges.length}</span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Rarity Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedRarity === rarity
                  ? rarity === 'all'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : `bg-gradient-to-r ${RARITY_COLORS[rarity as Badge['rarity']].bg} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBadges.map((badge) => (
            <BadgeCardV2
              key={badge.id}
              badge={badge}
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredBadges.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏅</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No badges found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try selecting a different rarity filter
            </p>
          </div>
        )}

        {/* Rarity Guide */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Rarity Guide</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
              const count = BADGES.filter(b => b.rarity === rarity).length;
              const colors = RARITY_COLORS[rarity];
              return (
                <div key={rarity} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-2`}>
                    <span className="text-white text-xl">
                      {rarity === 'common' && '⚪'}
                      {rarity === 'uncommon' && '🟢'}
                      {rarity === 'rare' && '🔵'}
                      {rarity === 'epic' && '🟣'}
                      {rarity === 'legendary' && '🟡'}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">{rarity}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{count} badges</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}

function BadgeCardV2({ badge, onClick }: { badge: Badge; onClick: () => void }) {
  const isEarned = badge.earnedAt || (badge.progress && badge.progress >= (badge.maxProgress || 1));
  const colors = RARITY_COLORS[badge.rarity];
  const progressPercent = badge.maxProgress 
    ? Math.min(100, (badge.progress || 0) / badge.maxProgress * 100) 
    : 0;

  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
        isEarned
          ? `${colors.border} bg-white dark:bg-gray-800`
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60 hover:opacity-100'
      }`}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${colors.text} bg-gray-100 dark:bg-gray-700`}>
        {badge.rarity}
      </div>

      {/* Badge icon */}
      <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-3 ${
        isEarned
          ? `bg-gradient-to-br ${colors.bg}`
          : 'bg-gray-100 dark:bg-gray-700 grayscale'
      }`}>
        {badge.emoji}
      </div>

      {/* Badge info */}
      <h3 className="font-semibold text-gray-900 dark:text-white text-center text-sm">
        {badge.name}
      </h3>

      {/* Progress bar */}
      {!isEarned && badge.maxProgress && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            {badge.progress}/{badge.maxProgress}
          </p>
        </div>
      )}

      {/* Earned check */}
      {isEarned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

function BadgeDetailModal({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const isEarned = badge.earnedAt || (badge.progress && badge.progress >= (badge.maxProgress || 1));
  const colors = RARITY_COLORS[badge.rarity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className={`h-32 bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
          <span className="text-6xl">{badge.emoji}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{badge.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.text} bg-gray-100 dark:bg-gray-800 capitalize`}>
              {badge.rarity}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{badge.description}</p>

          {/* Requirement */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Requirement</p>
            <p className="font-medium text-gray-900 dark:text-white">{badge.requirement}</p>
            
            {/* Progress */}
            {badge.maxProgress && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {badge.progress}/{badge.maxProgress}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
                    style={{ width: `${((badge.progress || 0) / badge.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          {isEarned ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Badge Earned!</span>
            </div>
          ) : (
            <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all">
              Start Progress
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
