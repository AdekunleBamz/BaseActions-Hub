"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import Link from "next/link";
import { CONTRACTS } from "@/config/contracts";
import { LeaderboardABI, GuestbookABI } from "@/config/abis";

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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top signers on BaseActions</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {totalUsers?.toString() || "0"}
            </div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-purple-400">
              {totalSignatures?.toString() || "0"}
            </div>
            <div className="text-gray-400 text-sm">Total Signatures</div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            Full leaderboard with rankings will be available once we have more activity!
          </p>
          <Link
            href="/sign"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition"
          >
            Be a Top Signer 📝
          </Link>
        </div>

        {/* How Points Work */}
        <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">How Points Work</h2>
          <div className="space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Sign a guestbook</span>
              <span className="text-blue-400">+10 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Receive a signature</span>
              <span className="text-purple-400">+5 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Daily streak bonus</span>
              <span className="text-orange-400">+2 × streak</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
