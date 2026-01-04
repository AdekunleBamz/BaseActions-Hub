"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import sdk from "@farcaster/miniapp-sdk";

type FrameContext = Awaited<typeof sdk.context>;

interface FarcasterContextType {
  isSDKLoaded: boolean;
  isInMiniApp: boolean;
  context: FrameContext | null;
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
  const [context, setContext] = useState<FrameContext | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Check if we're in a Farcaster miniapp context (inside iframe)
        const inMiniApp = typeof window !== "undefined" && window.parent !== window;
        setIsInMiniApp(inMiniApp);

        if (inMiniApp) {
          // Load the SDK context with timeout
          const ctx = await Promise.race([
            sdk.context,
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error("SDK context timeout")), 5000)
            )
          ]);
          
          if (ctx) {
            setContext(ctx as FrameContext);
          }
        }

        // Always call ready() - this tells Farcaster to hide the splash screen
        // Call it within 5 seconds as required
        sdk.actions.ready();
        setIsReady(true);
        setIsSDKLoaded(true);
      } catch (err) {
        console.error("Failed to initialize Farcaster SDK:", err);
        setError(err instanceof Error ? err : new Error("Failed to initialize SDK"));
        // Still mark as loaded and call ready to prevent infinite splash
        sdk.actions.ready();
        setIsSDKLoaded(true);
        setIsReady(true);
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
