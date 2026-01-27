'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, ACTION_COST } from '@/config/contracts';
import { GuestbookABI, BaseActionsHubABI } from '@/config/abis';

/**
 * Hook for signing a guestbook
 */
export function useSignGuestbookV2() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'error'>('idle');

  const { 
    writeContract, 
    data: hash, 
    isPending,
    error: writeError,
    reset: resetWrite 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess,
    error: confirmError 
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending) setStatus('pending');
    else if (isConfirming) setStatus('confirming');
    else if (isSuccess) setStatus('success');
    else if (writeError || confirmError) setStatus('error');
    else setStatus('idle');
  }, [isPending, isConfirming, isSuccess, writeError, confirmError]);

  const sign = async (targetAddress: `0x${string}`, message: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!message.trim()) {
      throw new Error('Message is required');
    }

    if (message.length > 280) {
      throw new Error('Message too long (max 280 characters)');
    }

    writeContract({
      address: CONTRACTS.BaseActionsHub,
      abi: BaseActionsHubABI,
      functionName: 'sign',
      args: [targetAddress, message],
      value: ACTION_COST,
    });
  };

  const reset = () => {
    setStatus('idle');
    resetWrite();
  };

  return {
    sign,
    reset,
    status,
    hash,
    isPending: status === 'pending',
    isConfirming: status === 'confirming',
    isSuccess: status === 'success',
    isError: status === 'error',
    error: writeError || confirmError,
  };
}

/**
 * Hook for reacting to a signature
 */
export function useReactToSignature() {
  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error,
    reset 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const react = async (guestbookOwner: `0x${string}`, signatureIndex: number) => {
    if (!isConnected) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACTS.Guestbook,
      abi: GuestbookABI,
      functionName: 'react',
      args: [guestbookOwner, BigInt(signatureIndex)],
    });
  };

  const unreact = async (guestbookOwner: `0x${string}`, signatureIndex: number) => {
    if (!isConnected) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACTS.Guestbook,
      abi: GuestbookABI,
      functionName: 'unreact',
      args: [guestbookOwner, BigInt(signatureIndex)],
    });
  };

  return {
    react,
    unreact,
    reset,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for editing a signature
 */
export function useEditSignature() {
  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error,
    reset 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const editSignature = async (
    guestbookOwner: `0x${string}`, 
    signatureIndex: number, 
    newMessage: string
  ) => {
    if (!isConnected) throw new Error('Wallet not connected');

    if (!newMessage.trim()) throw new Error('Message is required');
    if (newMessage.length > 280) throw new Error('Message too long');

    writeContract({
      address: CONTRACTS.Guestbook,
      abi: GuestbookABI,
      functionName: 'editSignature',
      args: [guestbookOwner, BigInt(signatureIndex), newMessage],
    });
  };

  return {
    editSignature,
    reset,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for pinning/unpinning signatures
 */
export function usePinSignature() {
  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error,
    reset 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const pinSignature = async (signatureIndex: number) => {
    if (!isConnected) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACTS.Guestbook,
      abi: GuestbookABI,
      functionName: 'pinSignature',
      args: [BigInt(signatureIndex)],
    });
  };

  const unpinSignature = async () => {
    if (!isConnected) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACTS.Guestbook,
      abi: GuestbookABI,
      functionName: 'unpinSignature',
    });
  };

  return {
    pinSignature,
    unpinSignature,
    reset,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for batch signing (multiple guestbooks)
 */
export function useBatchSign() {
  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error,
    reset 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const batchSign = async (
    guestbookOwners: `0x${string}`[], 
    messages: string[]
  ) => {
    if (!isConnected) throw new Error('Wallet not connected');

    if (guestbookOwners.length !== messages.length) {
      throw new Error('Owners and messages arrays must be same length');
    }

    if (guestbookOwners.length > 10) {
      throw new Error('Maximum 10 signatures per batch');
    }

    const totalCost = ACTION_COST * BigInt(guestbookOwners.length);

    writeContract({
      address: CONTRACTS.BaseActionsHub,
      abi: BaseActionsHubABI,
      functionName: 'batchSign',
      args: [guestbookOwners, messages],
      value: totalCost,
    });
  };

  return {
    batchSign,
    reset,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for tipping a signature author
 */
export function useTipSignature() {
  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error,
    reset 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const tip = async (recipient: `0x${string}`, amount: bigint) => {
    if (!isConnected) throw new Error('Wallet not connected');

    if (amount <= 0n) throw new Error('Tip amount must be positive');

    writeContract({
      address: CONTRACTS.BaseActionsHub,
      abi: BaseActionsHubABI,
      functionName: 'tip',
      args: [recipient],
      value: amount,
    });
  };

  return {
    tip,
    reset,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook for signing with referral
 */
export function useSignWithReferral() {
  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error,
    reset 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const signWithReferral = async (
    guestbookOwner: `0x${string}`,
    message: string,
    referrer: `0x${string}`
  ) => {
    if (!isConnected) throw new Error('Wallet not connected');

    if (!message.trim()) throw new Error('Message is required');
    if (message.length > 280) throw new Error('Message too long');

    writeContract({
      address: CONTRACTS.BaseActionsHub,
      abi: BaseActionsHubABI,
      functionName: 'signWithReferral',
      args: [guestbookOwner, message, referrer],
      value: ACTION_COST,
    });
  };

  return {
    signWithReferral,
    reset,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export default {
  useSignGuestbookV2,
  useReactToSignature,
  useEditSignature,
  usePinSignature,
  useBatchSign,
  useTipSignature,
  useSignWithReferral,
};
