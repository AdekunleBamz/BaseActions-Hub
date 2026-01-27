'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useContractRead, useContractWrite, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther, formatEther, Address } from 'viem';
import { V2_CONTRACTS, SIGNING_FEE } from '@/config/contracts-v2';

// ============================================================================
// V2 GUESTBOOK HOOK - Enhanced signing with reactions and tips
// ============================================================================

export interface Signature {
  signer: Address;
  message: string;
  timestamp: bigint;
  reactions: ReactionCount[];
  tipsReceived: bigint;
  isEdited: boolean;
  isPinned: boolean;
}

export interface ReactionCount {
  emoji: string;
  count: number;
}

export interface UseGuestbookV2Options {
  address?: Address;
  pageSize?: number;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export interface UseGuestbookV2Return {
  // Data
  signatures: Signature[];
  signatureCount: number;
  isLoading: boolean;
  error: Error | null;
  
  // Pagination
  page: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  
  // Actions
  signGuestbook: (message: string) => Promise<void>;
  signWithReferral: (message: string, referrer: Address) => Promise<void>;
  reactToSignature: (index: number, emoji: string) => Promise<void>;
  tipSignature: (index: number, amount: string) => Promise<void>;
  editSignature: (index: number, newMessage: string) => Promise<void>;
  pinSignature: (index: number) => Promise<void>;
  
  // States
  isSigning: boolean;
  isReacting: boolean;
  isTipping: boolean;
  isEditing: boolean;
  isPinning: boolean;
  txHash: string | null;
  txStatus: 'idle' | 'pending' | 'success' | 'error';
}

// Hub ABI for V2 functions
const HUB_ABI = [
  {
    name: 'signGuestbook',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'guestbookOwner', type: 'address' },
      { name: 'message', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'signGuestbookWithReferral',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'guestbookOwner', type: 'address' },
      { name: 'message', type: 'string' },
      { name: 'referrer', type: 'address' }
    ],
    outputs: []
  },
  {
    name: 'reactToSignature',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'guestbookOwner', type: 'address' },
      { name: 'signatureIndex', type: 'uint256' },
      { name: 'emoji', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'tipSignature',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'guestbookOwner', type: 'address' },
      { name: 'signatureIndex', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

// Guestbook ABI for read functions
const GUESTBOOK_ABI = [
  {
    name: 'getSignatures',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' }
    ],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'signer', type: 'address' },
          { name: 'message', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'tipsReceived', type: 'uint256' },
          { name: 'isEdited', type: 'bool' },
          { name: 'isPinned', type: 'bool' }
        ]
      }
    ]
  },
  {
    name: 'getSignatureCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'editSignature',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'guestbookOwner', type: 'address' },
      { name: 'signatureIndex', type: 'uint256' },
      { name: 'newMessage', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'pinSignature',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'guestbookOwner', type: 'address' },
      { name: 'signatureIndex', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

export function useGuestbookV2(options: UseGuestbookV2Options = {}): UseGuestbookV2Return {
  const { address: guestbookAddress, pageSize = 20, onSuccess, onError } = options;
  const { address: userAddress } = useAccount();
  
  const [page, setPage] = useState(0);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  
  // Read signature count
  const { data: signatureCount, refetch: refetchCount } = useContractRead({
    address: V2_CONTRACTS.GUESTBOOK,
    abi: GUESTBOOK_ABI,
    functionName: 'getSignatureCount',
    args: guestbookAddress ? [guestbookAddress] : undefined,
    query: { enabled: !!guestbookAddress }
  });
  
  // Read signatures
  const { data: signaturesData, isLoading, error, refetch: refetchSignatures } = useContractRead({
    address: V2_CONTRACTS.GUESTBOOK,
    abi: GUESTBOOK_ABI,
    functionName: 'getSignatures',
    args: guestbookAddress ? [guestbookAddress, BigInt(page * pageSize), BigInt(pageSize)] : undefined,
    query: { enabled: !!guestbookAddress }
  });
  
  // Write functions
  const { writeContractAsync: writeHub, isPending: isHubPending } = useContractWrite();
  const { writeContractAsync: writeGuestbook, isPending: isGuestbookPending } = useContractWrite();
  
  // Wait for transaction
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });
  
  // Process signatures when data changes
  useEffect(() => {
    if (signaturesData) {
      const processed = (signaturesData as any[]).map(sig => ({
        signer: sig.signer as Address,
        message: sig.message,
        timestamp: sig.timestamp,
        reactions: [], // Would need separate call to get reactions
        tipsReceived: sig.tipsReceived,
        isEdited: sig.isEdited,
        isPinned: sig.isPinned,
      }));
      setSignatures(processed);
    }
  }, [signaturesData]);
  
  // Handle transaction success
  useEffect(() => {
    if (isSuccess && txHash) {
      setTxStatus('success');
      onSuccess?.(txHash);
      // Refresh data
      refetchCount();
      refetchSignatures();
    }
  }, [isSuccess, txHash, onSuccess, refetchCount, refetchSignatures]);
  
  // Sign guestbook
  const signGuestbook = useCallback(async (message: string) => {
    if (!guestbookAddress) throw new Error('No guestbook address');
    
    try {
      setTxStatus('pending');
      const hash = await writeHub({
        address: V2_CONTRACTS.HUB,
        abi: HUB_ABI,
        functionName: 'signGuestbook',
        args: [guestbookAddress, message],
        value: SIGNING_FEE.WEI,
      });
      setTxHash(hash);
    } catch (err) {
      setTxStatus('error');
      onError?.(err as Error);
      throw err;
    }
  }, [guestbookAddress, writeHub, onError]);
  
  // Sign with referral
  const signWithReferral = useCallback(async (message: string, referrer: Address) => {
    if (!guestbookAddress) throw new Error('No guestbook address');
    
    try {
      setTxStatus('pending');
      const hash = await writeHub({
        address: V2_CONTRACTS.HUB,
        abi: HUB_ABI,
        functionName: 'signGuestbookWithReferral',
        args: [guestbookAddress, message, referrer],
        value: SIGNING_FEE.WEI,
      });
      setTxHash(hash);
    } catch (err) {
      setTxStatus('error');
      onError?.(err as Error);
      throw err;
    }
  }, [guestbookAddress, writeHub, onError]);
  
  // React to signature
  const reactToSignature = useCallback(async (index: number, emoji: string) => {
    if (!guestbookAddress) throw new Error('No guestbook address');
    
    try {
      setTxStatus('pending');
      const hash = await writeHub({
        address: V2_CONTRACTS.HUB,
        abi: HUB_ABI,
        functionName: 'reactToSignature',
        args: [guestbookAddress, BigInt(index), emoji],
      });
      setTxHash(hash);
    } catch (err) {
      setTxStatus('error');
      onError?.(err as Error);
      throw err;
    }
  }, [guestbookAddress, writeHub, onError]);
  
  // Tip signature
  const tipSignature = useCallback(async (index: number, amount: string) => {
    if (!guestbookAddress) throw new Error('No guestbook address');
    
    try {
      setTxStatus('pending');
      const hash = await writeHub({
        address: V2_CONTRACTS.HUB,
        abi: HUB_ABI,
        functionName: 'tipSignature',
        args: [guestbookAddress, BigInt(index)],
        value: parseEther(amount),
      });
      setTxHash(hash);
    } catch (err) {
      setTxStatus('error');
      onError?.(err as Error);
      throw err;
    }
  }, [guestbookAddress, writeHub, onError]);
  
  // Edit signature
  const editSignature = useCallback(async (index: number, newMessage: string) => {
    if (!guestbookAddress) throw new Error('No guestbook address');
    
    try {
      setTxStatus('pending');
      const hash = await writeGuestbook({
        address: V2_CONTRACTS.GUESTBOOK,
        abi: GUESTBOOK_ABI,
        functionName: 'editSignature',
        args: [guestbookAddress, BigInt(index), newMessage],
      });
      setTxHash(hash);
    } catch (err) {
      setTxStatus('error');
      onError?.(err as Error);
      throw err;
    }
  }, [guestbookAddress, writeGuestbook, onError]);
  
  // Pin signature
  const pinSignature = useCallback(async (index: number) => {
    if (!guestbookAddress) throw new Error('No guestbook address');
    
    try {
      setTxStatus('pending');
      const hash = await writeGuestbook({
        address: V2_CONTRACTS.GUESTBOOK,
        abi: GUESTBOOK_ABI,
        functionName: 'pinSignature',
        args: [guestbookAddress, BigInt(index)],
      });
      setTxHash(hash);
    } catch (err) {
      setTxStatus('error');
      onError?.(err as Error);
      throw err;
    }
  }, [guestbookAddress, writeGuestbook, onError]);
  
  // Load more
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);
  
  // Refresh
  const refresh = useCallback(() => {
    setPage(0);
    refetchCount();
    refetchSignatures();
  }, [refetchCount, refetchSignatures]);
  
  const count = signatureCount ? Number(signatureCount) : 0;
  const hasMore = (page + 1) * pageSize < count;
  
  return {
    signatures,
    signatureCount: count,
    isLoading,
    error: error as Error | null,
    page,
    hasMore,
    loadMore,
    refresh,
    signGuestbook,
    signWithReferral,
    reactToSignature,
    tipSignature,
    editSignature,
    pinSignature,
    isSigning: isHubPending && !txHash,
    isReacting: isHubPending && !txHash,
    isTipping: isHubPending && !txHash,
    isEditing: isGuestbookPending && !txHash,
    isPinning: isGuestbookPending && !txHash,
    txHash,
    txStatus: isWaiting ? 'pending' : txStatus,
  };
}

export default useGuestbookV2;
