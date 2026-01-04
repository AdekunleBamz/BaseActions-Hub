"use client";

import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { useFarcaster } from "@/providers/FarcasterProvider";

/**
 * Hook to auto-connect wallet when in Farcaster miniapp context
 */
export function useFrameAutoConnect() {
  const { isInMiniApp, isReady } = useFarcaster();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    // Auto-connect when in miniapp and SDK is ready
    if (isInMiniApp && isReady && !isConnected && connectors.length > 0) {
      const frameConnector = connectors.find((c) => c.id === "farcasterFrame");
      if (frameConnector) {
        connect({ connector: frameConnector });
      }
    }
  }, [isInMiniApp, isReady, isConnected, connectors, connect]);

  return { isInMiniApp, isReady, isConnected };
}
