"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import sdk, { type Context } from "@farcaster/miniapp-sdk";

interface FarcasterContextType {
  isSDKLoaded: boolean;
  isInMiniApp: boolean;
  context: Context | null;
  isReady: boolean;
  error: Error | null;
  // Actions
  openUrl: (url: string) => void;
  close: () => void;
  // User info
  userFid: number | null;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isSDKLoaded: false,
  isInMiniApp: false,
  context: null,
  isReady: false,
  error: null,
  openUrl: () => {},
  close: () => {},
  userFid: null,
  username: null,
  displayName: null,
  pfpUrl: null,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

interface FarcasterProviderProps {
  children: ReactNode;
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [context, setContext] = useState<Context | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Check if we're in a Farcaster miniapp context
        if (typeof window !== "undefined" && window.parent !== window) {
          setIsInMiniApp(true);

          // Load the SDK context
          const ctx = await sdk.context;
          setContext(ctx);

          // Signal that the app is ready
          sdk.actions.ready();
          setIsReady(true);
        }

        setIsSDKLoaded(true);
      } catch (err) {
        console.error("Failed to initialize Farcaster SDK:", err);
        setError(err instanceof Error ? err : new Error("Failed to initialize SDK"));
        setIsSDKLoaded(true);
      }
    };

    initSDK();
  }, []);

  const openUrl = useCallback((url: string) => {
    if (isInMiniApp) {
      sdk.actions.openUrl(url);
    } else {
      window.open(url, "_blank");
    }
  }, [isInMiniApp]);

  const close = useCallback(() => {
    if (isInMiniApp) {
      sdk.actions.close();
    }
  }, [isInMiniApp]);

  // Extract user info from context
  const userFid = context?.user?.fid ?? null;
  const username = context?.user?.username ?? null;
  const displayName = context?.user?.displayName ?? null;
  const pfpUrl = context?.user?.pfpUrl ?? null;

  return (
    <FarcasterContext.Provider
      value={{
        isSDKLoaded,
        isInMiniApp,
        context,
        isReady,
        error,
        openUrl,
        close,
        userFid,
        username,
        displayName,
        pfpUrl,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}
