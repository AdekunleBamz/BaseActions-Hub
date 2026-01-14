// Application constants
export const APP_NAME = "BaseActions Hub";
export const APP_DESCRIPTION = "Sign on-chain guestbooks, earn achievement badges, and climb the leaderboard on Base blockchain.";

// Chain configuration
export const CHAIN_ID = 8453; // Base mainnet
export const CHAIN_NAME = "Base";

// Action costs in wei
export const SIGNATURE_COST = BigInt("100000000000000"); // 0.0001 ETH

// Fee distribution
export const OWNER_FEE_PERCENT = 90;
export const PLATFORM_FEE_PERCENT = 10;

// Limits
export const MAX_MESSAGE_LENGTH = 280;
export const MAX_SIGNATURES_PER_PAGE = 50;
export const MIN_MESSAGE_LENGTH = 1;

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
