"use client";

import { useEffect, useState, useCallback } from "react";
import { Confetti } from "./Confetti";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

interface AchievementUnlockProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
  showConfetti?: boolean;
}

/**
 * AchievementUnlock - Modal showing newly unlocked achievement with celebration
 */
export function AchievementUnlock({
  badge,
  isOpen,
  onClose,
  autoCloseDelay = 5000,
  showConfetti = true,
}: AchievementUnlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showingConfetti, setShowingConfetti] = useState(false);

  const rarityStyles = {
    common: {
      gradient: "from-gray-400 to-gray-600",
      glow: "shadow-gray-500/30",
      text: "text-gray-400",
      ring: "ring-gray-400",
    },
    uncommon: {
      gradient: "from-green-400 to-green-600",
      glow: "shadow-green-500/30",
      text: "text-green-400",
      ring: "ring-green-400",
    },
    rare: {
      gradient: "from-blue-400 to-blue-600",
      glow: "shadow-blue-500/30",
      text: "text-blue-400",
      ring: "ring-blue-400",
    },
    epic: {
      gradient: "from-purple-400 to-purple-600",
      glow: "shadow-purple-500/30",
      text: "text-purple-400",
      ring: "ring-purple-400",
    },
    legendary: {
      gradient: "from-yellow-400 to-amber-600",
      glow: "shadow-yellow-500/30",
      text: "text-yellow-400",
      ring: "ring-yellow-400",
    },
  };

  const style = rarityStyles[badge.rarity];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (showConfetti) {
        setShowingConfetti(true);
      }

      // Auto close after delay
      if (autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoCloseDelay, showConfetti]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  }, [onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          isActive={showingConfetti}
          duration={3000}
          particleCount={badge.rarity === "legendary" ? 150 : 100}
          onComplete={() => setShowingConfetti(false)}
        />
      )}

      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isVisible && isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className={`
            relative max-w-sm w-full
            bg-gray-900/95 rounded-2xl p-6
            border border-white/10
            transform transition-all duration-500
            ${isVisible && isOpen 
              ? "scale-100 opacity-100 translate-y-0" 
              : "scale-75 opacity-0 translate-y-8"
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-sm font-medium text-blue-400 mb-2">
              🎉 Achievement Unlocked!
            </div>
            <h2 className="text-2xl font-bold text-white">
              {badge.name}
            </h2>
          </div>

          {/* Badge Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`
                w-32 h-32 rounded-full
                bg-gradient-to-br ${style.gradient}
                ${style.glow} shadow-2xl
                flex items-center justify-center
                ring-4 ${style.ring}/30
                animate-pulse
                ${badge.rarity === "legendary" ? "legendary-glow" : ""}
              `}
            >
              <span className="text-5xl">{badge.icon}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-center text-gray-400 mb-4">
            {badge.description}
          </p>

          {/* Rarity Tag */}
          <div className="flex justify-center mb-6">
            <span
              className={`
                px-3 py-1 rounded-full text-sm font-medium
                bg-gradient-to-r ${style.gradient}
                text-white capitalize
              `}
            >
              {badge.rarity}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className={`
              w-full py-3 rounded-xl font-medium
              bg-gradient-to-r ${style.gradient}
              text-white
              hover:opacity-90 transition-opacity
              focus:outline-none focus:ring-2 ${style.ring}/50
            `}
          >
            Awesome! 🎊
          </button>

          {/* Progress bar for auto-close */}
          {autoCloseDelay > 0 && (
            <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${style.gradient} transition-all ease-linear`}
                style={{
                  width: "100%",
                  animation: `shrinkWidth ${autoCloseDelay}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
}

/**
 * Hook to manage achievement unlocks queue
 */
export function useAchievementUnlock() {
  const [queue, setQueue] = useState<Badge[]>([]);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

  const unlockAchievement = useCallback((badge: Badge) => {
    setQueue((prev) => [...prev, badge]);
  }, []);

  const unlockMultiple = useCallback((badges: Badge[]) => {
    setQueue((prev) => [...prev, ...badges]);
  }, []);

  useEffect(() => {
    if (!currentBadge && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrentBadge(next);
      setQueue(rest);
    }
  }, [queue, currentBadge]);

  const handleClose = useCallback(() => {
    setCurrentBadge(null);
  }, []);

  return {
    currentBadge,
    isOpen: !!currentBadge,
    unlockAchievement,
    unlockMultiple,
    handleClose,
    pendingCount: queue.length,
  };
}

/**
 * Mini achievement toast for less intrusive notifications
 */
interface AchievementToastProps {
  badge: Badge;
  isVisible: boolean;
  onClose: () => void;
  position?: "top" | "bottom";
}

export function AchievementToast({
  badge,
  isVisible,
  onClose,
  position = "top",
}: AchievementToastProps) {
  const rarityColors = {
    common: "border-gray-500",
    uncommon: "border-green-500",
    rare: "border-blue-500",
    epic: "border-purple-500",
    legendary: "border-yellow-500",
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`
        fixed ${position === "top" ? "top-4" : "bottom-4"}
        left-1/2 -translate-x-1/2 z-50
        max-w-sm w-full mx-4
        bg-gray-900/95 backdrop-blur-md
        border-l-4 ${rarityColors[badge.rarity]}
        rounded-lg shadow-xl p-4
        transition-all duration-500
        ${isVisible 
          ? "opacity-100 translate-y-0" 
          : `opacity-0 ${position === "top" ? "-translate-y-4" : "translate-y-4"}`
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{badge.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-blue-400 font-medium">Achievement Unlocked!</p>
          <p className="text-white font-semibold truncate">{badge.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
