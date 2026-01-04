"use client";

import { use, useState } from "react";
import { useReadContract } from "wagmi";
import Link from "next/link";
import { PageWrapper, StatCard } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { GuestbookABI, LeaderboardABI } from "@/config/abis";

export default function GuestbookPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const [copied, setCopied] = useState(false);

  const { data: signatureCount } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: [address as `0x${string}`],
  });

  const { data: signatures, isLoading } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "getSignatures",
    args: [address as `0x${string}`, BigInt(0), BigInt(50)],
  });

  const { data: userStats } = useReadContract({
    address: CONTRACTS.Leaderboard,
    abi: LeaderboardABI,
    functionName: "getUserStats",
    args: [address as `0x${string}`],
  });

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) {
        const mins = Math.floor(diff / 60000);
        return mins < 1 ? 'Just now' : `${mins}m ago`;
      }
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    return date.toLocaleDateString();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl animate-float">
            📖
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Guestbook
          </h1>
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-gray-400 font-mono text-sm">{formatAddress(address)}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-gray-500 hover:text-white transition"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            value={signatureCount?.toString() || "0"}
            label="Signatures"
            icon="✍️"
            color="purple"
          />
          <StatCard
            value={userStats?.totalPoints?.toString() || "0"}
            label="Points"
            icon="⭐"
            color="blue"
          />
          <StatCard
            value={userStats?.signaturesGiven?.toString() || "0"}
            label="Given"
            icon="📤"
            color="cyan"
          />
          <StatCard
            value={userStats?.currentStreak?.toString() || "0"}
            label="Streak"
            icon="🔥"
            color="orange"
          />
        </div>

        {/* Sign CTA */}
        <div className="glass rounded-2xl p-6 mb-10 text-center">
          <p className="text-gray-400 mb-4">Leave your mark on this guestbook!</p>
          <Link
            href={`/sign?owner=${address}`}
            className="btn-primary inline-block py-3 px-8"
          >
            <span>✍️ Sign this Guestbook</span>
          </Link>
        </div>

        {/* Signatures List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Recent Signatures
            </h2>
            <span className="badge badge-purple">
              {signatureCount?.toString() || "0"} total
            </span>
          </div>

          {isLoading ? (
            /* Loading State */
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="signature-card animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="h-4 w-24 bg-gray-700 rounded" />
                    <div className="h-3 w-16 bg-gray-700 rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : signatures && signatures.length > 0 ? (
            /* Signatures */
            <div className="space-y-4">
              {[...signatures].reverse().map((sig, i) => (
                <div
                  key={i}
                  className="signature-card group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`/guestbook/${sig.signer}`}
                      className="flex items-center gap-2 group/link"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {sig.signer.slice(2, 4).toUpperCase()}
                      </div>
                      <span className="font-mono text-sm text-blue-400 group-hover/link:text-blue-300 transition">
                        {formatAddress(sig.signer)}
                      </span>
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatTime(sig.timestamp)}
                    </span>
                  </div>
                  <p className="text-white text-lg leading-relaxed">{sig.message}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">No signatures yet</h3>
              <p className="text-gray-400 mb-6">Be the first to sign this guestbook!</p>
              <Link
                href={`/sign?owner=${address}`}
                className="btn-primary inline-block py-3 px-6"
              >
                <span>✍️ Sign First</span>
              </Link>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="gradient-border rounded-2xl p-6 text-center">
          <div className="text-2xl mb-3">📣</div>
          <h3 className="text-lg font-bold text-white mb-2">Share this Guestbook</h3>
          <p className="text-gray-400 text-sm mb-4">Invite others to sign!</p>
          <div className="glass rounded-xl p-3 mb-4">
            <code className="text-xs text-blue-400 break-all">
              {typeof window !== "undefined" ? window.location.href : ""}
            </code>
          </div>
          <button onClick={copyUrl} className="btn-secondary py-2 px-6 text-sm">
            {copied ? "Copied! ✓" : "Copy Link 📋"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
