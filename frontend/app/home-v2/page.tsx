"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from "wagmi";
import { PageWrapper } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { GuestbookABI } from "@/config/abis";
import { usePlatformStats } from "@/hooks";
import Link from "next/link";

// Enhanced Hero Section with animated elements
function EnhancedHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />
      
      {/* Floating orbs */}
      <div
        className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
          top: '10%',
          left: '10%',
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
        style={{
          transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)`,
          bottom: '10%',
          right: '10%',
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          top: '50%',
          left: '50%',
        }}
      />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-blue-400 text-sm font-medium">Live on Base Mainnet</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            BaseActions
          </span>
          <span className="block text-white mt-2">Hub</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The first on-chain guestbook platform. Sign, earn badges, compete on leaderboards — all powered by Base.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/sign"
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Signing
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
          
          <Link
            href="/leaderboard"
            className="px-8 py-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-semibold text-lg hover:bg-gray-800 hover:border-gray-600 transition-all"
          >
            View Leaderboard
          </Link>
        </div>

        {/* Stats preview */}
        <div className="flex items-center justify-center gap-8 md:gap-16">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white">10K+</p>
            <p className="text-gray-500">Signatures</p>
          </div>
          <div className="w-px h-12 bg-gray-800" />
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white">5K+</p>
            <p className="text-gray-500">Users</p>
          </div>
          <div className="w-px h-12 bg-gray-800" />
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white">100+</p>
            <p className="text-gray-500">Badges Earned</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// Feature Cards Grid
function FeatureCardsSection() {
  const { isConnected, address } = useAccount();

  const { data: mySignatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: address ? [address] : undefined,
  });

  const features = [
    {
      icon: "✍️",
      title: "Sign Guestbooks",
      description: "Leave your mark on any wallet's guestbook for just 0.000001 ETH",
      href: "/sign",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: "📖",
      title: "My Guestbook",
      description: `View all signatures left on your guestbook${mySignatures ? ` (${mySignatures.toString()})` : ""}`,
      href: isConnected && address ? `/guestbook/${address}` : "/sign",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: "🏆",
      title: "Leaderboard",
      description: "Compete globally and climb the weekly rankings",
      href: "/leaderboard",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
    },
    {
      icon: "📊",
      title: "Stats & Badges",
      description: "Track progress and unlock achievement badges",
      href: "/stats",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A complete on-chain social experience built on Base
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group relative p-8 rounded-3xl bg-gradient-to-br ${feature.bgGradient} border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]`}
            >
              {/* Icon */}
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} items-center justify-center text-2xl mb-6 shadow-lg`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>

              {/* Arrow */}
              <div className="flex items-center text-gray-600 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">Explore</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksV2() {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Link your wallet to get started. We support MetaMask, Coinbase Wallet, and more.",
      icon: "🔗",
    },
    {
      number: "02",
      title: "Sign Guestbooks",
      description: "Find a guestbook and leave your signature with a personal message.",
      icon: "✍️",
    },
    {
      number: "03",
      title: "Earn Points & Badges",
      description: "Every signature earns points. Unlock badges for achievements.",
      icon: "🏅",
    },
    {
      number: "04",
      title: "Climb Leaderboard",
      description: "Compete with others and rise through the global rankings.",
      icon: "🚀",
    },
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Get started in minutes with these simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step card */}
                <div className="text-center">
                  {/* Number */}
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Points System Explainer
function PointsSystemSection() {
  const points = [
    { action: "Sign a guestbook", points: "+10 pts", icon: "✍️" },
    { action: "First sign of the day", points: "+5 bonus", icon: "🌟" },
    { action: "7-day streak", points: "+50 bonus", icon: "🔥" },
    { action: "Receive a signature", points: "+2 pts", icon: "📩" },
    { action: "Get a reaction", points: "+1 pt", icon: "❤️" },
    { action: "Refer a friend", points: "+25 pts", icon: "🎁" },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Earn Points & Rewards
            </h2>
            <p className="text-xl text-gray-500 mb-8">
              Every action counts. Build your reputation and climb the leaderboard.
            </p>

            <div className="space-y-4">
              {points.map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-white">{item.action}</span>
                  </div>
                  <span className="text-green-400 font-semibold">{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - badge preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative grid grid-cols-3 gap-4 p-8">
              {['🏆', '⭐', '🔥', '🚀', '💎', '👑'].map((emoji, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-4xl hover:scale-110 transition-transform"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of users already signing guestbooks and earning rewards on Base.
        </p>
        <Link
          href="/sign"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105"
        >
          Sign Your First Guestbook
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// Main Page Component
export default function HomePageV2() {
  return (
    <PageWrapper>
      <EnhancedHero />
      <FeatureCardsSection />
      <HowItWorksV2 />
      <PointsSystemSection />
      <CTASection />
    </PageWrapper>
  );
}
