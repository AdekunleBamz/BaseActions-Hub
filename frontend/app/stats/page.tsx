"use client";

import { useAccount, useReadContract } from "wagmi";
import Link from "next/link";
import { PageWrapper, StatCard } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI, BadgeNFTABI, GuestbookABI } from "@/config/abis";

export default function StatsPage() {
  const { isConnected, address } = useAccount();

  const { data: userStats } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
  });

  const { data: badgeCount } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "userBadgeCount",
    args: address ? [address] : undefined,
  });

  const { data: signatureCount } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: address ? [address] : undefined,
  });

  // Check individual badges
  const { data: hasSignerBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, 0] : undefined,
  });

  const { data: hasSupporterBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, 1] : undefined,
  });

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const badges = [
    {
      id: "signer",
      name: "Signer",
      emoji: "✍️",
      description: "First signature given",
      earned: hasSignerBadge,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "supporter",
      name: "Supporter",
      emoji: "💝",
      description: "First signature received",
      earned: hasSupporterBadge,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "streak",
      name: "Streak Master",
      emoji: "🔥",
      description: "7 day streak",
      earned: false,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "whale",
      name: "Whale",
      emoji: "🐋",
      description: "100+ signatures",
      earned: false,
      gradient: "from-blue-600 to-indigo-600",
    },
  ];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl animate-float">
            📊
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            My Stats
          </h1>
          {address && (
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="text-gray-400 font-mono text-sm">{formatAddress(address)}</span>
            </div>
          )}
        </div>

        {!isConnected ? (
          /* Not Connected State */
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your stats and achievements
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                value={userStats?.totalPoints?.toString() || "0"}
                label="Total Points"
                icon="⭐"
                color="blue"
              />
              <StatCard
                value={userStats?.currentStreak?.toString() || "0"}
                label="Current Streak"
                icon="🔥"
                color="orange"
              />
              <StatCard
                value={badgeCount?.toString() || "0"}
                label="Badges Earned"
                icon="🏅"
                color="purple"
              />
              <StatCard
                value={signatureCount?.toString() || "0"}
                label="Guestbook Sigs"
                icon="📖"
                color="cyan"
              />
            </div>

            {/* Detailed Activity */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📈</span> Activity Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <span className="text-gray-400">Total Actions</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {userStats?.actionsCount?.toString() || "0"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📤</span>
                    <span className="text-gray-400">Signatures Given</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {userStats?.signaturesGiven?.toString() || "0"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📥</span>
                    <span className="text-gray-400">Signatures Received</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {userStats?.signaturesReceived?.toString() || "0"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <span className="text-gray-400">Longest Streak</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {userStats?.longestStreak?.toString() || "0"} days
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏅</span> My Badges
                <span className="ml-auto badge badge-purple text-xs">
                  {badgeCount?.toString() || "0"} / {badges.length}
                </span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative rounded-xl p-5 text-center transition-all ${
                      badge.earned
                        ? "glass border-2 border-green-500/50"
                        : "bg-gray-900/50 border border-white/5 opacity-50"
                    }`}
                  >
                    {badge.earned && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                    
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3 ${
                        badge.earned
                          ? `bg-gradient-to-br ${badge.gradient}`
                          : "bg-gray-800"
                      }`}
                    >
                      {badge.emoji}
                    </div>
                    
                    <h3 className="font-bold text-white mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share & Actions */}
            <div className="gradient-border rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-4">
                Share your guestbook to earn more! 🚀
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href={`/guestbook/${address}`}
                  className="btn-primary py-3 px-6"
                >
                  <span>View My Guestbook 📖</span>
                </Link>
                <Link
                  href="/sign"
                  className="btn-secondary py-3 px-6"
                >
                  Sign More Guestbooks ✍️
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
