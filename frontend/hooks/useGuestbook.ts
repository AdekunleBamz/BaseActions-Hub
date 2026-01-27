"use client";

import { useMemo, useCallback } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { GuestbookABI, LeaderboardABI } from "@/config/abis";
import { MAX_SIGNATURES_PER_PAGE } from "@/lib/constants";

// Shared query options for consistent caching
const queryOptions = {
  staleTime: 30_000, // 30 seconds
  gcTime: 5 * 60_000, // 5 minutes (formerly cacheTime)
} as const;

export function useGuestbook(ownerAddress: string) {
  // Validate and memoize the address to prevent unnecessary re-renders
  const validAddress = useMemo(
    () => (ownerAddress?.startsWith("0x") ? (ownerAddress as `0x${string}`) : undefined),
    [ownerAddress]
  );

  const enabled = !!validAddress;

  const { 
    data: signatureCount, 
    isLoading: loadingCount,
    refetch: refetchCount 
  } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: validAddress ? [validAddress] : undefined,
    query: {
      enabled,
      ...queryOptions,
    },
  });

  const { 
    data: signatures, 
    isLoading: loadingSignatures,
    refetch: refetchSignatures 
  } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "getSignatures",
    args: validAddress ? [validAddress, BigInt(0), BigInt(MAX_SIGNATURES_PER_PAGE)] : undefined,
    query: {
      enabled,
      ...queryOptions,
    },
  });

  const { 
    data: ownerStats, 
    isLoading: loadingStats,
    refetch: refetchStats 
  } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "getUserStats",
    args: validAddress ? [validAddress] : undefined,
    query: {
      enabled,
      ...queryOptions,
    },
  });

  // Memoized refetch all function
  const refetchAll = useCallback(() => {
    return Promise.all([
      refetchCount(),
      refetchSignatures(),
      refetchStats(),
    ]);
  }, [refetchCount, refetchSignatures, refetchStats]);

  // Memoize the loading state calculation
  const isLoading = useMemo(
    () => enabled && (loadingCount || loadingSignatures || loadingStats),
    [enabled, loadingCount, loadingSignatures, loadingStats]
  );

  return {
    signatureCount,
    signatures,
    ownerStats,
    isLoading,
    refetchAll,
    isValidAddress: enabled,
  };
}
