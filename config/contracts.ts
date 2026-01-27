// Contract Addresses - Base Mainnet (V2 Deployed January 2026)
export const CONTRACTS = {
  Guestbook: "0x19fE1aE089A46a1243f021447632eDF3AaF629C5" as `0x${string}`,
  BadgeNFT: "0x08E314B704e4d9101773Ef1d4CC217d09487F2bd" as `0x${string}`,
  Leaderboard: "0xD1344d3049d04aE5D004E05F36bc91383511bD24" as `0x${string}`,
  BaseActionsHub: "0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8" as `0x${string}`,
};

// Action cost: 0.000001 ETH (V2 reduced fee)
export const ACTION_COST = BigInt("1000000000000"); // 0.000001 ETH in wei
