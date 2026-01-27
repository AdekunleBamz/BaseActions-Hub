"use client";

import { useMemo, useCallback } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { BaseActionsHubABI, GuestbookABI, LeaderboardABI } from "@/config/abis";

// Longer cache time for platform stats as they change less frequently
const queryOptions = {
  staleTime: 60_000, // 1 minute
  gcTime: 10 * 60_000, // 10 minutes
  refetchOnWindowFocus: false, // Prevent excessive refetches
} as const;

export function usePlatformStats() {
  const { 
    data: totalActions, 
    isLoading: loadingActions,
    refetch: refetchActions,
  } = useReadContract({
    address: CONTRACTS.BaseActionsHub,
    abi: BaseActionsHubABI,
    functionName: "totalActions",
    query: queryOptions,
  });

  const { 
    data: totalSignatures, 
    isLoading: loadingSignatures,
    refetch: refetchSignatures,
  } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "totalSignatures",
    query: queryOptions,
  });

  const { 
    data: totalUsers, 
    isLoading: loadingUsers,
    refetch: refetchUsers,
  } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "totalUsers",
    query: queryOptions,
  });

  // Memoized refetch function
  const refetch = useCallback(() => {
    return Promise.all([
      refetchActions(),
      refetchSignatures(),
      refetchUsers(),
    ]);
  }, [refetchActions, refetchSignatures, refetchUsers]);

  // Memoize loading state
  const isLoading = useMemo(
    () => loadingActions || loadingSignatures || loadingUsers,
    [loadingActions, loadingSignatures, loadingUsers]
  );

  // Memoize stats object to prevent unnecessary re-renders
  const stats = useMemo(() => ({
    totalActions: totalActions ? Number(totalActions) : 0,
    totalSignatures: totalSignatures ? Number(totalSignatures) : 0,
    totalUsers: totalUsers ? Number(totalUsers) : 0,
  }), [totalActions, totalSignatures, totalUsers]);

  return {
    ...stats,
    totalActionsRaw: totalActions,
    totalSignaturesRaw: totalSignatures,
    totalUsersRaw: totalUsers,
    isLoading,
    refetch,
  };
}
