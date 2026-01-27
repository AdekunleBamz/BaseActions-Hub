'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import { Address } from 'viem';
import { V2_CONTRACTS } from '@/config/contracts-v2';

// ============================================================================
// V2 LEADERBOARD HOOK - Enhanced leaderboard with stats
// ============================================================================

export interface LeaderboardUser {
  address: Address;
  score: bigint;
  signaturesMade: number;
  signaturesReceived: number;
  reactionsGiven: number;
  reactionsReceived: number;
  tipsGiven: bigint;
  tipsReceived: bigint;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

export interface UserStats {
  signaturesMade: number;
  signaturesReceived: number;
  reactionsGiven: number;
  reactionsReceived: number;
  tipsGiven: bigint;
  tipsReceived: bigint;
  currentStreak: number;
  longestStreak: number;
  score: bigint;
  rank: number;
}

export interface UseLeaderboardV2Options {
  limit?: number;
  refreshInterval?: number;
}

export interface UseLeaderboardV2Return {
  // Data
  leaderboard: LeaderboardUser[];
  totalUsers: number;
  isLoading: boolean;
  error: Error | null;
  
  // Pagination
  page: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  
  // User Stats
  getUserStats: (address: Address) => Promise<UserStats | null>;
  getUserRank: (address: Address) => Promise<number>;
  
  // Current user
  myStats: UserStats | null;
  myRank: number | null;
}

// Leaderboard ABI
const LEADERBOARD_ABI = [
  {
    name: 'getTopUsers',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'limit', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'user', type: 'address' },
          { name: 'score', type: 'uint256' },
          { name: 'signaturesMade', type: 'uint256' },
          { name: 'signaturesReceived', type: 'uint256' },
          { name: 'reactionsGiven', type: 'uint256' },
          { name: 'reactionsReceived', type: 'uint256' },
          { name: 'tipsGiven', type: 'uint256' },
          { name: 'tipsReceived', type: 'uint256' },
          { name: 'currentStreak', type: 'uint256' },
          { name: 'longestStreak', type: 'uint256' }
        ]
      }
    ]
  },
  {
    name: 'getUserStats',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'signaturesMade', type: 'uint256' },
          { name: 'signaturesReceived', type: 'uint256' },
          { name: 'reactionsGiven', type: 'uint256' },
          { name: 'reactionsReceived', type: 'uint256' },
          { name: 'tipsGiven', type: 'uint256' },
          { name: 'tipsReceived', type: 'uint256' },
          { name: 'currentStreak', type: 'uint256' },
          { name: 'longestStreak', type: 'uint256' },
          { name: 'score', type: 'uint256' }
        ]
      }
    ]
  },
  {
    name: 'getUserRank',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getTotalUsers',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  }
] as const;

export function useLeaderboardV2(options: UseLeaderboardV2Options = {}): UseLeaderboardV2Return {
  const { limit = 100, refreshInterval = 60000 } = options;
  const { address: userAddress, isConnected } = useAccount();
  
  const [page, setPage] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  
  // Read top users
  const { data: topUsersData, isLoading, error, refetch } = useContractRead({
    address: V2_CONTRACTS.LEADERBOARD,
    abi: LEADERBOARD_ABI,
    functionName: 'getTopUsers',
    args: [BigInt(limit)],
  });
  
  // Read total users
  const { data: totalUsersData } = useContractRead({
    address: V2_CONTRACTS.LEADERBOARD,
    abi: LEADERBOARD_ABI,
    functionName: 'getTotalUsers',
  });
  
  // Read current user stats
  const { data: myStatsData } = useContractRead({
    address: V2_CONTRACTS.LEADERBOARD,
    abi: LEADERBOARD_ABI,
    functionName: 'getUserStats',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: isConnected && !!userAddress }
  });
  
  // Read current user rank
  const { data: myRankData } = useContractRead({
    address: V2_CONTRACTS.LEADERBOARD,
    abi: LEADERBOARD_ABI,
    functionName: 'getUserRank',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: isConnected && !!userAddress }
  });
  
  // Process leaderboard data
  useEffect(() => {
    if (topUsersData) {
      const processed = (topUsersData as any[]).map((user, index) => ({
        address: user.user as Address,
        score: user.score,
        signaturesMade: Number(user.signaturesMade),
        signaturesReceived: Number(user.signaturesReceived),
        reactionsGiven: Number(user.reactionsGiven),
        reactionsReceived: Number(user.reactionsReceived),
        tipsGiven: user.tipsGiven,
        tipsReceived: user.tipsReceived,
        currentStreak: Number(user.currentStreak),
        longestStreak: Number(user.longestStreak),
        rank: index + 1,
      }));
      setLeaderboard(processed);
    }
  }, [topUsersData]);
  
  // Auto refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        refetch();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, refetch]);
  
  // Get user stats
  const getUserStats = useCallback(async (address: Address): Promise<UserStats | null> => {
    // This would need to be implemented with a proper contract call
    // For now, return mock data
    const mockStats: UserStats = {
      signaturesMade: 47,
      signaturesReceived: 23,
      reactionsGiven: 156,
      reactionsReceived: 89,
      tipsGiven: BigInt(50000000000000000), // 0.05 ETH
      tipsReceived: BigInt(120000000000000000), // 0.12 ETH
      currentStreak: 5,
      longestStreak: 14,
      score: BigInt(5678),
      rank: 42,
    };
    return mockStats;
  }, []);
  
  // Get user rank
  const getUserRank = useCallback(async (address: Address): Promise<number> => {
    const user = leaderboard.find(u => u.address.toLowerCase() === address.toLowerCase());
    return user?.rank ?? 0;
  }, [leaderboard]);
  
  // Load more
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
    // In a real implementation, this would fetch more data
  }, []);
  
  // Refresh
  const refresh = useCallback(() => {
    setPage(0);
    refetch();
  }, [refetch]);
  
  // Process my stats
  const myStats: UserStats | null = myStatsData ? {
    signaturesMade: Number((myStatsData as any).signaturesMade),
    signaturesReceived: Number((myStatsData as any).signaturesReceived),
    reactionsGiven: Number((myStatsData as any).reactionsGiven),
    reactionsReceived: Number((myStatsData as any).reactionsReceived),
    tipsGiven: (myStatsData as any).tipsGiven,
    tipsReceived: (myStatsData as any).tipsReceived,
    currentStreak: Number((myStatsData as any).currentStreak),
    longestStreak: Number((myStatsData as any).longestStreak),
    score: (myStatsData as any).score,
    rank: myRankData ? Number(myRankData) : 0,
  } : null;
  
  const totalUsers = totalUsersData ? Number(totalUsersData) : 0;
  const hasMore = leaderboard.length < totalUsers;
  
  return {
    leaderboard,
    totalUsers,
    isLoading,
    error: error as Error | null,
    page,
    hasMore,
    loadMore,
    refresh,
    getUserStats,
    getUserRank,
    myStats,
    myRank: myRankData ? Number(myRankData) : null,
  };
}

export default useLeaderboardV2;
