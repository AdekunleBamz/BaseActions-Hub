"use client";

import { useCallback, useState } from "react";
import { useAccount, useChainId, usePublicClient, useSwitchChain } from "wagmi";
import { 
  isChainSupported, 
  getChainInfo, 
  parseWeb3Error, 
  getErrorMessage,
  addressesEqual,
  type ChainInfo,
} from "@/lib/web3";

// ============================================================================
// useWalletStatus - Comprehensive wallet status
// ============================================================================

interface WalletStatus {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | undefined;
  chainId: number | undefined;
  chainInfo: ChainInfo | undefined;
  isCorrectChain: boolean;
  isSupportedChain: boolean;
}

export function useWalletStatus(targetChainId?: number): WalletStatus {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const chainInfo = chainId ? getChainInfo(chainId) : undefined;
  const isSupportedChain = chainId ? isChainSupported(chainId) : false;
  const isCorrectChain = targetChainId ? chainId === targetChainId : true;

  return {
    isConnected,
    isConnecting,
    address,
    chainId,
    chainInfo,
    isCorrectChain,
    isSupportedChain,
  };
}

// ============================================================================
// useChainSwitch - Switch chain with error handling
// ============================================================================

interface UseChainSwitchResult {
  switchToChain: (chainId: number) => Promise<void>;
  isSwitching: boolean;
  error: string | null;
}

export function useChainSwitch(): UseChainSwitchResult {
  const { switchChain } = useSwitchChain();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchToChain = useCallback(async (chainId: number) => {
    setError(null);
    setIsSwitching(true);
    
    try {
      await switchChain({ chainId });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsSwitching(false);
    }
  }, [switchChain]);

  return {
    switchToChain,
    isSwitching,
    error,
  };
}

// ============================================================================
// useTransactionState - Manage transaction lifecycle
// ============================================================================

export type TransactionState = 
  | "idle"
  | "preparing"
  | "waiting-wallet"
  | "pending"
  | "success"
  | "error";

interface TransactionStateManager {
  state: TransactionState;
  hash: string | null;
  error: string | null;
  isLoading: boolean;
  setState: (state: TransactionState) => void;
  setHash: (hash: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export function useTransactionState(): TransactionStateManager {
  const [state, setState] = useState<TransactionState>("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setState("idle");
    setHash(null);
    setError(null);
  }, []);

  const isLoading = ["preparing", "waiting-wallet", "pending"].includes(state);

  return {
    state,
    hash,
    error,
    isLoading,
    setState,
    setHash,
    setError,
    reset,
  };
}

// ============================================================================
// useBlockNumber - Subscribe to block numbers
// ============================================================================

export function useBlockNumber() {
  const publicClient = usePublicClient();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

  const refetch = useCallback(async () => {
    if (!publicClient) return;
    const block = await publicClient.getBlockNumber();
    setBlockNumber(block);
    return block;
  }, [publicClient]);

  return {
    blockNumber,
    refetch,
  };
}

// ============================================================================
// useIsOwner - Check if connected wallet owns an address
// ============================================================================

export function useIsOwner(targetAddress?: string): boolean {
  const { address } = useAccount();
  return addressesEqual(address, targetAddress);
}

// ============================================================================
// useAddressMatches - Check if address matches pattern
// ============================================================================

export function useAddressMatch(
  addresses: (string | undefined)[],
  targetAddress?: string
): boolean {
  const { address } = useAccount();
  const checkAddress = targetAddress || address;
  
  if (!checkAddress) return false;
  
  return addresses.some((addr) => addressesEqual(addr, checkAddress));
}

// ============================================================================
// useWeb3Error - Parse and manage Web3 errors
// ============================================================================

interface UseWeb3ErrorResult {
  error: ReturnType<typeof parseWeb3Error> | null;
  message: string | null;
  setError: (error: unknown) => void;
  clearError: () => void;
}

export function useWeb3Error(): UseWeb3ErrorResult {
  const [error, setErrorState] = useState<ReturnType<typeof parseWeb3Error> | null>(null);

  const setError = useCallback((err: unknown) => {
    setErrorState(parseWeb3Error(err));
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    error,
    message: error ? getErrorMessage(error) : null,
    setError,
    clearError,
  };
}

// ============================================================================
// useTransactionToast - Show transaction status toasts
// ============================================================================

interface TransactionToastOptions {
  pendingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useTransactionToast(options: TransactionToastOptions = {}) {
  const {
    pendingMessage = "Transaction pending...",
    successMessage = "Transaction successful!",
    errorMessage = "Transaction failed",
  } = options;

  const showPending = useCallback((hash: string) => {
    // Would integrate with toast system
    console.log(`${pendingMessage} Hash: ${hash}`);
  }, [pendingMessage]);

  const showSuccess = useCallback((hash: string) => {
    console.log(`${successMessage} Hash: ${hash}`);
  }, [successMessage]);

  const showError = useCallback((error: unknown) => {
    const message = getErrorMessage(error);
    console.error(`${errorMessage}: ${message}`);
  }, [errorMessage]);

  return {
    showPending,
    showSuccess,
    showError,
  };
}

// ============================================================================
// useGasEstimation - Estimate gas for a transaction
// ============================================================================

interface GasEstimation {
  gasLimit: bigint | null;
  gasPrice: bigint | null;
  totalCost: bigint | null;
  isEstimating: boolean;
  error: string | null;
}

export function useGasEstimation(): GasEstimation & {
  estimate: (params: { to: string; data?: string; value?: bigint }) => Promise<void>;
} {
  const publicClient = usePublicClient();
  const [state, setState] = useState<GasEstimation>({
    gasLimit: null,
    gasPrice: null,
    totalCost: null,
    isEstimating: false,
    error: null,
  });

  const estimate = useCallback(async (params: { 
    to: string; 
    data?: string; 
    value?: bigint;
  }) => {
    if (!publicClient) return;

    setState((prev) => ({ ...prev, isEstimating: true, error: null }));

    try {
      const [gasLimit, gasPrice] = await Promise.all([
        publicClient.estimateGas({
          to: params.to as `0x${string}`,
          data: params.data as `0x${string}` | undefined,
          value: params.value,
        }),
        publicClient.getGasPrice(),
      ]);

      setState({
        gasLimit,
        gasPrice,
        totalCost: gasLimit * gasPrice,
        isEstimating: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isEstimating: false,
        error: getErrorMessage(err),
      }));
    }
  }, [publicClient]);

  return {
    ...state,
    estimate,
  };
}
