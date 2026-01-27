'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import { Address } from 'viem';
import { V2_CONTRACTS, BADGE_TYPES } from '@/config/contracts-v2';

// ============================================================================
// V2 BADGES HOOK - Badge management and tracking
// ============================================================================

export interface Badge {
  id: number;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  isEarned: boolean;
  earnedAt?: number;
  tokenId?: bigint;
}

export interface UseBadgesV2Options {
  address?: Address;
}

export interface UseBadgesV2Return {
  // Data
  badges: Badge[];
  earnedBadges: Badge[];
  availableBadges: Badge[];
  totalEarned: number;
  totalBadges: number;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  refresh: () => void;
  
  // Helpers
  hasBadge: (badgeId: number) => boolean;
  getBadge: (badgeId: number) => Badge | undefined;
  getProgress: (badgeId: number) => { current: number; target: number; percent: number } | null;
}

// Badge metadata
const BADGE_METADATA: Omit<Badge, 'isEarned' | 'earnedAt' | 'tokenId'>[] = [
  { id: BADGE_TYPES.FIRST_SIGN, name: 'First Signature', description: 'Signed your first guestbook', emoji: '✍️', rarity: 'common', requirement: 'Sign 1 guestbook' },
  { id: BADGE_TYPES.RECEIVED_10, name: 'Popular', description: 'Received 10 signatures', emoji: '🌟', rarity: 'uncommon', requirement: 'Receive 10 signatures' },
  { id: BADGE_TYPES.RECEIVED_50, name: 'Celebrity', description: 'Received 50 signatures', emoji: '⭐', rarity: 'rare', requirement: 'Receive 50 signatures' },
  { id: BADGE_TYPES.RECEIVED_100, name: 'Superstar', description: 'Received 100 signatures', emoji: '💎', rarity: 'epic', requirement: 'Receive 100 signatures' },
  { id: BADGE_TYPES.SIGNED_10, name: 'Active Signer', description: 'Signed 10 guestbooks', emoji: '📝', rarity: 'uncommon', requirement: 'Sign 10 guestbooks' },
  { id: BADGE_TYPES.SIGNED_50, name: 'Power Signer', description: 'Signed 50 guestbooks', emoji: '💪', rarity: 'rare', requirement: 'Sign 50 guestbooks' },
  { id: BADGE_TYPES.SIGNED_100, name: 'Signature Legend', description: 'Signed 100 guestbooks', emoji: '🚀', rarity: 'epic', requirement: 'Sign 100 guestbooks' },
  { id: BADGE_TYPES.STREAK_3, name: 'On Fire', description: '3 day signing streak', emoji: '🔥', rarity: 'uncommon', requirement: '3 day streak' },
  { id: BADGE_TYPES.STREAK_7, name: 'Streak Master', description: '7 day signing streak', emoji: '🏆', rarity: 'rare', requirement: '7 day streak' },
  { id: BADGE_TYPES.STREAK_30, name: 'Monthly Devotion', description: '30 day signing streak', emoji: '📅', rarity: 'epic', requirement: '30 day streak' },
  { id: BADGE_TYPES.OG, name: 'OG', description: 'Early adopter badge', emoji: '🏛️', rarity: 'legendary', requirement: 'Join in first month' },
];

// BadgeNFT ABI
const BADGE_NFT_ABI = [
  {
    name: 'getUserBadges',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256[]' }]
  },
  {
    name: 'hasBadge',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'badgeType', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'getBadgeTokenId',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'badgeType', type: 'uint256' }
    ],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }]
  }
] as const;

export function useBadgesV2(options: UseBadgesV2Options = {}): UseBadgesV2Return {
  const { address: optionsAddress } = options;
  const { address: userAddress, isConnected } = useAccount();
  const targetAddress = optionsAddress || userAddress;
  
  const [badges, setBadges] = useState<Badge[]>([]);
  
  // Read user badges
  const { data: userBadgesData, isLoading, error, refetch } = useContractRead({
    address: V2_CONTRACTS.BADGE_NFT,
    abi: BADGE_NFT_ABI,
    functionName: 'getUserBadges',
    args: targetAddress ? [targetAddress] : undefined,
    query: { enabled: !!targetAddress }
  });
  
  // Process badges
  useEffect(() => {
    const earnedBadgeIds = new Set(
      userBadgesData ? (userBadgesData as bigint[]).map(id => Number(id)) : []
    );
    
    const processedBadges = BADGE_METADATA.map(meta => ({
      ...meta,
      isEarned: earnedBadgeIds.has(meta.id),
      earnedAt: earnedBadgeIds.has(meta.id) ? Date.now() : undefined, // Would need actual timestamp from contract
    }));
    
    setBadges(processedBadges);
  }, [userBadgesData]);
  
  // Check if has badge
  const hasBadge = useCallback((badgeId: number): boolean => {
    return badges.some(b => b.id === badgeId && b.isEarned);
  }, [badges]);
  
  // Get badge by ID
  const getBadge = useCallback((badgeId: number): Badge | undefined => {
    return badges.find(b => b.id === badgeId);
  }, [badges]);
  
  // Get progress for a badge (mock implementation)
  const getProgress = useCallback((badgeId: number): { current: number; target: number; percent: number } | null => {
    // This would be calculated from user stats
    const progressMap: Record<number, { current: number; target: number }> = {
      [BADGE_TYPES.FIRST_SIGN]: { current: 1, target: 1 },
      [BADGE_TYPES.RECEIVED_10]: { current: 5, target: 10 },
      [BADGE_TYPES.RECEIVED_50]: { current: 5, target: 50 },
      [BADGE_TYPES.RECEIVED_100]: { current: 5, target: 100 },
      [BADGE_TYPES.SIGNED_10]: { current: 7, target: 10 },
      [BADGE_TYPES.SIGNED_50]: { current: 7, target: 50 },
      [BADGE_TYPES.SIGNED_100]: { current: 7, target: 100 },
      [BADGE_TYPES.STREAK_3]: { current: 2, target: 3 },
      [BADGE_TYPES.STREAK_7]: { current: 2, target: 7 },
      [BADGE_TYPES.STREAK_30]: { current: 2, target: 30 },
    };
    
    const progress = progressMap[badgeId];
    if (!progress) return null;
    
    return {
      ...progress,
      percent: Math.min(100, (progress.current / progress.target) * 100),
    };
  }, []);
  
  // Refresh
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  const earnedBadges = badges.filter(b => b.isEarned);
  const availableBadges = badges.filter(b => !b.isEarned);
  
  return {
    badges,
    earnedBadges,
    availableBadges,
    totalEarned: earnedBadges.length,
    totalBadges: badges.length,
    isLoading,
    error: error as Error | null,
    refresh,
    hasBadge,
    getBadge,
    getProgress,
  };
}

export default useBadgesV2;
