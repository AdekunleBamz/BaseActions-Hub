"use client";

import { useReadContract } from "wagmi";
import Link from "next/link";
import { PageWrapper, StatCard } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI, GuestbookABI, BaseActionsHubABI } from "@/config/abis";

export default function LeaderboardPage() {
  const { data: totalUsers } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "totalUsers",
  });

  const { data: totalSignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "totalSignatures",
  });

  const { data: totalActions } = useReadContract({
    address: CONTRACTS.BaseActionsHub,
    abi: BaseActionsHubABI,
    functionName: "totalActions",
  });

  const pointsSystem = [
    { action: "Sign a guestbook", points: "+10", color: "blue", icon: "✍️" },
    { action: "Receive a signature", points: "+5", color: "purple", icon: "📥" },
    { action: "Daily streak bonus", points: "+2 × streak", color: "orange", icon: "🔥" },
    { action: "First signature (badge)", points: "+25", color: "green", icon: "🏅" },
  ];

  const badges = [
    { name: "Signer", description: "First signature", emoji: "✍️", requirement: "Sign 1 guestbook" },
    { name: "Supporter", description: "First received", emoji: "💝", requirement: "Receive 1 signature" },
    { name: "Streak Master", description: "7 day streak", emoji: "🔥", requirement: "Keep 7 day streak" },
    { name: "Whale", description: "100 signatures", emoji: "🐋", requirement: "Sign 100 guestbooks" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl animate-float">
            🏆
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Leaderboard
          </h1>
          <p className="text-gray-400">
            Top signers and badge earners on BaseActions
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <StatCard
            value={totalUsers?.toString() || "0"}
            label="Total Users"
            icon="👥"
            color="blue"
          />
          <StatCard
            value={totalSignatures?.toString() || "0"}
            label="Total Signatures"
            icon="✍️"
            color="purple"
          />
          <StatCard
            value={totalActions?.toString() || "0"}
            label="Total Actions"
            icon="⚡"
            color="cyan"
          />
        </div>

        {/* Coming Soon Leaderboard */}
        <div className="glass rounded-2xl p-8 mb-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Full Leaderboard Coming Soon
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              We&apos;re building an epic leaderboard with rankings, achievements, and more.
              Start earning points now to be at the top when it launches!
            </p>
            
            <Link href="/sign" className="btn-primary inline-block py-3 px-8">
              <span>Start Earning Points 📈</span>
            </Link>
          </div>
        </div>

        {/* Points System */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Points System</h2>
            <p className="text-gray-500">How to earn points and climb the ranks</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pointsSystem.map((item, i) => (
              <div
                key={i}
                className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-white/10 transition"
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.action}</p>
                </div>
                <div className={`text-${item.color}-400 font-bold text-lg`}>
                  {item.points}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Achievement Badges</h2>
            <p className="text-gray-500">Collect NFT badges for your achievements</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 text-center group hover:border-white/10 transition"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {badge.emoji}
                </div>
                <h3 className="font-bold text-white mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-500">{badge.requirement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="gradient-border rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            Ready to compete? 🚀
          </h3>
          <p className="text-gray-400 mb-6">
            Start signing guestbooks to earn points and badges
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sign" className="btn-primary py-3 px-8">
              <span>Sign Guestbooks ✍️</span>
            </Link>
            <Link href="/stats" className="btn-secondary py-3 px-8">
              View My Stats 📊
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
