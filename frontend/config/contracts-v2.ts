// ============================================================================
// V2 CONTRACTS CONFIGURATION - Live on Base Mainnet
// ============================================================================

import { Address } from 'viem';

// Chain Configuration
export const CHAIN_ID = 8453; // Base Mainnet
export const CHAIN_NAME = 'Base';
export const EXPLORER_URL = 'https://basescan.org';

// V2 Contract Addresses (Live on Base Mainnet)
export const V2_CONTRACTS = {
  GUESTBOOK: '0x19fE1aE089A46a1243f021447632eDF3AaF629C5' as Address,
  BADGE_NFT: '0x08E314B704e4d9101773Ef1d4CC217d09487F2bd' as Address,
  LEADERBOARD: '0xD1344d3049d04aE5D004E05F36bc91383511bD24' as Address,
  HUB: '0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8' as Address,
} as const;

// Signing Fee Configuration
export const SIGNING_FEE = {
  WEI: 1000000000000n, // 0.000001 ETH
  ETH: '0.000001',
  USD_APPROX: '$0.003',
} as const;

// Contract Function Selectors (for reference)
export const FUNCTION_SELECTORS = {
  // Hub Functions
  signGuestbook: 'signGuestbook(address,string)',
  signGuestbookWithReferral: 'signGuestbookWithReferral(address,string,address)',
  reactToSignature: 'reactToSignature(address,uint256,string)',
  tipSignature: 'tipSignature(address,uint256)',
  
  // Guestbook Functions
  getSignatures: 'getSignatures(address,uint256,uint256)',
  getSignature: 'getSignature(address,uint256)',
  getSignatureCount: 'getSignatureCount(address)',
  editSignature: 'editSignature(address,uint256,string)',
  pinSignature: 'pinSignature(address,uint256)',
  
  // Badge Functions
  getUserBadges: 'getUserBadges(address)',
  hasBadge: 'hasBadge(address,uint256)',
  
  // Leaderboard Functions
  getTopUsers: 'getTopUsers(uint256)',
  getUserStats: 'getUserStats(address)',
  getUserRank: 'getUserRank(address)',
} as const;

// Badge Types (matching BadgeNFT.sol)
export const BADGE_TYPES = {
  FIRST_SIGN: 0,
  RECEIVED_10: 1,
  RECEIVED_50: 2,
  RECEIVED_100: 3,
  SIGNED_10: 4,
  SIGNED_50: 5,
  SIGNED_100: 6,
  STREAK_3: 7,
  STREAK_7: 8,
  STREAK_30: 9,
  OG: 10,
} as const;

// Reaction Types
export const REACTIONS = ['❤️', '🔥', '👏', '🚀', '💎', '🎉', '💙', '✨'] as const;

// Helper to get explorer links
export const getExplorerLink = {
  address: (address: string) => `${EXPLORER_URL}/address/${address}`,
  tx: (hash: string) => `${EXPLORER_URL}/tx/${hash}`,
  token: (address: string, tokenId: string) => `${EXPLORER_URL}/token/${address}?a=${tokenId}`,
  contract: (address: string) => `${EXPLORER_URL}/address/${address}#code`,
};

// Export default contracts for easy access
export const contracts = V2_CONTRACTS;

export default V2_CONTRACTS;
