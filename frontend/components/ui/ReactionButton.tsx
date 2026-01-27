"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

interface ReactionButtonProps {
  emoji: string;
  count: number;
  hasReacted: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  animated?: boolean;
}

/**
 * ReactionButton - Single reaction button with animation
 */
export function ReactionButton({
  emoji,
  count,
  hasReacted,
  onClick,
  disabled = false,
  size = "md",
  showCount = true,
  animated = true,
}: ReactionButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    if (animated && !hasReacted) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }

    onClick();
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm gap-1",
    md: "px-3 py-1.5 text-base gap-1.5",
    lg: "px-4 py-2 text-lg gap-2",
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-full border transition-all duration-200
        ${sizeClasses[size]}
        ${hasReacted
          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isAnimating ? "animate-bounce" : ""}
      `}
      aria-label={`${emoji} reaction, ${count} ${count === 1 ? "person" : "people"} reacted`}
      aria-pressed={hasReacted}
    >
      <span className={isAnimating ? "animate-ping" : ""}>{emoji}</span>
      {showCount && count > 0 && (
        <span className="font-medium text-sm">{count}</span>
      )}
    </button>
  );
}

/**
 * ReactionBar - Row of reaction buttons
 */
interface ReactionBarProps {
  reactions: Reaction[];
  onReact: (emoji: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  allowMultiple?: boolean;
  className?: string;
}

export function ReactionBar({
  reactions,
  onReact,
  disabled = false,
  size = "md",
  allowMultiple = false,
  className = "",
}: ReactionBarProps) {
  const handleReact = (emoji: string, hasReacted: boolean) => {
    if (!allowMultiple && !hasReacted) {
      // Remove other reactions first
      reactions.forEach((r) => {
        if (r.hasReacted && r.emoji !== emoji) {
          onReact(r.emoji); // Toggle off
        }
      });
    }
    onReact(emoji);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {reactions.map((reaction) => (
        <ReactionButton
          key={reaction.emoji}
          emoji={reaction.emoji}
          count={reaction.count}
          hasReacted={reaction.hasReacted}
          onClick={() => handleReact(reaction.emoji, reaction.hasReacted)}
          disabled={disabled}
          size={size}
        />
      ))}
    </div>
  );
}

/**
 * ReactionPicker - Picker overlay for selecting reactions
 */
interface ReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  currentReaction?: string;
  position?: "top" | "bottom";
  customEmojis?: string[];
}

const defaultEmojis = ["❤️", "👍", "🎉", "🔥", "💯", "👏", "🙌", "✨"];

export function ReactionPicker({
  isOpen,
  onClose,
  onSelect,
  currentReaction,
  position = "top",
  customEmojis,
}: ReactionPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const emojis = customEmojis || defaultEmojis;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className={`
        absolute ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
        left-0 z-50
        bg-gray-900/95 backdrop-blur-xl
        border border-white/10 rounded-xl
        p-2 shadow-xl
        animate-in ${position === "top" ? "slide-in-from-bottom-2" : "slide-in-from-top-2"}
        fade-in duration-200
      `}
      role="listbox"
      aria-label="Reaction picker"
    >
      <div className="flex gap-1">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className={`
              w-10 h-10 flex items-center justify-center
              rounded-lg text-xl transition-all
              hover:bg-white/10 hover:scale-110
              ${currentReaction === emoji ? "bg-blue-500/20 ring-2 ring-blue-500/50" : ""}
            `}
            role="option"
            aria-selected={currentReaction === emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * useReactions - Hook for managing reactions state
 */
export function useReactions(initialReactions: Reaction[] = []) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);

  const react = useCallback((emoji: string) => {
    setReactions((prev) =>
      prev.map((r) =>
        r.emoji === emoji
          ? {
              ...r,
              hasReacted: !r.hasReacted,
              count: r.hasReacted ? r.count - 1 : r.count + 1,
            }
          : r
      )
    );
  }, []);

  const addReaction = useCallback((emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji
            ? { ...r, hasReacted: true, count: r.count + 1 }
            : r
        );
      }
      return [...prev, { emoji, count: 1, hasReacted: true }];
    });
  }, []);

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);
  const userReactions = reactions.filter((r) => r.hasReacted);

  return {
    reactions,
    react,
    addReaction,
    totalReactions,
    userReactions,
    setReactions,
  };
}

/**
 * ReactionSummary - Compact display of reactions
 */
interface ReactionSummaryProps {
  reactions: Reaction[];
  maxDisplay?: number;
  onClick?: () => void;
  className?: string;
}

export function ReactionSummary({
  reactions,
  maxDisplay = 3,
  onClick,
  className = "",
}: ReactionSummaryProps) {
  const sortedReactions = [...reactions]
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const displayReactions = sortedReactions.slice(0, maxDisplay);
  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0);

  if (totalCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        px-2 py-1 rounded-full
        bg-white/5 hover:bg-white/10
        transition-colors
        ${className}
      `}
      aria-label={`${totalCount} reactions`}
    >
      <span className="flex -space-x-1">
        {displayReactions.map((r) => (
          <span key={r.emoji} className="text-sm">
            {r.emoji}
          </span>
        ))}
      </span>
      <span className="text-xs text-gray-400 font-medium">{totalCount}</span>
    </button>
  );
}
