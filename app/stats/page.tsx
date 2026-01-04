"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import Link from "next/link";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI, BadgeNFTABI } from "@/config/abis";

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

  // Check individual badges
  const { data: hasSignerBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, 0] : undefined, // SIGNER = 0
  });

  const { data: hasSupporterBadge } = useReadContract({
    address: CONTRACTS.BadgeNFT,
    abi: BadgeNFTABI,
    functionName: "hasBadge",
    args: address ? [address, 1] : undefined, // SUPPORTER = 1
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            ⚡ BaseActions
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-white mb-2">My Stats</h1>
          {address && (
            <p className="text-gray-400 font-mono text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
        </div>

        {!isConnected ? (
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to view stats</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Points & Streak */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 text-center">
                <div className="text-4xl font-bold text-blue-400">
                  {userStats?.totalPoints?.toString() || "0"}
                </div>
                <div className="text-gray-400">Total Points</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30 text-center">
                <div className="text-4xl font-bold text-orange-400">
                  {userStats?.currentStreak?.toString() || "0"} 🔥
                </div>
                <div className="text-gray-400">Current Streak</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Activity</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Actions</span>
                  <span className="text-white font-bold">
                    {userStats?.actionsCount?.toString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Signatures Given</span>
                  <span className="text-white font-bold">
                    {userStats?.signaturesGiven?.toString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Signatures Received</span>
                  <span className="text-white font-bold">
                    {userStats?.signaturesReceived?.toString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longest Streak</span>
                  <span className="text-white font-bold">
                    {userStats?.longestStreak?.toString() || "0"} days
                  </span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Badges ({badgeCount?.toString() || "0"})
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border-2 text-center ${
                    hasSignerBadge
                      ? "bg-green-500/20 border-green-500"
                      : "bg-gray-900 border-gray-700 opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">✍️</div>
                  <div className="text-white font-bold">Signer</div>
                  <div className="text-xs text-gray-400">First signature</div>
                </div>
                <div
                  className={`p-4 rounded-xl border-2 text-center ${
                    hasSupporterBadge
                      ? "bg-green-500/20 border-green-500"
                      : "bg-gray-900 border-gray-700 opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">💝</div>
                  <div className="text-white font-bold">Supporter</div>
                  <div className="text-xs text-gray-400">Received signature</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/sign"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition"
              >
                Sign More Guestbooks 📝
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
