// Utility functions for formatting

/**
 * Format an Ethereum address for display
 */
export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address || address.length < startChars + endChars) {
    return address || "";
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number | bigint | string): string {
  const num = typeof value === "bigint" ? Number(value) : Number(value);
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format ETH value from wei
 */
export function formatEth(wei: bigint, decimals = 4): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(decimals);
}
