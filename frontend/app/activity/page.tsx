'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

// ============================================================================
// ACTIVITY FEED PAGE - Real-time Platform Activity
// ============================================================================

interface ActivityItem {
  id: string;
  type: 'signature' | 'reaction' | 'tip' | 'badge' | 'milestone';
  actor: string;
  actorName?: string;
  target?: string;
  targetName?: string;
  message?: string;
  amount?: string;
  badgeName?: string;
  emoji?: string;
  timestamp: number;
}

const ACTIVITY_TYPES = {
  signature: { icon: '✍️', color: 'blue', label: 'Signed' },
  reaction: { icon: '❤️', color: 'pink', label: 'Reacted' },
  tip: { icon: '💰', color: 'amber', label: 'Tipped' },
  badge: { icon: '🏆', color: 'purple', label: 'Earned Badge' },
  milestone: { icon: '🎉', color: 'green', label: 'Milestone' },
};

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'signature', actor: '0x742d35Cc6634C0532925a3b844Bc9e7595f3dBc7', target: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', message: 'GM! Love the project 🚀', timestamp: Date.now() - 60000 },
  { id: '2', type: 'reaction', actor: '0xabcdef1234567890abcdef1234567890abcdef12', target: '0x742d35Cc6634C0532925a3b844Bc9e7595f3dBc7', emoji: '🔥', timestamp: Date.now() - 120000 },
  { id: '3', type: 'tip', actor: '0x1234567890abcdef1234567890abcdef12345678', target: '0xabcdef1234567890abcdef1234567890abcdef12', amount: '0.001', timestamp: Date.now() - 180000 },
  { id: '4', type: 'badge', actor: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', badgeName: 'Power Signer', emoji: '💪', timestamp: Date.now() - 240000 },
  { id: '5', type: 'milestone', actor: '0x742d35Cc6634C0532925a3b844Bc9e7595f3dBc7', message: 'Reached 100 signatures!', timestamp: Date.now() - 300000 },
  { id: '6', type: 'signature', actor: '0x5678901234abcdef5678901234abcdef56789012', target: '0x1234567890abcdef1234567890abcdef12345678', message: 'Excited to be here! 💙', timestamp: Date.now() - 360000 },
  { id: '7', type: 'reaction', actor: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', target: '0x5678901234abcdef5678901234abcdef56789012', emoji: '👏', timestamp: Date.now() - 420000 },
  { id: '8', type: 'signature', actor: '0x9abc01234def56789abc01234def56789abc0123', target: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', message: 'Based builder vibes ✨', timestamp: Date.now() - 480000 },
  { id: '9', type: 'tip', actor: '0xdef456789abc0123def456789abc0123def45678', target: '0x9abc01234def56789abc01234def56789abc0123', amount: '0.005', timestamp: Date.now() - 540000 },
  { id: '10', type: 'badge', actor: '0x1234567890abcdef1234567890abcdef12345678', badgeName: 'First Signature', emoji: '✍️', timestamp: Date.now() - 600000 },
];

const FILTERS = [
  { id: 'all', label: 'All Activity' },
  { id: 'signature', label: 'Signatures' },
  { id: 'reaction', label: 'Reactions' },
  { id: 'tip', label: 'Tips' },
  { id: 'badge', label: 'Badges' },
];

export default function ActivityPage() {
  const { address } = useAccount();
  const [filter, setFilter] = useState('all');
  const [activity, setActivity] = useState(MOCK_ACTIVITY);
  const [isLive, setIsLive] = useState(true);
  const [newCount, setNewCount] = useState(0);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setNewCount((prev) => prev + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredActivity = filter === 'all' 
    ? activity 
    : activity.filter(a => a.type === filter);

  const loadNewActivity = () => {
    // Simulate loading new activity
    const newItem: ActivityItem = {
      id: `new-${Date.now()}`,
      type: 'signature',
      actor: '0xnew1234567890abcdef1234567890abcdef12345',
      target: '0xtarget1234567890abcdef1234567890abcdef',
      message: 'Just joined! 🎉',
      timestamp: Date.now(),
    };
    setActivity([newItem, ...activity]);
    setNewCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real-time activity across BaseActions Hub
              </p>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isLive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isLive ? 'Live' : 'Paused'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Activity Alert */}
      {newCount > 0 && (
        <div className="container mx-auto px-4 pt-4">
          <button
            onClick={loadNewActivity}
            className="w-full py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Load {newCount} new activit{newCount === 1 ? 'y' : 'ies'}
          </button>
        </div>
      )}

      {/* Activity List */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="space-y-3">
          {filteredActivity.map((item, index) => (
            <ActivityCard key={item.id} item={item} isNew={index === 0 && newCount === 0} />
          ))}
        </div>

        {/* Load More */}
        <button className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Load More Activity
        </button>
      </div>

      {/* Stats Sidebar - Desktop */}
      <div className="hidden xl:block fixed right-8 top-24 w-80">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Signatures</span>
              <span className="font-bold text-gray-900 dark:text-white">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Reactions</span>
              <span className="font-bold text-gray-900 dark:text-white">5,678</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tips Sent</span>
              <span className="font-bold text-gray-900 dark:text-white">0.45 ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-bold text-gray-900 dark:text-white">892</span>
            </div>
          </div>
        </div>

        {/* Trending Guestbooks */}
        <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🔥 Trending</h3>
          <div className="space-y-3">
            {['vitalik.eth', 'base.eth', 'jesse.base.eth'].map((name, i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-lg">{['🥇', '🥈', '🥉'][i]}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-500">+{45 - i * 12} signatures today</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ item, isNew }: { item: ActivityItem; isNew?: boolean }) {
  const config = ACTIVITY_TYPES[item.type];
  
  const getDescription = () => {
    switch (item.type) {
      case 'signature':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.actor)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> signed </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.target || '')}
            </span>
            <span className="text-gray-500 dark:text-gray-400">'s guestbook</span>
          </>
        );
      case 'reaction':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.actor)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> reacted with </span>
            <span className="text-lg">{item.emoji}</span>
          </>
        );
      case 'tip':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.actor)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> tipped </span>
            <span className="font-medium text-amber-600">{item.amount} ETH</span>
            <span className="text-gray-500 dark:text-gray-400"> to </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.target || '')}
            </span>
          </>
        );
      case 'badge':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.actor)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> earned </span>
            <span className="font-medium text-purple-600">{item.badgeName}</span>
            <span className="ml-1">{item.emoji}</span>
          </>
        );
      case 'milestone':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(item.actor)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> {item.message}</span>
          </>
        );
    }
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isNew 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          config.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
          config.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30' :
          config.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
          config.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
          'bg-green-100 dark:bg-green-900/30'
        }`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">
            {getDescription()}
          </p>
          
          {/* Message preview for signatures */}
          {item.type === 'signature' && item.message && (
            <p className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-600 dark:text-gray-300 italic">
              "{item.message}"
            </p>
          )}

          {/* Timestamp */}
          <p className="mt-2 text-xs text-gray-400">
            {formatRelativeTime(item.timestamp)}
          </p>
        </div>

        {/* Type Badge */}
        <span className={`px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
          config.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
          config.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
          config.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
          config.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
          'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        }`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}

function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}
