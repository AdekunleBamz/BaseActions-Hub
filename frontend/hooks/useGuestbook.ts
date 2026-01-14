"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { GuestbookABI, LeaderboardABI } from "@/config/abis";
import { MAX_SIGNATURES_PER_PAGE } from "@/lib/constants";

export function useGuestbook(ownerAddress: string) {
  const { data: signatureCount, isLoading: loadingCount } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: [ownerAddress as `0x${string}`],
  });

  const { data: signatures, isLoading: loadingSignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "getSignatures",
    args: [ownerAddress as `0x${string}`, BigInt(0), BigInt(MAX_SIGNATURES_PER_PAGE)],
  });

  const { data: ownerStats, isLoading: loadingStats } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "getUserStats",
    args: [ownerAddress as `0x${string}`],
  });

  return {
    signatureCount,
    signatures,
    ownerStats,
    isLoading: loadingCount || loadingSignatures || loadingStats,
  };
}
