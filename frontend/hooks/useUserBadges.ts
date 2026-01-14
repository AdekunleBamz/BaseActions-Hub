"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { BadgeNFTABI } from "@/config/abis";
import { BADGE_IDS } from "@/lib/constants";

export function useUserBadges() {
  const { address } = useAccount();

  const { data: hasSignerBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, BADGE_IDS.SIGNER] : undefined,
  });

  const { data: hasSupporterBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, BADGE_IDS.SUPPORTER] : undefined,
  });

  const { data: hasStreakMasterBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, BADGE_IDS.STREAK_MASTER] : undefined,
  });

  const { data: hasWhaleBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, BADGE_IDS.WHALE] : undefined,
  });

  const badges = [
    {
      id: "signer",
      name: "Signer",
      emoji: "✍️",
      description: "First signature given",
      earned: hasSignerBadge || false,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "supporter",
      name: "Supporter",
      emoji: "💝",
      description: "First signature received",
      earned: hasSupporterBadge || false,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "streak",
      name: "Streak Master",
      emoji: "🔥",
      description: "7 day streak",
      earned: hasStreakMasterBadge || false,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "whale",
      name: "Whale",
      emoji: "🐋",
      description: "100+ signatures",
      earned: hasWhaleBadge || false,
      gradient: "from-blue-600 to-indigo-600",
    },
  ];

  return { badges };
}
