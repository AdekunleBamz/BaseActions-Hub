"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { BadgeNFTABI } from "@/config/abis";
import { BADGE_IDS } from "@/lib/constants";
import { BADGES } from "@/config/badges";

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

  const earnedMap = {
    signer: hasSignerBadge || false,
    supporter: hasSupporterBadge || false,
    streak: hasStreakMasterBadge || false,
    whale: hasWhaleBadge || false,
  } as const;

  const badges = BADGES.map((badge) => ({
    id: badge.id,
    name: badge.name,
    emoji: badge.emoji,
    description: badge.description,
    earned: earnedMap[badge.id],
    gradient: badge.gradient,
  }));

  return { badges };
}
