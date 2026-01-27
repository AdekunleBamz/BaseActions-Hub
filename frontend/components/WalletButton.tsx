"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFarcaster } from "@/providers/FarcasterProvider";
import { formatAddress } from "@/lib/format";
import { base } from "wagmi/chains";

export function WalletButton() {
  const { isInMiniApp, displayName, pfpUrl } = useFarcaster();
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  const isWrongNetwork = chainId !== base.id;

  // In Farcaster miniapp, show custom button
  if (isInMiniApp) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 transition-all hover:border-purple-500/30">
        {pfpUrl ? (
          <Image
            src={pfpUrl}
            alt={displayName || "User"}
            width={24}
            height={24}
            className="rounded-full ring-2 ring-purple-500/30"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">
            {displayName || (isConnected && address ? formatAddress(address) : "Connecting...")}
          </span>
          {isConnected && balance && (
            <span className="text-[10px] text-gray-500 leading-tight">
              {parseFloat(balance.formatted).toFixed(4)} ETH
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard RainbowKit button with enhancements
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    disabled={isConnecting}
                    className="btn-primary text-sm py-2.5 px-5 ripple-effect"
                    aria-label="Connect wallet"
                  >
                    {isConnecting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Connecting...
                      </span>
                    ) : (
                      <span>Connect</span>
                    )}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center gap-2 animate-pulse-glow"
                    style={{ "--tw-shadow-color": "rgba(239, 68, 68, 0.3)" } as React.CSSProperties}
                  >
                    <span className="text-lg">⚠️</span>
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Chain button (optional, for multi-chain) */}
                  {chain.hasIcon && (
                    <button
                      onClick={openChainModal}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                      aria-label={`Connected to ${chain.name}`}
                    >
                      {chain.iconUrl && (
                        <Image
                          src={chain.iconUrl}
                          alt={chain.name ?? "Chain icon"}
                          width={18}
                          height={18}
                          className="rounded-full"
                        />
                      )}
                    </button>
                  )}
                  
                  {/* Account button */}
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group"
                    aria-label={`Connected as ${account.displayName}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium leading-tight">{account.displayName}</span>
                      {account.displayBalance && (
                        <span className="text-[10px] text-gray-500 leading-tight">
                          {account.displayBalance}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export function ConnectWalletButton({ 
  className = "", 
  size = "md",
  fullWidth = false,
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}) {
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, mounted }) => (
        <button
          onClick={openConnectModal}
          disabled={!mounted}
          className={`btn-primary ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        >
          Connect Wallet
        </button>
      )}
    </ConnectButton.Custom>
  );
}
