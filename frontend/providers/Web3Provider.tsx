"use client";

import { RainbowKitProvider, darkTheme, getDefaultConfig, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { useState, useEffect } from "react";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { FarcasterProvider } from "./FarcasterProvider";

const queryClient = new QueryClient();

// Check if we're in a Farcaster miniapp context
const isInFarcasterFrame = typeof window !== "undefined" && window.parent !== window;

// Create config with Farcaster Frame connector for miniapp context
const config = isInFarcasterFrame
  ? createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
      connectors: [farcasterFrame()],
    })
  : getDefaultConfig({
      appName: "BaseActions Hub",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
      chains: [base],
      ssr: true,
    });

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // In Farcaster miniapp, skip RainbowKit and use frame connector directly
  if (isInFarcasterFrame) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <FarcasterProvider>{children}</FarcasterProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#3b82f6",
            accentColorForeground: "white",
            borderRadius: "large",
          })}
        >
          <FarcasterProvider>{children}</FarcasterProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
