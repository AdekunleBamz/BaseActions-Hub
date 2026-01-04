"use client";

import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { useState, useEffect, useMemo } from "react";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { FarcasterProvider } from "./FarcasterProvider";

const queryClient = new QueryClient();

// Standard RainbowKit config for non-miniapp context
const standardConfig = getDefaultConfig({
  appName: "BaseActions Hub",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [base],
  ssr: true,
});

// Miniapp config with Farcaster Frame connector
const miniappConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [farcasterFrame()],
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    // Check if we're in a Farcaster miniapp context (inside iframe)
    const inMiniApp = typeof window !== "undefined" && window.parent !== window;
    setIsInMiniApp(inMiniApp);
    setMounted(true);
  }, []);

  // Select the appropriate config based on context
  const config = isInMiniApp ? miniappConfig : standardConfig;

  if (!mounted) {
    return null;
  }

  // In Farcaster miniapp, skip RainbowKit and use frame connector directly
  if (isInMiniApp) {
    return (
      <WagmiProvider config={miniappConfig}>
        <QueryClientProvider client={queryClient}>
          <FarcasterProvider>{children}</FarcasterProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <WagmiProvider config={standardConfig}>
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
