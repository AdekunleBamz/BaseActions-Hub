"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import Link from "next/link";
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          BaseActions Hub
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Sign guestbooks, earn badges, and climb the leaderboard on Base
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="text-3xl font-bold text-blue-400">
              {totalActions?.toString() || "0"}
            </div>
            <div className="text-gray-400 text-sm">Total Actions</div>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="text-3xl font-bold text-purple-400">
              {totalSignatures?.toString() || "0"}
            </div>
            <div className="text-gray-400 text-sm">Signatures</div>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="text-3xl font-bold text-green-400">
              {totalUsers?.toString() || "0"}
            </div>
            <div className="text-gray-400 text-sm">Users</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sign Guestbook */}
          <Link
            href="/sign"
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition group text-left"
          >
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
              Sign a Guestbook
            </h2>
            <p className="text-gray-400">
              Leave your mark on someone&apos;s on-chain guestbook for 0.0001 ETH
            </p>
          </Link>

          {/* View My Guestbook */}
          <Link
            href={isConnected && address ? `/guestbook/${address}` : "/sign"}
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition group text-left"
          >
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
              My Guestbook
            </h2>
            <p className="text-gray-400">
              View signatures on your guestbook
              {mySignatures ? ` (${mySignatures.toString()} signatures)` : ""}
            </p>
          </Link>

          {/* Leaderboard */}
          <Link
            href="/leaderboard"
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition group text-left"
          >
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition">
              Leaderboard
            </h2>
            <p className="text-gray-400">
              See top signers and earn points for your activity
            </p>
          </Link>

          {/* My Stats */}
          <Link
            href="/stats"
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500 transition group text-left"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">
              My Stats
            </h2>
            <p className="text-gray-400">
              View your points, badges, and streak
            </p>
          </Link>
        </div>

        {/* Share Link */}
        {isConnected && address && (
          <div className="mt-12 bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30">
            <p className="text-blue-400 mb-2">📣 Share your guestbook:</p>
            <code className="text-sm text-gray-300 bg-gray-800 px-4 py-2 rounded-lg block overflow-x-auto">
              {typeof window !== "undefined" ? window.location.origin : ""}/guestbook/{address}
            </code>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
        <p>Built on Base ⚡ Powered by Ethereum</p>
      </footer>
    </main>
  );
}
