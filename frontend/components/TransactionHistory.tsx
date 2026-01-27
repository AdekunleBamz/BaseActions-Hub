'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { parseAbiItem, formatEther } from 'viem';
import { V2_CONTRACTS } from '@/config/contracts-v2';

// ============================================================================
// TRANSACTION HISTORY COMPONENT - Show user's platform transactions
// ============================================================================

interface Transaction {
  hash: string;
  type: 'sign' | 'react' | 'tip' | 'badge' | 'edit';
  timestamp: number;
  details: string;
  value?: string;
  status: 'confirmed' | 'pending';
}

interface TransactionHistoryProps {
  address?: string;
  limit?: number;
}

// Mock transactions for display
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'sign',
    timestamp: Date.now() - 3600000,
    details: 'Signed guestbook of 0xd8dA...6045',
    status: 'confirmed',
  },
  {
    hash: '0x2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef0123',
    type: 'react',
    timestamp: Date.now() - 7200000,
    details: 'Reacted ❤️ to signature',
    status: 'confirmed',
  },
  {
    hash: '0x3456789012cdef03456789012cdef03456789012cdef03456789012cdef01234',
    type: 'tip',
    timestamp: Date.now() - 10800000,
    details: 'Tipped signature',
    value: '0.001',
    status: 'confirmed',
  },
  {
    hash: '0x4567890123def014567890123def014567890123def014567890123def012345',
    type: 'badge',
    timestamp: Date.now() - 14400000,
    details: 'Earned First Signature badge',
    status: 'confirmed',
  },
  {
    hash: '0x5678901234ef0125678901234ef0125678901234ef0125678901234ef0123456',
    type: 'sign',
    timestamp: Date.now() - 18000000,
    details: 'Signed guestbook of 0x742d...dBc7',
    status: 'confirmed',
  },
];

const TX_TYPE_CONFIG = {
  sign: {
    icon: '✍️',
    label: 'Signed',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  react: {
    icon: '❤️',
    label: 'Reacted',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  },
  tip: {
    icon: '💰',
    label: 'Tipped',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  badge: {
    icon: '🏆',
    label: 'Badge',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  edit: {
    icon: '✏️',
    label: 'Edited',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
};

export default function TransactionHistory({ 
  address: propAddress, 
  limit = 10 
}: TransactionHistoryProps) {
  const { address: userAddress, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Transaction['type']>('all');

  const targetAddress = propAddress || userAddress;

  // Load transactions (mock for now)
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS.slice(0, limit));
      setIsLoading(false);
    }, 500);
  }, [targetAddress, limit]);

  const filteredTx = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  if (!isConnected && !propAddress) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <span className="text-3xl mb-4 block">🔗</span>
        <p className="text-gray-600 dark:text-gray-300">Connect wallet to view transaction history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {(['all', 'sign', 'react', 'tip', 'badge'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type === 'all' ? 'All' : TX_TYPE_CONFIG[type].label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTx.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <span className="text-3xl mb-4 block">📭</span>
            <p className="text-gray-600 dark:text-gray-300">No transactions found</p>
          </div>
        ) : (
          filteredTx.map((tx) => (
            <TransactionCard key={tx.hash} transaction={tx} />
          ))
        )}
      </div>

      {/* View All Link */}
      {transactions.length >= limit && (
        <a
          href={`https://basescan.org/address/${targetAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700"
        >
          View all on Basescan →
        </a>
      )}
    </div>
  );
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const config = TX_TYPE_CONFIG[transaction.type];

  return (
    <a
      href={`https://basescan.org/tx/${transaction.hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
          <span className="text-lg">{config.icon}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {config.label}
            </span>
            {transaction.value && (
              <span className="text-sm font-medium text-amber-600">
                {transaction.value} ETH
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {transaction.details}
          </p>
        </div>

        {/* Time & Status */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">
            {formatRelativeTime(transaction.timestamp)}
          </p>
          <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
            transaction.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`} />
        </div>
      </div>
    </a>
  );
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}
