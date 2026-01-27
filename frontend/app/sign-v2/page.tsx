"use client";

import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { PageWrapper } from "@/components/Layout";
import { CONTRACTS } from "@/config/contracts";
import { BaseActionsHubABI, GuestbookABI } from "@/config/abis";
import Link from "next/link";

// Quick Message Button
function QuickMessage({ message, isSelected, onClick }: { message: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? 'bg-blue-600 text-white scale-105'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
      }`}
    >
      {message}
    </button>
  );
}

// Address Input with ENS resolution visual
function AddressInput({
  value,
  onChange,
  placeholder,
  isValid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  isValid: boolean | null;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-6 py-4 rounded-2xl bg-gray-900 border-2 text-white placeholder-gray-500 focus:outline-none transition-colors ${
          isValid === null
            ? 'border-gray-700 focus:border-blue-500'
            : isValid
            ? 'border-green-500 focus:border-green-400'
            : 'border-red-500 focus:border-red-400'
        }`}
      />
      {isValid !== null && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isValid ? (
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

// Message Textarea with character count
function MessageTextarea({
  value,
  onChange,
  maxLength = 280,
}: {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  const remaining = maxLength - value.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="Write your message... (Make it memorable!)"
        rows={4}
        className="w-full px-6 py-4 rounded-2xl bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
      />
      <div className={`absolute bottom-3 right-4 text-sm ${isOverLimit ? 'text-red-400' : remaining < 50 ? 'text-yellow-400' : 'text-gray-500'}`}>
        {remaining}
      </div>
    </div>
  );
}

// Fee Display
function FeeDisplay({ fee, usdValue }: { fee: string; usdValue?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-medium">Transaction Fee</p>
          <p className="text-sm text-gray-500">One-time signing fee</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-white">{fee} ETH</p>
        {usdValue && <p className="text-sm text-gray-500">${usdValue}</p>}
      </div>
    </div>
  );
}

// Transaction Status
function TransactionStatus({
  status,
  hash,
  onReset,
}: {
  status: 'idle' | 'signing' | 'pending' | 'success' | 'error';
  hash?: string;
  onReset?: () => void;
}) {
  const statusConfig = {
    idle: null,
    signing: {
      icon: (
        <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      title: 'Waiting for signature...',
      description: 'Please confirm the transaction in your wallet',
      color: 'blue',
    },
    pending: {
      icon: (
        <svg className="w-12 h-12 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      title: 'Transaction pending...',
      description: 'Waiting for confirmation on Base',
      color: 'yellow',
    },
    success: {
      icon: (
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      title: 'Signature successful! 🎉',
      description: 'Your message has been recorded on-chain',
      color: 'green',
    },
    error: {
      icon: (
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
      title: 'Transaction failed',
      description: 'Something went wrong. Please try again.',
      color: 'red',
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-gray-900 border border-gray-800 text-center">
        <div className="flex justify-center mb-6">{config.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{config.title}</h3>
        <p className="text-gray-400 mb-6">{config.description}</p>

        {hash && (
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            View on Basescan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        {(status === 'success' || status === 'error') && onReset && (
          <button
            onClick={onReset}
            className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            {status === 'success' ? 'Sign Another' : 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
}

// Main Sign Page
export default function SignPageV2() {
  const { address, isConnected } = useAccount();
  const [toAddress, setToAddress] = useState('');
  const [message, setMessage] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'pending' | 'success' | 'error'>('idle');

  const quickMessages = [
    '👋 Hello, World!',
    '🔥 GM',
    '💙 Love from Base',
    '🚀 To the moon!',
    '✨ Great work!',
    '🎉 Congrats!',
  ];

  // Validate address
  const isValidAddress = toAddress.length === 0 ? null : /^0x[a-fA-F0-9]{40}$/.test(toAddress);

  // Contract write
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Update status based on transaction state
  React.useEffect(() => {
    if (isPending) setTxStatus('signing');
    else if (isConfirming) setTxStatus('pending');
    else if (isSuccess) setTxStatus('success');
    else if (error) setTxStatus('error');
  }, [isPending, isConfirming, isSuccess, error]);

  const handleSign = async () => {
    if (!isValidAddress || !message.trim()) return;

    try {
      writeContract({
        address: CONTRACTS.BaseActionsHub,
        abi: BaseActionsHubABI,
        functionName: 'sign',
        args: [toAddress as `0x${string}`, message],
        value: parseEther('0.000001'),
      });
    } catch (err) {
      console.error('Sign error:', err);
      setTxStatus('error');
    }
  };

  const handleReset = () => {
    setTxStatus('idle');
    if (txStatus === 'success') {
      setMessage('');
      setToAddress('');
    }
  };

  const canSign = isConnected && isValidAddress && message.trim().length > 0;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Sign a Guestbook
          </h1>
          <p className="text-gray-400 text-lg">
            Leave your mark on any wallet's on-chain guestbook
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label className="block text-white font-medium mb-2">
              Recipient Address
            </label>
            <AddressInput
              value={toAddress}
              onChange={setToAddress}
              placeholder="0x... or ENS name"
              isValid={isValidAddress}
            />
            {address && (
              <button
                onClick={() => setToAddress(address)}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Use my address
              </button>
            )}
          </div>

          {/* Quick Messages */}
          <div>
            <label className="block text-white font-medium mb-3">
              Quick Messages
            </label>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map((msg) => (
                <QuickMessage
                  key={msg}
                  message={msg}
                  isSelected={message === msg}
                  onClick={() => setMessage(msg)}
                />
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Message
            </label>
            <MessageTextarea value={message} onChange={setMessage} />
          </div>

          {/* Fee */}
          <FeeDisplay fee="0.000001" />

          {/* Sign Button */}
          <button
            onClick={handleSign}
            disabled={!canSign}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              canSign
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!isConnected ? 'Connect Wallet to Sign' : 'Sign Guestbook'}
          </button>
        </div>

        {/* Points Info */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">🎉 Earn Points!</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-green-400">+10 pts</span> for each signature
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">+5 pts</span> daily bonus for first sign
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">+50 pts</span> for 7-day streak
            </li>
          </ul>
        </div>

        {/* Transaction Status Overlay */}
        {txStatus !== 'idle' && (
          <TransactionStatus
            status={txStatus}
            hash={txHash}
            onReset={handleReset}
          />
        )}
      </div>
    </PageWrapper>
  );
}
