"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Link from "next/link";
import { PageWrapper } from "@/components/Layout";
import { CONTRACTS, ACTION_COST } from "@/config/contracts";
import { BaseActionsHubABI } from "@/config/abis";

function SignForm() {
  const { isConnected, address } = useAccount();
  const searchParams = useSearchParams();
  const [guestbookOwner, setGuestbookOwner] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Pre-fill owner from URL query param
  useEffect(() => {
    const owner = searchParams.get("owner");
    if (owner) {
      setGuestbookOwner(owner);
    }
  }, [searchParams]);

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
    { emoji: "🔥", text: "Great vibes!" },
    { emoji: "⚡", text: "Based and pilled" },
    { emoji: "🚀", text: "To the moon!" },
    { emoji: "💎", text: "Diamond hands" },
    { emoji: "👋", text: "Hello from Base!" },
    { emoji: "🎉", text: "Keep building!" },
    { emoji: "💙", text: "Love this!" },
    { emoji: "🌟", text: "You're awesome!" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(guestbookOwner);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl animate-float">
          ✍️
        </div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
          Sign a Guestbook
        </h1>
        <p className="text-gray-400">
          Leave your mark on-chain for just <span className="text-blue-400 font-semibold">0.0001 ETH</span>
        </p>
      </div>

      {!isConnected ? (
        /* Connect Wallet State */
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to start signing guestbooks
          </p>
          <div className="badge badge-blue">Supports MetaMask, Coinbase, and more</div>
        </div>
      ) : isSuccess ? (
        /* Success State */
        <div className="glass rounded-2xl p-8 text-center overflow-hidden relative">
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#3B82F6', '#8B5CF6', '#22D3EE', '#10B981'][i % 4],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-4xl glow-cyan">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Signed Successfully!</h2>
            <p className="text-gray-400 mb-6">
              Your signature is now on-chain forever!<br />
              You may have earned a badge 🏅
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary py-3 px-6"
              >
                <span>Sign Another ✍️</span>
              </button>
              <Link
                href={`/guestbook/${guestbookOwner}`}
                className="btn-secondary py-3 px-6 text-center"
              >
                View Guestbook 📖
              </Link>
            </div>

            {hash && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2">Transaction Hash</p>
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 font-mono break-all"
                >
                  {hash}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Sign Form */
        <div className="space-y-6">
          {/* Guestbook Owner Input */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Guestbook Owner Address
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0x..."
                value={guestbookOwner}
                onChange={(e) => setGuestbookOwner(e.target.value)}
                className="input-modern pr-24"
              />
              {guestbookOwner && (
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:text-white transition"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            
            {/* Quick fill buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              {address && (
                <button
                  onClick={() => setGuestbookOwner(address)}
                  className="pill text-xs"
                >
                  📍 Use my address
                </button>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Your Message
              </label>
              <span className={`text-xs ${message.length > 250 ? 'text-orange-400' : 'text-gray-500'}`}>
                {message.length}/280
              </span>
            </div>
            <textarea
              placeholder="Write something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 280))}
              rows={4}
              className="input-modern resize-none"
            />

            {/* Quick Messages */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-3">Quick messages:</p>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg) => (
                  <button
                    key={msg.text}
                    onClick={() => setMessage(`${msg.emoji} ${msg.text}`)}
                    className="pill text-xs hover:scale-105 transition-transform"
                  >
                    {msg.emoji} {msg.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Button */}
          <button
            onClick={handleSign}
            disabled={!guestbookOwner || !message || isPending || isConfirming}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Confirm in wallet...
                </>
              ) : isConfirming ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing...
                </>
              ) : (
                <>Sign Guestbook (0.0001 ETH) ✍️</>
              )}
            </span>
          </button>

          {/* Error State */}
          {error && (
            <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/10">
              <div className="flex items-start gap-3">
                <span className="text-red-400">❌</span>
                <p className="text-sm text-red-400">{error.message.slice(0, 100)}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-2xl">💡</span>
              <div className="text-gray-400">
                <p><span className="text-green-400">90%</span> goes to the guestbook owner</p>
                <p><span className="text-blue-400">10%</span> platform fee</p>
                <p className="text-purple-400 mt-1">First signature earns you a SIGNER badge! 🏅</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignPage() {
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800 animate-pulse" />
            <div className="h-8 w-48 mx-auto bg-gray-800 rounded animate-pulse mb-3" />
            <div className="h-4 w-64 mx-auto bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      }>
        <SignForm />
      </Suspense>
    </PageWrapper>
  );
}
