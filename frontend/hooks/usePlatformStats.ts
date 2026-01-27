"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { BaseActionsHubABI, GuestbookABI, LeaderboardABI } from "@/config/abis";

export function usePlatformStats() {
  const { data: totalActions, isLoading: loadingActions } = useReadContract({
    address: CONTRACTS.BaseActionsHub,
    abi: BaseActionsHubABI,
    functionName: "totalActions",
  });

  const { data: totalSignatures, isLoading: loadingSignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "totalSignatures",
  });

  const { data: totalUsers, isLoading: loadingUsers } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "totalUsers",
  });

  return {
    totalActions,
    totalSignatures,
    totalUsers,
    isLoading: loadingActions || loadingSignatures || loadingUsers,
  };
}
