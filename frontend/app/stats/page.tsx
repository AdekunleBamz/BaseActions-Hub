"use client";

import { PageWrapper } from "@/components/Layout";
import {
  ActivityDetails,
  BadgeGrid,
  ConnectWalletPrompt,
  CTASection,
  PageHeader,
  StatsGrid,
  AddressDisplay,
  Badge,
} from "@/components";
import { useUserBadges, useUserStats } from "@/hooks";

export default function StatsPage() {
  const { address, isConnected, userStats, badgeCount, signatureCount } = useUserStats();
  const { badges } = useUserBadges();

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <PageHeader
          icon="📊"
          title="My Stats"
          badge={address ? <AddressDisplay address={address} /> : undefined}
        />

        {!isConnected ? (
          /* Not Connected State */
          <ConnectWalletPrompt
            title="Connect Your Wallet"
            description="Connect your wallet to view your stats and achievements"
          />
        ) : (
          <div className="space-y-8">
            {/* Main Stats */}
            <StatsGrid
              columns={4}
              stats={[
                {
                  value: userStats?.totalPoints?.toString() || "0",
                  label: "Total Points",
                  icon: "⭐",
                  color: "blue",
                },
                {
                  value: userStats?.currentStreak?.toString() || "0",
                  label: "Current Streak",
                  icon: "🔥",
                  color: "orange",
                },
                {
                  value: badgeCount?.toString() || "0",
                  label: "Badges Earned",
                  icon: "🏅",
                  color: "purple",
                },
                {
                  value: signatureCount?.toString() || "0",
                  label: "Guestbook Sigs",
                  icon: "📖",
                  color: "cyan",
                },
              ]}
            />

            {/* Detailed Activity */}
            <ActivityDetails stats={userStats || {}} />

            {/* Badges Section */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏅</span> My Badges
                <Badge variant="purple" size="sm" className="ml-auto">
                  {badgeCount?.toString() || "0"} / {badges.length}
                </Badge>
              </h2>

              <BadgeGrid badges={badges} />
            </div>

            {/* Share & Actions */}
            <CTASection
              title="Share your guestbook to earn more! 🚀"
              description="Start signing guestbooks to earn points and badges"
              primaryAction={{ label: "View My Guestbook 📖", href: `/guestbook/${address}` }}
              secondaryAction={{ label: "Sign More Guestbooks ✍️", href: "/sign" }}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
