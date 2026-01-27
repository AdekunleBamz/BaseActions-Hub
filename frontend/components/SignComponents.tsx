'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { CONTRACTS, ACTION_COST, CHAIN_ID } from '@/config/contracts';
import { useSignGuestbookV2 } from '@/hooks/useContractActions';
import { formatEth, formatAddress, getRelativeTime } from '@/lib/utils';

// Mock data for demo
const MOCK_SIGNATURES = [
  {
    id: 1,
    signer: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    message: 'Welcome to BaseActions Hub! Great platform for the community 🚀',
    timestamp: Date.now() - 3600000,
    reactions: 12,
    isPinned: true,
  },
  {
    id: 2,
    signer: '0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
    message: 'First time signing a blockchain guestbook. This is amazing!',
    timestamp: Date.now() - 7200000,
    reactions: 8,
    isPinned: false,
  },
  {
    id: 3,
    signer: '0x9876543210987654321098765432109876543210' as `0x${string}`,
    message: 'Love the concept! Looking forward to collecting badges.',
    timestamp: Date.now() - 14400000,
    reactions: 5,
    isPinned: false,
  },
];

interface SignFormProps {
  targetAddress: `0x${string}`;
  onSuccess?: () => void;
}

export function SignFormV2({ targetAddress, onSuccess }: SignFormProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { sign, status, isSuccess, isPending, isConfirming, error, reset } = useSignGuestbookV2();

  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxLength = 280;

  const hasEnoughBalance = balance && balance.value >= ACTION_COST;
  const isCorrectNetwork = chainId === CHAIN_ID;
  const canSign = isConnected && hasEnoughBalance && isCorrectNetwork && message.trim().length > 0;

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
      setMessage('');
      setCharCount(0);
    }
  }, [isSuccess, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSign) return;

    try {
      await sign(targetAddress, message);
    } catch (err) {
      console.error('Sign error:', err);
    }
  };

  const quickMessages = [
    'Hello! 👋',
    'Great to meet you! 🎉',
    'GM fren! ☀️',
    'WAGMI! 🚀',
    'Stay based! 💙',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sign the Guestbook
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Messages */}
        <div className="flex flex-wrap gap-2">
          {quickMessages.map((msg) => (
            <button
              key={msg}
              type="button"
              onClick={() => {
                setMessage(msg);
                setCharCount(msg.length);
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              const value = e.target.value.slice(0, maxLength);
              setMessage(value);
              setCharCount(value.length);
            }}
            placeholder="Write your message..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {charCount}/{maxLength}
          </div>
        </div>

        {/* Cost Display */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Cost:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatEth(ACTION_COST)} ETH
          </span>
        </div>

        {/* Validation Messages */}
        {!isConnected && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Connect your wallet to sign the guestbook
            </p>
          </div>
        )}

        {isConnected && !isCorrectNetwork && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              Please switch to Base network
            </p>
          </div>
        )}

        {isConnected && isCorrectNetwork && !hasEnoughBalance && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              Insufficient ETH balance. Need at least {formatEth(ACTION_COST)} ETH
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error.message || 'Transaction failed'}
            </p>
          </div>
        )}

        {/* Status Display */}
        {isPending && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Waiting for confirmation...
            </span>
          </div>
        )}

        {isConfirming && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Transaction confirming...
            </span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700 dark:text-green-300">
              Successfully signed!
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSign || isPending || isConfirming}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? 'Processing...' : 'Sign Guestbook'}
        </button>
      </form>
    </div>
  );
}

interface SignatureListProps {
  targetAddress?: `0x${string}`;
  signatures?: typeof MOCK_SIGNATURES;
  loading?: boolean;
}

export function SignatureListV2({ targetAddress, signatures = MOCK_SIGNATURES, loading }: SignatureListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'popular'>('all');

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const sortedSignatures = [...signatures].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (activeTab) {
      case 'recent':
        return b.timestamp - a.timestamp;
      case 'popular':
        return b.reactions - a.reactions;
      default:
        return b.timestamp - a.timestamp;
    }
  });

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(['all', 'recent', 'popular'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Signatures */}
      {sortedSignatures.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No signatures yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Be the first to sign this guestbook!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSignatures.map((sig) => (
            <div
              key={sig.id}
              className={`p-4 rounded-xl border transition-all ${
                sig.isPinned
                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {sig.isPinned && (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mb-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
                  </svg>
                  Pinned
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {sig.signer.slice(2, 4).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {formatAddress(sig.signer)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getRelativeTime(sig.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    {sig.message}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {sig.reactions}
                    </button>
                    
                    <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                      Reply
                    </button>
                    
                    <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default {
  SignFormV2,
  SignatureListV2,
};
