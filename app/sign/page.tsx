"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Link from "next/link";
import { CONTRACTS, ACTION_COST } from "@/config/contracts";
import { BaseActionsHubABI } from "@/config/abis";

export default function SignPage() {
  const { isConnected, address } = useAccount();
  const [guestbookOwner, setGuestbookOwner] = useState("");
  const [message, setMessage] = useState("");

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSign = () => {
    if (!guestbookOwner || !message) return;

    writeContract({
      address: CONTRACTS.BaseActionsHub,
      abi: BaseActionsHubABI,
      functionName: "signGuestbook",
      args: [guestbookOwner as `0x${string}`, message],
      value: ACTION_COST,
    });
  };

  const quickMessages = [
    "🔥 Great vibes!",
    "⚡ Based and pilled",
    "🚀 To the moon!",
    "💎 Diamond hands",
    "👋 Hello from Base!",
    "🎉 Keep building!",
  ];

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

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign a Guestbook</h1>
          <p className="text-gray-400">Leave your mark on-chain for 0.0001 ETH</p>
        </div>

        {!isConnected ? (
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to sign</p>
            <ConnectButton />
          </div>
        ) : isSuccess ? (
          <div className="bg-green-500/10 rounded-2xl p-8 border border-green-500/30 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Signed!</h2>
            <p className="text-gray-400 mb-4">
              Your signature is now on-chain forever! You may have earned a badge.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition"
              >
                Sign Another
              </button>
              <Link
                href={`/guestbook/${guestbookOwner}`}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition"
              >
                View Guestbook
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Guestbook Owner */}
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Guestbook Owner Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={guestbookOwner}
                onChange={(e) => setGuestbookOwner(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Quick fill own address */}
              {address && (
                <button
                  onClick={() => setGuestbookOwner(address)}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Use my address
                </button>
              )}
            </div>

            {/* Message */}
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Message (max 280 chars)
              </label>
              <textarea
                placeholder="Write something nice..."
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                rows={3}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">{message.length}/280</span>
              </div>

              {/* Quick Messages */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => setMessage(msg)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-300 transition"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Button */}
            <button
              onClick={handleSign}
              disabled={!guestbookOwner || !message || isPending || isConfirming}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isPending
                ? "Confirm in wallet..."
                : isConfirming
                ? "Signing..."
                : "Sign Guestbook (0.0001 ETH) ✍️"}
            </button>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center text-sm">
                ❌ {error.message.slice(0, 100)}
              </div>
            )}

            {/* Info */}
            <div className="text-center text-sm text-gray-500">
              <p>90% goes to the guestbook owner • 10% platform fee</p>
              <p className="mt-1">First signature earns you a SIGNER badge! 🏅</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
