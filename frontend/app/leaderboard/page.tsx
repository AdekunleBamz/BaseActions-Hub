"use client";

import { PageWrapper } from "@/components/Layout";
import { BadgeGrid, ComingSoon, CTASection, PageHeader, PointsSystemSection, StatsGrid } from "@/components";
import { usePlatformStats } from "@/hooks";

export default function LeaderboardPage() {
  const { totalUsers, totalSignatures, totalActions } = usePlatformStats();

  const badges = [
    { id: "signer", name: "Signer", emoji: "✍️", description: "First signature", earned: false, gradient: "from-blue-500 to-cyan-500" },
    { id: "supporter", name: "Supporter", emoji: "💝", description: "First received", earned: false, gradient: "from-purple-500 to-pink-500" },
    { id: "streak", name: "Streak Master", emoji: "🔥", description: "7 day streak", earned: false, gradient: "from-orange-500 to-red-500" },
    { id: "whale", name: "Whale", emoji: "🐋", description: "100 signatures", earned: false, gradient: "from-blue-600 to-indigo-600" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <PageHeader
          icon="🏆"
          title="Leaderboard"
          description="Top signers and badge earners on BaseActions"
          gradient="from-yellow-500 to-orange-500"
        />

        {/* Global Stats */}
        <StatsGrid
          columns={3}
          stats={[
            { value: totalUsers?.toString() || "0", label: "Total Users", icon: "👥", color: "blue" },
            { value: totalSignatures?.toString() || "0", label: "Total Signatures", icon: "✍️", color: "purple" },
            { value: totalActions?.toString() || "0", label: "Total Actions", icon: "⚡", color: "cyan" },
          ]}
        />

        {/* Coming Soon Leaderboard */}
        <div className="mb-12">
          <ComingSoon
            title="Full Leaderboard Coming Soon"
            description="We&apos;re building an epic leaderboard with rankings, achievements, and more. Start earning points now to be at the top when it launches!"
            ctaLabel="Start Earning Points 📈"
            ctaHref="/sign"
          />
        </div>

        {/* Points System */}
        <PointsSystemSection />

        {/* Badges */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Achievement Badges</h2>
            <p className="text-gray-500">Collect NFT badges for your achievements</p>
          </div>

          <BadgeGrid badges={badges} />
        </div>

        {/* CTA */}
        <CTASection
          title="Ready to compete? 🚀"
          description="Start signing guestbooks to earn points and badges"
          primaryAction={{ label: "Sign Guestbooks ✍️", href: "/sign" }}
          secondaryAction={{ label: "View My Stats 📊", href: "/stats" }}
        />
      </div>
    </PageWrapper>
  );
}
