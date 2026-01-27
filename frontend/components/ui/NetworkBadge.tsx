"use client";

import { useState, useEffect } from "react";

interface NetworkBadgeProps {
  chainId: number;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface NetworkInfo {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  isTestnet: boolean;
}

const networks: Record<number, NetworkInfo> = {
  1: {
    name: "Ethereum",
    shortName: "ETH",
    icon: "⟠",
    color: "#627eea",
    isTestnet: false,
  },
  8453: {
    name: "Base",
    shortName: "BASE",
    icon: "🔵",
    color: "#0052ff",
    isTestnet: false,
  },
  84532: {
    name: "Base Sepolia",
    shortName: "B.SEP",
    icon: "🔵",
    color: "#0052ff",
    isTestnet: true,
  },
  10: {
    name: "Optimism",
    shortName: "OP",
    icon: "🔴",
    color: "#ff0420",
    isTestnet: false,
  },
  42161: {
    name: "Arbitrum",
    shortName: "ARB",
    icon: "🔷",
    color: "#28a0f0",
    isTestnet: false,
  },
  137: {
    name: "Polygon",
    shortName: "MATIC",
    icon: "⬡",
    color: "#8247e5",
    isTestnet: false,
  },
  11155111: {
    name: "Sepolia",
    shortName: "SEP",
    icon: "⟠",
    color: "#627eea",
    isTestnet: true,
  },
};

/**
 * NetworkBadge - Display network/chain indicator
 */
export function NetworkBadge({
  chainId,
  showName = true,
  size = "md",
  className = "",
}: NetworkBadgeProps) {
  const network = networks[chainId] || {
    name: `Chain ${chainId}`,
    shortName: `${chainId}`,
    icon: "⚡",
    color: "#6b7280",
    isTestnet: false,
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: `${network.color}20`,
        border: `1px solid ${network.color}40`,
      }}
    >
      <span>{network.icon}</span>
      {showName && (
        <span style={{ color: network.color }} className="font-medium">
          {network.shortName}
        </span>
      )}
      {network.isTestnet && (
        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
          Testnet
        </span>
      )}
    </div>
  );
}

/**
 * NetworkSwitcher - Dropdown to switch networks
 */
interface NetworkSwitcherProps {
  currentChainId: number;
  supportedChains: number[];
  onSwitch: (chainId: number) => Promise<void>;
  className?: string;
}

export function NetworkSwitcher({
  currentChainId,
  supportedChains,
  onSwitch,
  className = "",
}: NetworkSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const currentNetwork = networks[currentChainId];
  const isWrongNetwork = !supportedChains.includes(currentChainId);

  const handleSwitch = async (chainId: number) => {
    if (chainId === currentChainId) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      await onSwitch(chainId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl
          border transition-colors
          ${isWrongNetwork
            ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20"
            : "border-white/10 bg-white/5 hover:bg-white/10"
          }
          ${isSwitching ? "opacity-50 cursor-wait" : ""}
        `}
      >
        {isSwitching ? (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>{currentNetwork?.icon || "⚡"}</span>
        )}
        <span className={isWrongNetwork ? "text-red-400" : "text-white"}>
          {isWrongNetwork
            ? "Wrong Network"
            : currentNetwork?.shortName || "Unknown"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
            {supportedChains.map((chainId) => {
              const network = networks[chainId];
              if (!network) return null;

              const isActive = chainId === currentChainId;

              return (
                <button
                  key={chainId}
                  onClick={() => handleSwitch(chainId)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    transition-colors
                    ${isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "hover:bg-white/5 text-white"
                    }
                  `}
                >
                  <span className="text-xl">{network.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{network.name}</p>
                    {network.isTestnet && (
                      <p className="text-xs text-yellow-400">Testnet</p>
                    )}
                  </div>
                  {isActive && (
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * WrongNetworkBanner - Alert banner for wrong network
 */
interface WrongNetworkBannerProps {
  requiredChainId: number;
  currentChainId?: number;
  onSwitch: () => void;
  className?: string;
}

export function WrongNetworkBanner({
  requiredChainId,
  currentChainId,
  onSwitch,
  className = "",
}: WrongNetworkBannerProps) {
  const requiredNetwork = networks[requiredChainId];
  const currentNetwork = currentChainId ? networks[currentChainId] : null;

  if (!requiredNetwork) return null;

  return (
    <div
      className={`
        flex items-center justify-between gap-4 px-4 py-3
        bg-red-500/10 border border-red-500/30 rounded-xl
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-medium text-red-400">Wrong Network</p>
          <p className="text-sm text-gray-400">
            Please switch to {requiredNetwork.name}
            {currentNetwork && ` from ${currentNetwork.name}`}
          </p>
        </div>
      </div>

      <button
        onClick={onSwitch}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
      >
        Switch Network
      </button>
    </div>
  );
}

/**
 * NetworkStatus - Live network status indicator
 */
interface NetworkStatusProps {
  chainId: number;
  blockNumber?: number;
  latency?: number;
  className?: string;
}

export function NetworkStatus({
  chainId,
  blockNumber,
  latency,
  className = "",
}: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const network = networks[chainId];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getLatencyColor = () => {
    if (!latency) return "bg-gray-500";
    if (latency < 100) return "bg-green-500";
    if (latency < 300) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Status dot */}
      <div className="relative">
        <div
          className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
        />
        {isOnline && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
        )}
      </div>

      {/* Network info */}
      <div className="text-sm">
        <span className="text-gray-400">{network?.shortName || "Unknown"}</span>
        {blockNumber && (
          <span className="text-gray-500 ml-2">
            Block #{blockNumber.toLocaleString()}
          </span>
        )}
      </div>

      {/* Latency indicator */}
      {latency !== undefined && (
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${getLatencyColor()}`} />
          <span className="text-xs text-gray-500">{latency}ms</span>
        </div>
      )}
    </div>
  );
}
