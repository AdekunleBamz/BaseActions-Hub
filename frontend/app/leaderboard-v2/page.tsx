"use client";

import React, { useState, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { PageWrapper } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI } from "@/config/abis";
import { usePlatformStats } from "@/hooks";
import Link from "next/link";

// Top 3 Podium Component
function Podium({ entries }: { entries: { rank: number; address: string; points: number }[] }) {
  const [first, second, third] = entries;

  const PodiumSpot = ({
    entry,
    position,
  }: {
    entry: typeof first;
    position: 1 | 2 | 3;
  }) => {
    if (!entry) return <div className="flex-1" />;

    const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
    const colors = {
      1: 'from-yellow-400 to-amber-600',
      2: 'from-gray-300 to-gray-400',
      3: 'from-amber-700 to-amber-800',
    };
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    const orders = { 1: 'order-2', 2: 'order-1', 3: 'order-3' };

    const shortAddress = `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`;

    return (
      <div className={`flex flex-col items-center ${orders[position]}`}>
        {/* Medal */}
        <div className="text-4xl mb-3">{medals[position]}</div>

        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {entry.address.slice(2, 4).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-2">
          <Link 
            href={`/guestbook/${entry.address}`}
            className="font-medium text-white hover:text-blue-400 transition-colors text-sm"
          >
            {shortAddress}
          </Link>
          <p className="text-lg font-bold text-white">
            {entry.points.toLocaleString()}
            <span className="text-xs text-gray-500 ml-1">pts</span>
          </p>
        </div>

        {/* Podium block */}
        <div
          className={`w-24 sm:w-28 ${heights[position]} rounded-t-xl bg-gradient-to-b ${colors[position]} flex items-end justify-center pb-4 shadow-lg`}
        >
          <span className="text-4xl font-bold text-white/40">{position}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-2 mb-12 px-4">
      <PodiumSpot entry={second} position={2} />
      <PodiumSpot entry={first} position={1} />
      <PodiumSpot entry={third} position={3} />
    </div>
  );
}

// Leaderboard Row
function LeaderboardRow({
  rank,
  address,
  points,
  signatures,
  badges,
  isCurrentUser,
}: {
  rank: number;
  address: string;
  points: number;
  signatures: number;
  badges: number;
  isCurrentUser: boolean;
}) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Link
      href={`/guestbook/${address}`}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-800/50 ${
        isCurrentUser ? 'bg-blue-900/20 border border-blue-500/30' : ''
      }`}
    >
      {/* Rank */}
      <div className="w-10 text-center">
        <span className="text-lg font-bold text-gray-400">#{rank}</span>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
        {address.slice(2, 4).toUpperCase()}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">{shortAddress}</span>
          {isCurrentUser && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white">You</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{signatures} signatures</span>
          <span>{badges} badges</span>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <span className="text-lg font-bold text-white">{points.toLocaleString()}</span>
        <span className="text-gray-500 ml-1 text-sm">pts</span>
      </div>
    </Link>
  );
}

// Stats Overview
function StatsOverview({ stats }: { stats: { label: string; value: string; icon: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800"
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Timeframe Tabs
function TimeframeTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (tf: string) => void;
}) {
  const tabs = [
    { id: 'all', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-900 border border-gray-800 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Your Position Card
function YourPositionCard({
  rank,
  points,
  totalParticipants,
}: {
  rank: number;
  points: number;
  totalParticipants: number;
}) {
  const percentile = Math.round((1 - rank / totalParticipants) * 100);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 mb-8">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
          #{rank}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">Your Position</h3>
          <p className="text-gray-400">
            You&apos;re in the top {100 - percentile}% with {points.toLocaleString()} points!
          </p>
        </div>

        <Link
          href="/stats"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          View Stats
        </Link>
      </div>
    </div>
  );
}

// Points Explainer
function PointsExplainer() {
  const points = [
    { action: 'Sign a guestbook', points: '+10', icon: '✍️' },
    { action: 'Daily bonus (first sign)', points: '+5', icon: '🌟' },
    { action: '7-day streak bonus', points: '+50', icon: '🔥' },
    { action: 'Receive a signature', points: '+2', icon: '📩' },
    { action: 'Get a reaction', points: '+1', icon: '❤️' },
    { action: 'Refer a friend', points: '+25', icon: '🎁' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">How to Earn Points</h3>
      <div className="grid grid-cols-2 gap-3">
        {points.map((item) => (
          <div key={item.action} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{item.action}</p>
            </div>
            <span className="text-green-400 font-semibold text-sm">{item.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Page Component
export default function LeaderboardPageV2() {
  const { address, isConnected } = useAccount();
  const [timeframe, setTimeframe] = useState('all');
  const { totalUsers, totalSignatures, totalActions } = usePlatformStats();

  // Mock data - would come from contract/API
  const mockLeaderboard = [
    { rank: 1, address: '0x1234567890abcdef1234567890abcdef12345678', points: 2500, signatures: 150, badges: 8 },
    { rank: 2, address: '0x2345678901bcdef12345678901bcdef123456789', points: 2100, signatures: 120, badges: 7 },
    { rank: 3, address: '0x3456789012cdef123456789012cdef1234567890', points: 1800, signatures: 100, badges: 6 },
    { rank: 4, address: '0x4567890123def1234567890123def12345678901', points: 1500, signatures: 85, badges: 5 },
    { rank: 5, address: '0x5678901234ef12345678901234ef123456789012', points: 1200, signatures: 70, badges: 4 },
    { rank: 6, address: '0x6789012345f123456789012345f1234567890123', points: 1000, signatures: 60, badges: 4 },
    { rank: 7, address: '0x7890123456012345678901234560123456789012', points: 800, signatures: 50, badges: 3 },
    { rank: 8, address: '0x8901234567123456789012345671234567890123', points: 650, signatures: 40, badges: 3 },
    { rank: 9, address: '0x9012345678234567890123456782345678901234', points: 500, signatures: 30, badges: 2 },
    { rank: 10, address: '0xa123456789345678901234567893456789012345', points: 400, signatures: 25, badges: 2 },
  ];

  const stats = [
    { label: 'Total Users', value: totalUsers?.toString() || '0', icon: '👥' },
    { label: 'Total Signatures', value: totalSignatures?.toString() || '0', icon: '✍️' },
    { label: 'Total Actions', value: totalActions?.toString() || '0', icon: '⚡' },
    { label: 'Badges Minted', value: '1.2K', icon: '🏆' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Leaderboard</h1>
          <p className="text-gray-400 text-lg">
            Top signers competing for glory on BaseActions Hub
          </p>
        </div>

        {/* Stats */}
        <StatsOverview stats={stats} />

        {/* Your Position (if connected) */}
        {isConnected && address && (
          <YourPositionCard rank={42} points={350} totalParticipants={1000} />
        )}

        {/* Timeframe Tabs */}
        <TimeframeTabs active={timeframe} onChange={setTimeframe} />

        {/* Podium */}
        <Podium entries={mockLeaderboard.slice(0, 3)} />

        {/* Leaderboard Table */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 divide-y divide-gray-800 mb-12">
          {mockLeaderboard.slice(3).map((entry) => (
            <LeaderboardRow
              key={entry.address}
              {...entry}
              isCurrentUser={address?.toLowerCase() === entry.address.toLowerCase()}
            />
          ))}
        </div>

        {/* Points Explainer */}
        <PointsExplainer />

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Ready to climb the leaderboard?
          </h3>
          <Link
            href="/sign"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105"
          >
            Start Signing Guestbooks
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
