// Application constants
export const APP_NAME = "BaseActions Hub";
export const APP_DESCRIPTION = "Sign on-chain guestbooks, earn achievement badges, and climb the leaderboard on Base blockchain.";
export const APP_VERSION = "1.0.0";

// Chain configuration
export const CHAIN_ID = 8453; // Base mainnet
export const CHAIN_NAME = "Base";
export const BLOCK_EXPLORER_URL = "https://basescan.org";

// Action costs in wei
export const SIGNATURE_COST = BigInt("100000000000000"); // 0.0001 ETH
export const SIGNATURE_COST_ETH = "0.0001";

// Fee distribution
export const OWNER_FEE_PERCENT = 90;
export const PLATFORM_FEE_PERCENT = 10;

// Limits
export const MAX_MESSAGE_LENGTH = 280;
export const MAX_SIGNATURES_PER_PAGE = 50;
export const MIN_MESSAGE_LENGTH = 1;
export const MAX_USERNAME_LENGTH = 32;

// Badge IDs
export const BADGE_IDS = {
  SIGNER: 0,
  SUPPORTER: 1,
  STREAK_MASTER: 2,
  WHALE: 3,
} as const;

// Badge requirements
export const BADGE_REQUIREMENTS = {
  SIGNER: 1,
  SUPPORTER: 1,
  STREAK_MASTER: 7,
  WHALE: 100,
} as const;

// Social links
export const SOCIAL_LINKS = {
  TWITTER: "https://twitter.com/baseactionshub",
  GITHUB: "https://github.com/baseactionshub",
  DISCORD: "https://discord.gg/baseactionshub",
  FARCASTER: "https://warpcast.com/baseactionshub",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  FARCASTER_HUB: "https://hub.pinata.cloud",
  BASESCAN_API: "https://api.basescan.org/api",
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "baseactions-theme",
  RECENT_GUESTBOOKS: "baseactions-recent-guestbooks",
  WALLET_CONNECTED: "baseactions-wallet-connected",
  NOTIFICATION_PREFERENCES: "baseactions-notification-prefs",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction",
  MESSAGE_TOO_LONG: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
  MESSAGE_TOO_SHORT: "Please enter a message",
  INVALID_ADDRESS: "Invalid Ethereum address",
  TRANSACTION_FAILED: "Transaction failed. Please try again",
  NETWORK_ERROR: "Network error. Please check your connection",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SIGNATURE_SENT: "Your signature has been recorded!",
  BADGE_EARNED: "Congratulations! You earned a new badge!",
  COPIED_TO_CLIPBOARD: "Copied to clipboard",
} as const;
