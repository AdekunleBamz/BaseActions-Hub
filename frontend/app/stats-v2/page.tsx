"use client";

import React, { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { PageWrapper } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI, GuestbookABI, BadgeNFTABI } from "@/config/abis";
import Link from "next/link";

// Stats Card
function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
    yellow: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border`}>
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
      {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
    </div>
  );
}

// Progress Ring
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  value,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  value: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            className="text-gray-800"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="text-gray-400 text-sm mt-2">{label}</span>
    </div>
  );
}

// Streak Display
function StreakDisplay({ currentStreak, bestStreak }: { currentStreak: number; bestStreak: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Streak</h3>
        <div className="text-3xl">🔥</div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium ${
                i < currentStreak % 7
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              {day}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-orange-400">{currentStreak}</p>
          <p className="text-gray-500 text-sm">Current Streak</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{bestStreak}</p>
          <p className="text-gray-500 text-sm">Best Streak</p>
        </div>
      </div>
    </div>
  );
}

// Badge Card Mini
function BadgeMini({ emoji, name, earned }: { emoji: string; name: string; earned: boolean }) {
  return (
    <div
      className={`p-4 rounded-xl text-center transition-all ${
        earned
          ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30'
          : 'bg-gray-900 border border-gray-800 opacity-50 grayscale'
      }`}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="text-sm text-white font-medium">{name}</p>
    </div>
  );
}

// Activity Item
function ActivityItem({
  type,
  message,
  timestamp,
}: {
  type: 'signed' | 'received' | 'badge' | 'streak';
  message: string;
  timestamp: Date;
}) {
  const icons = {
    signed: '✍️',
    received: '📩',
    badge: '🏆',
    streak: '🔥',
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
      <div className="text-2xl">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{message}</p>
      </div>
      <p className="text-gray-500 text-xs">{formatTime(timestamp)}</p>
    </div>
  );
}

// Connect Prompt
function ConnectPrompt() {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-6xl mb-6">📊</div>
      <h2 className="text-2xl font-bold text-white mb-3">
        Connect Your Wallet
      </h2>
      <p className="text-gray-400 mb-8">
        Connect your wallet to view your personal stats, badges, and activity.
      </p>
      <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105">
        Connect Wallet
      </button>
    </div>
  );
}

// Main Stats Page
export default function StatsPageV2() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');

  // Read user data from contracts
  const { data: userPoints } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: 'userPoints',
    args: address ? [address] : undefined,
  });

  const { data: signatureCount } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: 'signatureCount',
    args: address ? [address] : undefined,
  });

  const { data: receivedCount } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: 'receivedCount',
    args: address ? [address] : undefined,
  });

  // Mock data for badges and activity
  const badges = [
    { emoji: '✍️', name: 'First Sign', earned: true },
    { emoji: '🧭', name: 'Explorer', earned: true },
    { emoji: '🦋', name: 'Butterfly', earned: false },
    { emoji: '🔥', name: 'Streak Master', earned: true },
    { emoji: '⭐', name: 'Collector', earned: false },
    { emoji: '🚀', name: 'Pioneer', earned: false },
  ];

  const recentActivity = [
    { type: 'signed' as const, message: 'Signed vitalik.eth\'s guestbook', timestamp: new Date(Date.now() - 3600000) },
    { type: 'received' as const, message: 'Received signature from 0xabc...def', timestamp: new Date(Date.now() - 7200000) },
    { type: 'badge' as const, message: 'Earned "Streak Master" badge', timestamp: new Date(Date.now() - 86400000) },
    { type: 'signed' as const, message: 'Signed 0x123...456\'s guestbook', timestamp: new Date(Date.now() - 172800000) },
  ];

  if (!isConnected) {
    return (
      <PageWrapper>
        <ConnectPrompt />
      </PageWrapper>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'badges', label: 'Badges' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
            {address?.slice(2, 4).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </h1>
          <Link
            href={`/guestbook/${address}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View My Guestbook →
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-900 border border-gray-800 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon="⭐"
                label="Total Points"
                value={userPoints?.toString() || '0'}
                color="yellow"
              />
              <StatCard
                icon="✍️"
                label="Signatures Given"
                value={signatureCount?.toString() || '0'}
                color="blue"
              />
              <StatCard
                icon="📩"
                label="Signatures Received"
                value={receivedCount?.toString() || '0'}
                color="purple"
              />
              <StatCard
                icon="🏆"
                label="Badges Earned"
                value={badges.filter(b => b.earned).length}
                subtext={`of ${badges.length} total`}
                color="green"
              />
            </div>

            {/* Progress & Streak Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Next Badge Progress */}
              <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Next Badge</h3>
                <div className="flex items-center gap-6">
                  <ProgressRing
                    progress={70}
                    label="Social Butterfly"
                    value="35/50"
                  />
                  <div>
                    <p className="text-white font-medium mb-1">Social Butterfly</p>
                    <p className="text-gray-400 text-sm mb-3">Sign 50 different guestbooks</p>
                    <p className="text-blue-400 text-sm">15 more signatures needed</p>
                  </div>
                </div>
              </div>

              {/* Streak */}
              <StreakDisplay currentStreak={5} bestStreak={12} />
            </div>

            {/* Leaderboard Position */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Leaderboard Position</h3>
                  <p className="text-gray-400">You're in the top 5% of all users!</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">#42</p>
                  <Link href="/leaderboard" className="text-blue-400 text-sm hover:text-blue-300">
                    View Leaderboard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              {badges.map((badge) => (
                <BadgeMini key={badge.name} {...badge} />
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">How to Earn Badges</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="text-xl">✍️</span>
                  <span><strong className="text-white">First Sign:</strong> Sign your first guestbook</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🧭</span>
                  <span><strong className="text-white">Explorer:</strong> Sign 10 different guestbooks</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🦋</span>
                  <span><strong className="text-white">Social Butterfly:</strong> Sign 50 guestbooks</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🔥</span>
                  <span><strong className="text-white">Streak Master:</strong> Maintain a 7-day streak</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="rounded-2xl bg-gray-900 border border-gray-800 divide-y divide-gray-800">
            {recentActivity.map((activity, i) => (
              <ActivityItem key={i} {...activity} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/sign"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105"
          >
            Sign More Guestbooks
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
