"use client";

import { useAccount, useReadContract } from "wagmi";
import { PageWrapper } from "@/components/Layout";
import {
  FeatureCard,
  HeroBackground,
  HeroSection,
  TrustBadges,
  HowItWorksSection,
  ShareGuestbook,
  StatsGrid,
} from "@/components";
import { usePlatformStats } from "@/hooks";
import { CONTRACTS } from "@/config/contracts";
import { GuestbookABI } from "@/config/abis";

export default function HomePage() {
  const { isConnected, address } = useAccount();

  const { totalActions, totalSignatures, totalUsers } = usePlatformStats();

  const { data: mySignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: address ? [address] : undefined,
  });

  const features = [
    {
      id: "sign-guestbooks",
      icon: "📝",
      title: "Sign Guestbooks",
      description: "Leave your mark on anyone's on-chain guestbook for just 0.0001 ETH",
      href: "/sign",
      color: "blue" as const,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "my-guestbook",
      icon: "📖",
      title: "My Guestbook",
      description: `View and share signatures on your guestbook${mySignatures ? ` (${mySignatures.toString()} signatures)` : ""}`,
      href: isConnected && address ? `/guestbook/${address}` : "/sign",
      color: "purple" as const,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "leaderboard",
      icon: "🏆",
      title: "Leaderboard",
      description: "Compete with others and climb the rankings",
      href: "/leaderboard",
      color: "green" as const,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "my-stats",
      icon: "📊",
      title: "My Stats",
      description: "Track your points, badges, and daily streaks",
      href: "/stats",
      color: "orange" as const,
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroBackground />

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          {/* Main Hero Content */}
          <HeroSection
            title={
              <>
                <span className="gradient-text">BaseActions</span>
                <span className="block text-white mt-2">Hub</span>
              </>
            }
            subtitle="Sign on-chain guestbooks, earn achievement badges, and compete on the leaderboard — all on Base blockchain."
            primaryCta={{ label: "Start Signing ✍️", href: "/sign" }}
            secondaryCta={{ label: "View Leaderboard", href: "/leaderboard" }}
          />
          <TrustBadges />
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Platform Stats</h2>
          <p className="text-gray-500">Real-time on-chain data</p>
        </div>

        <StatsGrid
          columns={3}
          stats={[
            {
              value: totalActions?.toString() || "0",
              label: "Total Actions",
              icon: "⚡",
              color: "blue",
            },
            {
              value: totalSignatures?.toString() || "0",
              label: "Signatures",
              icon: "✍️",
              color: "purple",
            },
            {
              value: totalUsers?.toString() || "0",
              label: "Active Users",
              icon: "👥",
              color: "cyan",
            },
          ]}
        />
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
          <p className="text-gray-500">Choose your adventure</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </section>

      {/* Share Guestbook Section */}
      {isConnected && address && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <ShareGuestbook address={address} />
        </section>
      )}

      {/* How It Works */}
      <HowItWorksSection />
    </PageWrapper>
  );
}
