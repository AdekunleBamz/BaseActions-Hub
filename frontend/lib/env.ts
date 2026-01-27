/**
 * Environment configuration with type safety
 * Validates and provides access to environment variables
 */

// ============================================================================
// Environment Types
// ============================================================================

export interface EnvironmentConfig {
  // App
  appName: string;
  appUrl: string;
  appEnv: "development" | "staging" | "production";
  isProduction: boolean;
  isDevelopment: boolean;

  // Blockchain
  chainId: number;
  rpcUrl: string;
  blockExplorerUrl: string;

  // Contracts
  guestbookAddress: string;
  leaderboardAddress: string;
  badgeNftAddress: string;

  // API
  apiUrl: string;
  apiTimeout: number;

  // Features
  features: {
    enableAnalytics: boolean;
    enableErrorTracking: boolean;
    enablePWA: boolean;
    enableTestnets: boolean;
    maintenanceMode: boolean;
  };

  // Third-party
  walletConnectProjectId: string;

  // Build info
  buildId: string;
  buildTime: string;
  version: string;
}

// ============================================================================
// Environment Variable Helpers
// ============================================================================

function getEnvVar(key: string, defaultValue?: string): string {
  if (typeof window !== "undefined") {
    // Client-side: only NEXT_PUBLIC_ vars are available
    const value = (window as unknown as Record<string, string>)[`__ENV_${key}`];
    if (value !== undefined) return value;
  }

  const envValue = process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
  
  if (envValue !== undefined) return envValue;
  if (defaultValue !== undefined) return defaultValue;
  
  if (process.env.NODE_ENV === "development") {
    console.warn(`Missing environment variable: ${key}`);
  }
  
  return "";
}

function getEnvVarAsNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function getEnvVarAsBoolean(key: string, defaultValue: boolean): boolean {
  const value = getEnvVar(key);
  if (value === "") return defaultValue;
  return value === "true" || value === "1";
}

// ============================================================================
// Configuration Object
// ============================================================================

function createConfig(): EnvironmentConfig {
  const appEnv = (getEnvVar("APP_ENV", "development") as EnvironmentConfig["appEnv"]);
  
  return {
    // App
    appName: getEnvVar("APP_NAME", "BaseActions Hub"),
    appUrl: getEnvVar("APP_URL", "http://localhost:3000"),
    appEnv,
    isProduction: appEnv === "production",
    isDevelopment: appEnv === "development",

    // Blockchain
    chainId: getEnvVarAsNumber("CHAIN_ID", 8453), // Base mainnet
    rpcUrl: getEnvVar("RPC_URL", "https://mainnet.base.org"),
    blockExplorerUrl: getEnvVar("BLOCK_EXPLORER_URL", "https://basescan.org"),

    // Contracts
    guestbookAddress: getEnvVar("GUESTBOOK_ADDRESS", ""),
    leaderboardAddress: getEnvVar("LEADERBOARD_ADDRESS", ""),
    badgeNftAddress: getEnvVar("BADGE_NFT_ADDRESS", ""),

    // API
    apiUrl: getEnvVar("API_URL", "/api"),
    apiTimeout: getEnvVarAsNumber("API_TIMEOUT", 30000),

    // Features
    features: {
      enableAnalytics: getEnvVarAsBoolean("FEATURE_ANALYTICS", true),
      enableErrorTracking: getEnvVarAsBoolean("FEATURE_ERROR_TRACKING", true),
      enablePWA: getEnvVarAsBoolean("FEATURE_PWA", true),
      enableTestnets: getEnvVarAsBoolean("FEATURE_TESTNETS", false),
      maintenanceMode: getEnvVarAsBoolean("MAINTENANCE_MODE", false),
    },

    // Third-party
    walletConnectProjectId: getEnvVar("WALLET_CONNECT_PROJECT_ID", ""),

    // Build info
    buildId: getEnvVar("BUILD_ID", "development"),
    buildTime: getEnvVar("BUILD_TIME", new Date().toISOString()),
    version: getEnvVar("APP_VERSION", "0.0.0"),
  };
}

// Singleton config instance
let _config: EnvironmentConfig | null = null;

export function getConfig(): EnvironmentConfig {
  if (!_config) {
    _config = createConfig();
  }
  return _config;
}

// Re-create config (useful for testing)
export function resetConfig(): void {
  _config = null;
}

// Export individual config values for convenience
export const config = new Proxy({} as EnvironmentConfig, {
  get: (_, prop: keyof EnvironmentConfig) => getConfig()[prop],
});

// ============================================================================
// Validation
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateConfig(): ValidationResult {
  const cfg = getConfig();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required in production
  if (cfg.isProduction) {
    if (!cfg.walletConnectProjectId) {
      errors.push("WALLET_CONNECT_PROJECT_ID is required in production");
    }
    if (!cfg.guestbookAddress) {
      errors.push("GUESTBOOK_ADDRESS is required in production");
    }
    if (!cfg.leaderboardAddress) {
      errors.push("LEADERBOARD_ADDRESS is required in production");
    }
  }

  // Warnings
  if (!cfg.walletConnectProjectId) {
    warnings.push("WALLET_CONNECT_PROJECT_ID is not set - wallet connections may fail");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Debug Info
// ============================================================================

export function getDebugInfo(): Record<string, unknown> {
  const cfg = getConfig();
  
  return {
    environment: cfg.appEnv,
    version: cfg.version,
    buildId: cfg.buildId,
    buildTime: cfg.buildTime,
    chainId: cfg.chainId,
    features: cfg.features,
    contracts: {
      guestbook: cfg.guestbookAddress ? "✓ Set" : "✗ Not set",
      leaderboard: cfg.leaderboardAddress ? "✓ Set" : "✗ Not set",
      badgeNft: cfg.badgeNftAddress ? "✓ Set" : "✗ Not set",
    },
  };
}
