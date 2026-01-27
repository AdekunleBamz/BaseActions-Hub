'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';

// Wallet Connection Status Hook
interface WalletStatus {
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  address: `0x${string}` | undefined;
  shortAddress: string | null;
  chainId: number | undefined;
  isCorrectChain: boolean;
}

export function useWalletStatus(targetChainId?: number): WalletStatus {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
  const isCorrectChain = targetChainId ? chainId === targetChainId : true;

  return {
    isConnected,
    isConnecting,
    isDisconnected,
    address,
    shortAddress,
    chainId,
    isCorrectChain,
  };
}

// Transaction Status Hook
type TransactionStatus = 'idle' | 'preparing' | 'pending' | 'confirming' | 'confirmed' | 'error';

interface TransactionState {
  status: TransactionStatus;
  hash: `0x${string}` | null;
  error: Error | null;
  confirmations: number;
}

interface UseTransactionResult {
  state: TransactionState;
  execute: (txFn: () => Promise<`0x${string}`>) => Promise<void>;
  reset: () => void;
}

export function useTransactionV2(requiredConfirmations = 1): UseTransactionResult {
  const publicClient = usePublicClient();
  const [state, setState] = useState<TransactionState>({
    status: 'idle',
    hash: null,
    error: null,
    confirmations: 0,
  });

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      hash: null,
      error: null,
      confirmations: 0,
    });
  }, []);

  const execute = useCallback(
    async (txFn: () => Promise<`0x${string}`>) => {
      setState((prev) => ({ ...prev, status: 'preparing', error: null }));

      try {
        setState((prev) => ({ ...prev, status: 'pending' }));
        const hash = await txFn();

        setState((prev) => ({ ...prev, status: 'confirming', hash }));

        if (publicClient) {
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
            confirmations: requiredConfirmations,
          });

          if (receipt.status === 'success') {
            setState((prev) => ({
              ...prev,
              status: 'confirmed',
              confirmations: requiredConfirmations,
            }));
          } else {
            throw new Error('Transaction failed');
          }
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error as Error,
        }));
        throw error;
      }
    },
    [publicClient, requiredConfirmations]
  );

  return { state, execute, reset };
}

// Gas Estimation Hook
interface GasEstimation {
  gasLimit: bigint | null;
  gasPrice: bigint | null;
  estimatedCost: bigint | null;
  estimatedCostEth: string | null;
  isEstimating: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGasEstimation(
  contractCall?: () => Promise<bigint>
): GasEstimation {
  const publicClient = usePublicClient();
  const [state, setState] = useState<Omit<GasEstimation, 'refetch'>>({
    gasLimit: null,
    gasPrice: null,
    estimatedCost: null,
    estimatedCostEth: null,
    isEstimating: false,
    error: null,
  });

  const estimate = useCallback(async () => {
    if (!publicClient || !contractCall) return;

    setState((prev) => ({ ...prev, isEstimating: true, error: null }));

    try {
      const [gasLimit, gasPrice] = await Promise.all([
        contractCall(),
        publicClient.getGasPrice(),
      ]);

      const estimatedCost = gasLimit * gasPrice;
      const estimatedCostEth = (Number(estimatedCost) / 1e18).toFixed(6);

      setState({
        gasLimit,
        gasPrice,
        estimatedCost,
        estimatedCostEth,
        isEstimating: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isEstimating: false,
        error: error as Error,
      }));
    }
  }, [publicClient, contractCall]);

  return { ...state, refetch: estimate };
}

// Token Balance Hook
interface TokenBalance {
  balance: bigint | null;
  formatted: string | null;
  decimals: number;
  symbol: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTokenBalance(
  tokenAddress?: `0x${string}`,
  decimals = 18
): TokenBalance {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [state, setState] = useState<Omit<TokenBalance, 'refetch'>>({
    balance: null,
    formatted: null,
    decimals,
    symbol: null,
    isLoading: false,
    error: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!publicClient || !address || !tokenAddress) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
          },
        ],
        functionName: 'balanceOf',
        args: [address],
      });

      const formatted = (Number(balance) / Math.pow(10, decimals)).toFixed(4);

      setState({
        balance: balance as bigint,
        formatted,
        decimals,
        symbol: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [publicClient, address, tokenAddress, decimals]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { ...state, refetch: fetchBalance };
}

// Block Number Hook with Auto-Update
interface BlockInfo {
  blockNumber: bigint | null;
  timestamp: bigint | null;
  isLoading: boolean;
}

export function useBlockNumber(autoUpdate = true): BlockInfo {
  const publicClient = usePublicClient();
  const [state, setState] = useState<BlockInfo>({
    blockNumber: null,
    timestamp: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!publicClient) return;

    const fetchBlock = async () => {
      try {
        const block = await publicClient.getBlock();
        setState({
          blockNumber: block.number,
          timestamp: block.timestamp,
          isLoading: false,
        });
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchBlock();

    if (autoUpdate) {
      const unwatch = publicClient.watchBlockNumber({
        onBlockNumber: async (blockNumber) => {
          const block = await publicClient.getBlock({ blockNumber });
          setState({
            blockNumber,
            timestamp: block.timestamp,
            isLoading: false,
          });
        },
      });

      return () => {
        unwatch();
      };
    }
  }, [publicClient, autoUpdate]);

  return state;
}

// ENS Resolution Hook
interface ENSResult {
  name: string | null;
  avatar: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useENSResolution(address?: `0x${string}`): ENSResult {
  const publicClient = usePublicClient();
  const [state, setState] = useState<ENSResult>({
    name: null,
    avatar: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!publicClient || !address) return;

    const resolve = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const name = await publicClient.getEnsName({ address });
        let avatar = null;

        if (name) {
          avatar = await publicClient.getEnsAvatar({ name });
        }

        setState({
          name,
          avatar,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          name: null,
          avatar: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    resolve();
  }, [publicClient, address]);

  return state;
}

// Contract Events Hook
interface EventLog {
  args: Record<string, unknown>;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

interface UseContractEventsResult {
  events: EventLog[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useContractEvents(
  address?: `0x${string}`,
  abi?: readonly unknown[],
  eventName?: string,
  fromBlock?: bigint
): UseContractEventsResult {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!publicClient || !address || !abi || !eventName) return;

    setIsLoading(true);
    setError(null);

    try {
      const logs = await publicClient.getContractEvents({
        address,
        abi: abi as never,
        eventName,
        fromBlock: fromBlock ?? 'earliest',
        toBlock: 'latest',
      });

      const formattedLogs = logs.map((log) => ({
        args: log.args as Record<string, unknown>,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }));

      setEvents(formattedLogs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, address, abi, eventName, fromBlock]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}

// Signature Hook
interface SignatureResult {
  signature: `0x${string}` | null;
  isSigningMessage: boolean;
  error: Error | null;
  signMessage: (message: string) => Promise<`0x${string}` | null>;
  reset: () => void;
}

export function useMessageSignature(): SignatureResult {
  const { data: walletClient } = useWalletClient();
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signMessage = useCallback(
    async (message: string): Promise<`0x${string}` | null> => {
      if (!walletClient) {
        setError(new Error('Wallet not connected'));
        return null;
      }

      setIsSigningMessage(true);
      setError(null);

      try {
        const sig = await walletClient.signMessage({ message });
        setSignature(sig);
        return sig;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsSigningMessage(false);
      }
    },
    [walletClient]
  );

  const reset = useCallback(() => {
    setSignature(null);
    setError(null);
  }, []);

  return { signature, isSigningMessage, error, signMessage, reset };
}

export default {
  useWalletStatus,
  useTransactionV2,
  useGasEstimation,
  useTokenBalance,
  useBlockNumber,
  useENSResolution,
  useContractEvents,
  useMessageSignature,
};
