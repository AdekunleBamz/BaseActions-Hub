"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFarcaster } from "@/providers/FarcasterProvider";
import { formatAddress } from "@/lib/format";

export function WalletButton() {
  const { isInMiniApp, displayName, pfpUrl } = useFarcaster();
  const { address, isConnected } = useAccount();

  // In Farcaster miniapp, show custom button
  if (isInMiniApp) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
        {pfpUrl ? (
          <Image
            src={pfpUrl}
            alt={displayName || "User"}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        )}
        <span className="text-sm font-medium">
          {displayName || (isConnected && address ? formatAddress(address) : "Connecting...")}
        </span>
      </div>
    );
  }

  // Standard RainbowKit button
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
                    className="btn-primary text-sm py-2.5 px-5"
                  >
                    <span>Connect</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/30"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <span className="text-sm font-medium">{account.displayName}</span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
