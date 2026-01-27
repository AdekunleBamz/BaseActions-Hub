"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TransactionLink } from "./ExplorerLinks";

interface SuccessStateProps {
  hash?: string;
  guestbookOwner?: string;
  title?: string;
  description?: string;
  onReset?: () => void;
  showShareOptions?: boolean;
}

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti"
      style={{
        left: `${Math.random() * 100}%`,
        backgroundColor: color,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export function SignSuccessState({
  hash,
  guestbookOwner,
  title = "Signed Successfully!",
  description = "Your signature is now on-chain forever!",
  onReset,
  showShareOptions = true,
}: SuccessStateProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Play success sound effect (haptic on mobile)
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }, []);

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const shareUrl = guestbookOwner 
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/guestbook/${guestbookOwner}`
    : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I just signed a guestbook on BaseActions Hub!",
          text: "Sign on-chain guestbooks and earn badges on Base blockchain 🔵",
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confettiColors = ["#3B82F6", "#8B5CF6", "#22D3EE", "#10B981", "#F59E0B"];

  return (
    <div className="glass rounded-2xl p-8 text-center overflow-hidden relative animate-scale-in">
      {/* Confetti burst effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.05}
              color={confettiColors[i % confettiColors.length]}
            />
          ))}
        </div>
      )}

      <div className="relative">
        {/* Animated success icon */}
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-5xl shadow-lg shadow-green-500/30">
            <span className="animate-bounce-slow">🎉</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 animate-slide-in-up">{title}</h2>
        <p className="text-gray-400 mb-2 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          {description}
        </p>
        <p className="text-purple-400 text-sm mb-6 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
          You may have earned a badge! Check your stats 🏅
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
          {onReset && (
            <button onClick={onReset} className="btn-primary py-3 px-6 ripple-effect">
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

        {/* Share options */}
        {showShareOptions && guestbookOwner && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm text-gray-500 mb-3">Share your signature</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
              >
                {copied ? (
                  <>✅ Copied!</>
                ) : (
                  <>📤 {navigator.share ? "Share" : "Copy Link"}</>
                )}
              </button>
              <a
                href={`https://warpcast.com/~/compose?text=Just%20signed%20a%20guestbook%20on%20BaseActions%20Hub!%20🔵%0A%0A${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition text-sm text-purple-400"
              >
                🟣 Cast
              </a>
            </div>
          </div>
        )}

        {/* Transaction hash */}
        {hash && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
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
