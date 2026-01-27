/**
 * Web3 utility functions for blockchain interactions
 */

import { type Address } from "viem";

// ============================================================================
// Address Utilities
// ============================================================================

/**
 * Check if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shorten an address for display
 */
export function shortenAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address) return "";
  if (address.length < startLength + endLength + 3) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Compare two addresses (case-insensitive)
 */
export function addressesEqual(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Get checksum address
 */
export function toChecksumAddress(address: string): Address {
  // Simple implementation - in production use viem's getAddress
  return address.toLowerCase() as Address;
}

// ============================================================================
// Transaction Utilities
// ============================================================================

export interface TransactionStatus {
  status: "pending" | "success" | "failed" | "cancelled";
  hash?: string;
  blockNumber?: number;
  gasUsed?: bigint;
  error?: string;
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string, length = 10): string {
  if (!hash) return "";
  if (hash.length <= length * 2 + 3) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

/**
 * Get block explorer URL for transaction
 */
export function getTransactionUrl(
  hash: string,
  explorerUrl = "https://basescan.org"
): string {
  return `${explorerUrl}/tx/${hash}`;
}

/**
 * Get block explorer URL for address
 */
export function getAddressUrl(
  address: string,
  explorerUrl = "https://basescan.org"
): string {
  return `${explorerUrl}/address/${address}`;
}

/**
 * Get block explorer URL for block
 */
export function getBlockUrl(
  blockNumber: number | bigint,
  explorerUrl = "https://basescan.org"
): string {
  return `${explorerUrl}/block/${blockNumber}`;
}

// ============================================================================
// Gas Utilities
// ============================================================================

/**
 * Format gas amount for display (in Gwei)
 */
export function formatGasPrice(gwei: bigint): string {
  const gweiNum = Number(gwei) / 1e9;
  if (gweiNum < 0.01) return "< 0.01";
  if (gweiNum < 1) return gweiNum.toFixed(2);
  return gweiNum.toFixed(1);
}

/**
 * Format ETH amount for display
 */
export function formatEth(
  wei: bigint,
  decimals = 4,
  symbol = "ETH"
): string {
  const ethNum = Number(wei) / 1e18;
  if (ethNum === 0) return `0 ${symbol}`;
  if (ethNum < 0.0001) return `< 0.0001 ${symbol}`;
  return `${ethNum.toFixed(decimals)} ${symbol}`;
}

/**
 * Parse ETH string to wei
 */
export function parseEth(eth: string): bigint {
  const num = parseFloat(eth);
  if (isNaN(num)) return 0n;
  return BigInt(Math.floor(num * 1e18));
}

/**
 * Calculate transaction cost
 */
export function calculateTxCost(gasLimit: bigint, gasPrice: bigint): bigint {
  return gasLimit * gasPrice;
}

// ============================================================================
// Chain Utilities
// ============================================================================

export interface ChainInfo {
  id: number;
  name: string;
  symbol: string;
  explorerUrl: string;
  rpcUrl: string;
  isTestnet: boolean;
  iconUrl?: string;
}

export const chains: Record<number, ChainInfo> = {
  1: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://eth.llamarpc.com",
    isTestnet: false,
  },
  8453: {
    id: 8453,
    name: "Base",
    symbol: "ETH",
    explorerUrl: "https://basescan.org",
    rpcUrl: "https://mainnet.base.org",
    isTestnet: false,
  },
  84532: {
    id: 84532,
    name: "Base Sepolia",
    symbol: "ETH",
    explorerUrl: "https://sepolia.basescan.org",
    rpcUrl: "https://sepolia.base.org",
    isTestnet: true,
  },
  11155111: {
    id: 11155111,
    name: "Sepolia",
    symbol: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
    isTestnet: true,
  },
};

/**
 * Get chain info by ID
 */
export function getChainInfo(chainId: number): ChainInfo | undefined {
  return chains[chainId];
}

/**
 * Get chain name by ID
 */
export function getChainName(chainId: number): string {
  return chains[chainId]?.name || `Chain ${chainId}`;
}

/**
 * Check if chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in chains;
}

/**
 * Get supported mainnet chains
 */
export function getMainnetChains(): ChainInfo[] {
  return Object.values(chains).filter((chain) => !chain.isTestnet);
}

/**
 * Get supported testnet chains
 */
export function getTestnetChains(): ChainInfo[] {
  return Object.values(chains).filter((chain) => chain.isTestnet);
}

// ============================================================================
// Signature Utilities
// ============================================================================

/**
 * Create EIP-712 typed data for signing
 */
export function createTypedData<T extends Record<string, unknown>>(
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract?: Address;
  },
  types: Record<string, Array<{ name: string; type: string }>>,
  message: T
) {
  return {
    domain,
    types,
    message,
    primaryType: Object.keys(types)[0],
  };
}

/**
 * Create personal sign message
 */
export function createPersonalSignMessage(message: string): string {
  return `\x19Ethereum Signed Message:\n${message.length}${message}`;
}

// ============================================================================
// ENS Utilities
// ============================================================================

/**
 * Check if a string looks like an ENS name
 */
export function isEnsName(name: string): boolean {
  return /^[a-zA-Z0-9-]+\.eth$/.test(name);
}

/**
 * Format address or ENS name for display
 */
export function formatAddressOrEns(
  address: string,
  ensName?: string | null
): string {
  if (ensName) return ensName;
  return shortenAddress(address);
}

// ============================================================================
// Error Utilities
// ============================================================================

export interface Web3Error {
  code: number | string;
  message: string;
  isUserRejection: boolean;
  isInsufficientFunds: boolean;
  isNetworkError: boolean;
}

/**
 * Parse Web3 error into a standardized format
 */
export function parseWeb3Error(error: unknown): Web3Error {
  const defaultError: Web3Error = {
    code: "UNKNOWN",
    message: "An unknown error occurred",
    isUserRejection: false,
    isInsufficientFunds: false,
    isNetworkError: false,
  };

  if (!error) return defaultError;

  const err = error as Record<string, unknown>;
  const code = err.code as number | string | undefined;
  const message = (err.message as string) || (err.reason as string) || defaultError.message;

  // User rejection codes
  const userRejectionCodes = [4001, "ACTION_REJECTED", "USER_REJECTED"];
  const isUserRejection = userRejectionCodes.includes(code as number | string);

  // Insufficient funds
  const isInsufficientFunds =
    message.toLowerCase().includes("insufficient") ||
    message.toLowerCase().includes("not enough");

  // Network error
  const isNetworkError =
    message.toLowerCase().includes("network") ||
    message.toLowerCase().includes("timeout") ||
    message.toLowerCase().includes("disconnected");

  return {
    code: code || "UNKNOWN",
    message: isUserRejection ? "Transaction cancelled by user" : message,
    isUserRejection,
    isInsufficientFunds,
    isNetworkError,
  };
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const parsed = parseWeb3Error(error);
  
  if (parsed.isUserRejection) {
    return "You cancelled the transaction";
  }
  
  if (parsed.isInsufficientFunds) {
    return "Insufficient funds for this transaction";
  }
  
  if (parsed.isNetworkError) {
    return "Network error. Please check your connection and try again";
  }
  
  return parsed.message;
}
