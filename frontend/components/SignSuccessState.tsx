"use client";

import Link from "next/link";
import { TransactionLink } from "./ExplorerLinks";

interface SuccessStateProps {
  hash?: string;
  guestbookOwner?: string;
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function SignSuccessState({
  hash,
  guestbookOwner,
  title = "Signed Successfully!",
  description = "Your signature is now on-chain forever!",
  onReset,
}: SuccessStateProps) {
  return (
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
              backgroundColor: ["#3B82F6", "#8B5CF6", "#22D3EE", "#10B981"][i % 4],
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
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">
          {description}
          <br />
          You may have earned a badge 🏅
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onReset && (
            <button onClick={onReset} className="btn-primary py-3 px-6">
              <span>Sign Another ✍️</span>
            </button>
          )}
          {guestbookOwner && (
            <Link
              href={`/guestbook/${guestbookOwner}`}
              className="btn-secondary py-3 px-6 text-center"
            >
              View Guestbook 📖
            </Link>
          )}
        </div>

        {hash && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-2">Transaction Hash</p>
            <TransactionLink
              hash={hash}
              label={`${hash.slice(0, 10)}...${hash.slice(-8)}`}
              className="text-xs font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}
