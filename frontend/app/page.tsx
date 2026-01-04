"use client";

import { useAccount, useReadContract } from "wagmi";
import Link from "next/link";
import Image from "next/image";
import { PageWrapper, StatCard } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { BaseActionsHubABI, GuestbookABI, LeaderboardABI } from "@/config/abis";

export default function HomePage() {
  const { isConnected, address } = useAccount();

  const { data: totalActions } = useReadContract({
    address: CONTRACTS.BaseActionsHub,
    abi: BaseActionsHubABI,
    functionName: "totalActions",
  });

  const { data: totalSignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "totalSignatures",
  });

  const { data: totalUsers } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "totalUsers",
  });

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
        {/* Background Orbs */}
        <div className="orb orb-blue w-96 h-96 -top-48 -left-48 animate-pulse-glow" />
        <div className="orb orb-purple w-80 h-80 top-20 right-0 animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="orb orb-cyan w-64 h-64 bottom-0 left-1/4 animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          {/* Main Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo Animation */}
            <div className="relative w-24 h-24 mx-auto mb-8 animate-float">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50" />
              <Image
                src="/icon-512.png"
                alt="BaseActions Hub"
                fill
                className="relative rounded-3xl"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">BaseActions</span>
              <span className="block text-white mt-2">Hub</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Sign on-chain guestbooks, earn achievement badges, and compete
              on the leaderboard — all on Base blockchain.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link href="/sign" className="btn-primary text-lg py-4 px-8">
                <span>Start Signing ✍️</span>
              </Link>
              <Link href="/leaderboard" className="btn-secondary text-lg py-4 px-8">
                View Leaderboard
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="badge badge-blue">⚡ Built on Base</span>
              <span className="badge badge-purple">🔐 On-chain Verified</span>
              <span className="badge badge-green">🏅 NFT Badges</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Platform Stats</h2>
          <p className="text-gray-500">Real-time on-chain data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            value={totalActions?.toString() || "0"}
            label="Total Actions"
            icon="⚡"
            color="blue"
          />
          <StatCard
            value={totalSignatures?.toString() || "0"}
            label="Signatures"
            icon="✍️"
            color="purple"
          />
          <StatCard
            value={totalUsers?.toString() || "0"}
            label="Active Users"
            icon="👥"
            color="cyan"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
          <p className="text-gray-500">Choose your adventure</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-white/5 p-8 transition-all hover:border-white/10 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
              />

              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center text-blue-400 text-sm font-medium">
                  Get started
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Share Guestbook Section */}
      {isConnected && address && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="gradient-border rounded-2xl p-8 text-center">
            <div className="text-3xl mb-4">📣</div>
            <h3 className="text-xl font-bold text-white mb-2">Share Your Guestbook</h3>
            <p className="text-gray-400 mb-4">Let others sign your on-chain guestbook</p>
            <div className="glass rounded-xl p-4 max-w-xl mx-auto">
              <code className="text-sm text-blue-400 break-all">
                {typeof window !== "undefined" ? window.location.origin : ""}/guestbook/{address}
              </code>
            </div>
            <button
              onClick={() => {
                const url = `${window.location.origin}/guestbook/${address}`;
                navigator.clipboard.writeText(url);
              }}
              className="mt-4 btn-secondary py-2 px-6 text-sm"
            >
              Copy Link 📋
            </button>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-12 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-500">Simple, fun, and rewarding</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Connect Wallet",
              description: "Connect your wallet to start signing guestbooks on Base",
              icon: "🔗",
            },
            {
              step: "02",
              title: "Sign & Earn",
              description: "Sign guestbooks for 0.0001 ETH and earn points + badges",
              icon: "✨",
            },
            {
              step: "03",
              title: "Climb Ranks",
              description: "Build streaks, collect badges, and top the leaderboard",
              icon: "🚀",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20" />
                <div className="relative w-full h-full flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
              </div>
              <div className="text-xs font-bold text-blue-400 mb-2">{item.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
