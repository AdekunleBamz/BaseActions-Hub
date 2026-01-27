"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

export interface FeatureFlags {
  // Core features
  darkMode: boolean;
  analytics: boolean;
  errorTracking: boolean;
  pwa: boolean;
  
  // Blockchain features
  testnets: boolean;
  multiChain: boolean;
  gasEstimation: boolean;
  
  // Guestbook features
  quickMessages: boolean;
  richMessages: boolean;
  messageReactions: boolean;
  
  // Social features
  shareButtons: boolean;
  leaderboard: boolean;
  badges: boolean;
  
  // Experimental
  aiSuggestions: boolean;
  voiceMessages: boolean;
  
  // Maintenance
  maintenanceMode: boolean;
  readOnlyMode: boolean;
}

type FeatureFlagName = keyof FeatureFlags;

interface FeatureFlagContextValue {
  flags: FeatureFlags;
  isEnabled: (flag: FeatureFlagName) => boolean;
  setFlag: (flag: FeatureFlagName, value: boolean) => void;
  resetFlags: () => void;
}

// ============================================================================
// Default Flags
// ============================================================================

const defaultFlags: FeatureFlags = {
  // Core features
  darkMode: true,
  analytics: true,
  errorTracking: true,
  pwa: true,
  
  // Blockchain features
  testnets: false,
  multiChain: false,
  gasEstimation: true,
  
  // Guestbook features
  quickMessages: true,
  richMessages: false,
  messageReactions: false,
  
  // Social features
  shareButtons: true,
  leaderboard: true,
  badges: true,
  
  // Experimental
  aiSuggestions: false,
  voiceMessages: false,
  
  // Maintenance
  maintenanceMode: false,
  readOnlyMode: false,
};

// ============================================================================
// Context
// ============================================================================

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider");
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  initialFlags?: Partial<FeatureFlags>;
  persistKey?: string;
}

export function FeatureFlagProvider({
  children,
  initialFlags = {},
  persistKey = "feature-flags",
}: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    // Check localStorage for persisted flags
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) {
          return { ...defaultFlags, ...JSON.parse(stored), ...initialFlags };
        }
      } catch {
        // Ignore parse errors
      }
    }
    return { ...defaultFlags, ...initialFlags };
  });

  // Persist flags to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(persistKey, JSON.stringify(flags));
      } catch {
        // Ignore storage errors
      }
    }
  }, [flags, persistKey]);

  const isEnabled = useCallback(
    (flag: FeatureFlagName): boolean => {
      return flags[flag] ?? false;
    },
    [flags]
  );

  const setFlag = useCallback((flag: FeatureFlagName, value: boolean) => {
    setFlags((prev) => ({ ...prev, [flag]: value }));
  }, []);

  const resetFlags = useCallback(() => {
    setFlags(defaultFlags);
    if (typeof window !== "undefined") {
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  return (
    <FeatureFlagContext.Provider value={{ flags, isEnabled, setFlag, resetFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Check if a specific feature is enabled
 */
export function useFeature(flag: FeatureFlagName): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flag);
}

/**
 * Get multiple feature states at once
 */
export function useFeatures<T extends FeatureFlagName>(
  flags: T[]
): Record<T, boolean> {
  const { isEnabled } = useFeatureFlags();
  
  return flags.reduce((acc, flag) => {
    acc[flag] = isEnabled(flag);
    return acc;
  }, {} as Record<T, boolean>);
}

// ============================================================================
// Component Wrapper
// ============================================================================

interface FeatureProps {
  flag: FeatureFlagName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally render children based on feature flag
 */
export function Feature({ flag, children, fallback = null }: FeatureProps) {
  const isEnabled = useFeature(flag);
  return <>{isEnabled ? children : fallback}</>;
}

// ============================================================================
// HOC for feature gating
// ============================================================================

export function withFeature<P extends object>(
  Component: React.ComponentType<P>,
  flag: FeatureFlagName,
  FallbackComponent?: React.ComponentType<P>
): React.FC<P> {
  return function FeatureGatedComponent(props: P) {
    const isEnabled = useFeature(flag);
    
    if (!isEnabled) {
      return FallbackComponent ? <FallbackComponent {...props} /> : null;
    }
    
    return <Component {...props} />;
  };
}

// ============================================================================
// Development Tools
// ============================================================================

/**
 * Debug panel for feature flags (only in development)
 */
export function FeatureFlagDebugPanel() {
  const { flags, setFlag, resetFlags } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-full shadow-lg"
        title="Feature Flags"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 z-50 w-80 max-h-96 overflow-auto bg-dark-bg-secondary border border-dark-border-primary rounded-lg shadow-xl">
          <div className="p-4 border-b border-dark-border-primary flex items-center justify-between">
            <h3 className="font-semibold text-dark-text-primary">Feature Flags</h3>
            <button
              onClick={resetFlags}
              className="text-xs text-dark-text-tertiary hover:text-dark-text-primary"
            >
              Reset All
            </button>
          </div>
          <div className="p-4 space-y-3">
            {(Object.keys(flags) as FeatureFlagName[]).map((flag) => (
              <label key={flag} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-dark-text-secondary">{flag}</span>
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={(e) => setFlag(flag, e.target.checked)}
                  className="rounded text-accent-primary focus:ring-accent-primary"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
