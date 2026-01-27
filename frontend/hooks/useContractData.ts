'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { GuestbookABI, LeaderboardABI, BadgeNFTABI } from '@/config/abis';

/**
 * Hook to fetch user's complete profile data
 */
export function useUserProfile(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: targetAddress ? [
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'signatureCount',
        args: [targetAddress],
      },
      {
        address: CONTRACTS.Leaderboard,
        abi: LeaderboardABI,
        functionName: 'getUserStats',
        args: [targetAddress],
      },
      {
        address: CONTRACTS.BadgeNFT,
        abi: BadgeNFTABI,
        functionName: 'balanceOf',
        args: [targetAddress],
      },
    ] : [],
  });

  const profile = useMemo(() => {
    if (!data) return null;

    const [signatureCount, userStats, badgeCount] = data;

    return {
      signatureCount: signatureCount?.result ? Number(signatureCount.result) : 0,
      totalPoints: userStats?.result ? Number(userStats.result[0]) : 0,
      totalSignatures: userStats?.result ? Number(userStats.result[1]) : 0,
      totalReactions: userStats?.result ? Number(userStats.result[2]) : 0,
      currentStreak: userStats?.result ? Number(userStats.result[3]) : 0,
      badgeCount: badgeCount?.result ? Number(badgeCount.result) : 0,
    };
  }, [data]);

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch guestbook signatures with pagination
 */
export function useGuestbookSignatures(
  guestbookOwner: `0x${string}`,
  page: number = 0,
  pageSize: number = 10
) {
  const [signatures, setSignatures] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: countData } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'signatureCount',
        args: [guestbookOwner],
      },
    ],
  });

  const { data: signaturesData, refetch } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'getSignatures',
        args: [guestbookOwner, BigInt(page * pageSize), BigInt(pageSize)],
      },
    ],
  });

  useEffect(() => {
    if (countData?.[0]?.result) {
      setTotalCount(Number(countData[0].result));
    }
  }, [countData]);

  useEffect(() => {
    if (signaturesData?.[0]?.result) {
      setSignatures(signaturesData[0].result as any[]);
    }
    setIsLoading(false);
  }, [signaturesData]);

  return {
    signatures,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch leaderboard with pagination
 */
export function useLeaderboard(
  timeframe: 'all' | 'monthly' | 'weekly' = 'all',
  page: number = 0,
  pageSize: number = 20
) {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real implementation, this would call the Leaderboard contract
  // For now, we'll use mock data structure

  useEffect(() => {
    // Simulating API call
    setIsLoading(false);
  }, [timeframe, page, pageSize]);

  return {
    entries,
    isLoading,
    timeframe,
  };
}

/**
 * Hook to fetch user's badges
 */
export function useUserBadgesV2(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data } = useReadContracts({
    contracts: targetAddress ? [
      {
        address: CONTRACTS.BadgeNFT,
        abi: BadgeNFTABI,
        functionName: 'balanceOf',
        args: [targetAddress],
      },
    ] : [],
  });

  useEffect(() => {
    if (data?.[0]?.result) {
      // Would need to enumerate tokens owned by user
      // For now, just get the count
      setIsLoading(false);
    }
  }, [data]);

  return {
    badges,
    badgeCount: data?.[0]?.result ? Number(data[0].result) : 0,
    isLoading,
  };
}

/**
 * Hook to fetch platform-wide statistics
 */
export function usePlatformStatsV2() {
  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'totalSignatures',
      },
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'totalReactions',
      },
      {
        address: CONTRACTS.Leaderboard,
        abi: LeaderboardABI,
        functionName: 'totalUsers',
      },
      {
        address: CONTRACTS.BadgeNFT,
        abi: BadgeNFTABI,
        functionName: 'totalSupply',
      },
    ],
  });

  const stats = useMemo(() => {
    if (!data) return null;

    return {
      totalSignatures: data[0]?.result ? Number(data[0].result) : 0,
      totalReactions: data[1]?.result ? Number(data[1].result) : 0,
      totalUsers: data[2]?.result ? Number(data[2].result) : 0,
      totalBadges: data[3]?.result ? Number(data[3].result) : 0,
    };
  }, [data]);

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for transaction state management
 */
export function useTransactionState() {
  const [state, setState] = useState<{
    status: 'idle' | 'pending' | 'confirming' | 'success' | 'error';
    hash?: string;
    error?: Error;
  }>({ status: 'idle' });

  const reset = () => setState({ status: 'idle' });

  const setPending = () => setState({ status: 'pending' });

  const setConfirming = (hash: string) => setState({ status: 'confirming', hash });

  const setSuccess = (hash: string) => setState({ status: 'success', hash });

  const setError = (error: Error) => setState({ status: 'error', error });

  return {
    ...state,
    isPending: state.status === 'pending',
    isConfirming: state.status === 'confirming',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    reset,
    setPending,
    setConfirming,
    setSuccess,
    setError,
  };
}

/**
 * Hook for reaction state
 */
export function useReaction(
  guestbookOwner: `0x${string}`,
  signatureIndex: number
) {
  const { address } = useAccount();

  const { data, refetch } = useReadContracts({
    contracts: address ? [
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'hasReacted',
        args: [guestbookOwner, BigInt(signatureIndex), address],
      },
      {
        address: CONTRACTS.Guestbook,
        abi: GuestbookABI,
        functionName: 'getReactionCount',
        args: [guestbookOwner, BigInt(signatureIndex)],
      },
    ] : [],
  });

  return {
    hasReacted: data?.[0]?.result || false,
    reactionCount: data?.[1]?.result ? Number(data[1].result) : 0,
    refetch,
  };
}

export default {
  useUserProfile,
  useGuestbookSignatures,
  useLeaderboard,
  useUserBadgesV2,
  usePlatformStatsV2,
  useTransactionState,
  useReaction,
};
