"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
  image?: string;
  hashtags?: string[];
}

type SharePlatform = "twitter" | "farcaster" | "telegram" | "whatsapp" | "copy" | "native";

/**
 * ShareSheet - Native-like share sheet with multiple platforms
 */
export function ShareSheet({
  isOpen,
  onClose,
  title = "",
  text = "",
  url = "",
  image,
  hashtags = [],
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);

  useEffect(() => {
    setSupportsNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const hashtagString = hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ");
  const shareText = `${text}${hashtagString ? ` ${hashtagString}` : ""}`;

  const handleShare = async (platform: SharePlatform) => {
    switch (platform) {
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text: shareText,
              url,
            });
            onClose();
          } catch (err) {
            // User cancelled or error
          }
        }
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
        onClose();
        break;

      case "farcaster":
        window.open(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
        onClose();
        break;

      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
          "width=600,height=400"
        );
        onClose();
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
          "_blank",
          "width=600,height=400"
        );
        onClose();
        break;

      case "copy":
        try {
          await navigator.clipboard.writeText(`${shareText} ${url}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
        break;
    }
  };

  if (!isOpen) return null;

  const platforms: Array<{
    id: SharePlatform;
    name: string;
    icon: string;
    color: string;
    hidden?: boolean;
  }> = [
    {
      id: "native",
      name: "Share",
      icon: "📤",
      color: "bg-blue-500",
      hidden: !supportsNativeShare,
    },
    { id: "twitter", name: "X / Twitter", icon: "𝕏", color: "bg-black" },
    { id: "farcaster", name: "Farcaster", icon: "🟣", color: "bg-purple-600" },
    { id: "telegram", name: "Telegram", icon: "✈️", color: "bg-sky-500" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "bg-green-500" },
    { id: "copy", name: copied ? "Copied!" : "Copy Link", icon: copied ? "✓" : "🔗", color: "bg-gray-700" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`
          relative w-full max-w-md
          bg-gray-900/95 backdrop-blur-xl
          rounded-2xl border border-white/10
          p-6 shadow-2xl
          animate-in slide-in-from-bottom-4 duration-300
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Share</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white font-medium truncate">{title || text}</p>
          <p className="text-sm text-gray-400 truncate mt-1">{url}</p>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-3 gap-4">
          {platforms
            .filter((p) => !p.hidden)
            .map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  ${platform.color}
                  ${platform.id === "copy" && copied ? "ring-2 ring-green-500" : ""}
                `}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-xs font-medium text-white">
                  {platform.name}
                </span>
              </button>
            ))}
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * useShare - Hook for sharing content
 */
export function useShare() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    title?: string;
    text?: string;
    url?: string;
    hashtags?: string[];
  }>({});

  const share = useCallback(
    (data: {
      title?: string;
      text?: string;
      url?: string;
      hashtags?: string[];
    }) => {
      setShareData(data);
      setIsOpen(true);
    },
    []
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const shareNative = useCallback(
    async (data: { title?: string; text?: string; url?: string }) => {
      if (navigator.share) {
        try {
          await navigator.share(data);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    },
    []
  );

  return {
    isOpen,
    shareData,
    share,
    close,
    shareNative,
    supportsNativeShare: typeof navigator !== "undefined" && !!navigator.share,
  };
}

/**
 * ShareButton - Standalone share button that opens share sheet
 */
interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  hashtags?: string[];
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  hashtags,
  variant = "secondary",
  size = "md",
  className = "",
}: ShareButtonProps) {
  const { isOpen, share, close } = useShare();

  const handleClick = () => {
    share({
      title,
      text,
      url: url || (typeof window !== "undefined" ? window.location.href : ""),
      hashtags,
    });
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white",
    ghost: "hover:bg-white/10 text-gray-400 hover:text-white",
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center gap-2 rounded-xl font-medium
          transition-all duration-200
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      <ShareSheet
        isOpen={isOpen}
        onClose={close}
        title={title}
        text={text || ""}
        url={url || (typeof window !== "undefined" ? window.location.href : "")}
        hashtags={hashtags}
      />
    </>
  );
}
