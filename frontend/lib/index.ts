// Configuration
export * from "./constants";
export * from "./env";

// Core Utilities
export * from "./numbers";
export * from "./strings";
export * from "./arrays";
export * from "./objects";
export * from "./async";
export * from "./storage";
export * from "./datetime";
export * from "./colors";
export * from "./logger";

// Domain Specific Utilities
export { formatAddress, formatEth } from "./format";
export { 
  isValidAddress, 
  isValidTxHash, 
  isValidMessage, 
  isValidEmail, 
  isValidUrl,
  isValidDate,
  isValidUUID,
  isPositiveNumber,
  isNonNegativeNumber,
  checkPasswordStrength,
  isValidFileSize,
  isValidFileType,
  hasRequiredKeys,
  stringValidator,
  numberValidator,
  arrayValidator,
  isFloat
} from "./validation";

// Animation utilities
export * from "./animations";

// API utilities
export * from "./api";

// Accessibility utilities
export * from "./accessibility";

// Performance utilities
export * from "./performance";

// Analytics utilities
export * from "./analytics";

// Environment configuration
export * from "./env";

// Web3 utilities (explicit exports to avoid conflicts)
export {
  shortenAddress,
  addressesEqual,
  toChecksumAddress,
  formatTxHash,
  getTransactionUrl,
  getAddressUrl,
  getBlockUrl,
  formatGasPrice,
  parseEth,
  calculateTxCost,
  chains,
  getChainInfo,
  getChainName,
  isChainSupported,
  getMainnetChains,
  getTestnetChains,
  createTypedData,
  createPersonalSignMessage,
  isEnsName,
  formatAddressOrEns,
  parseWeb3Error,
  getErrorMessage,
  type ChainInfo,
  type TransactionStatus,
  type Web3Error,
} from "./web3";
