"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI, BadgeNFTABI, GuestbookABI } from "@/config/abis";

export function useUserStats() {
  const { address, isConnected } = useAccount();

  const { data: userStats, isLoading: loadingStats } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
  });

  const { data: badgeCount, isLoading: loadingBadges } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "userBadgeCount",
    args: address ? [address] : undefined,
  });

  const { data: signatureCount, isLoading: loadingSignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: address ? [address] : undefined,
  });

  return {
    address,
    isConnected,
    userStats,
    badgeCount,
    signatureCount,
    isLoading: loadingStats || loadingBadges || loadingSignatures,
  };
}
