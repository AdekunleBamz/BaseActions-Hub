'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatAddress } from '@/lib/utils';

// ============================================================================
// PROFILE PAGE - User Profile with Stats and Activity
// ============================================================================

interface UserStats {
  signaturesMade: number;
  signaturesReceived: number;
  reactionsGiven: number;
  reactionsReceived: number;
  tipsGiven: string;
  tipsReceived: string;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  badgesEarned: number;
  uniqueGuestbooks: number;
  uniqueSigners: number;
  joinedAt: number;
  lastActiveAt: number;
}

interface ActivityItem {
  id: string;
  type: 'signed' | 'received' | 'reacted' | 'tipped' | 'badge';
  title: string;
  subtitle: string;
  timestamp: number;
  emoji: string;
  amount?: string;
}

const MOCK_STATS: UserStats = {
  signaturesMade: 47,
  signaturesReceived: 23,
  reactionsGiven: 156,
  reactionsReceived: 89,
  tipsGiven: '0.05',
  tipsReceived: '0.12',
  currentStreak: 5,
  longestStreak: 14,
  rank: 42,
  badgesEarned: 8,
  uniqueGuestbooks: 35,
  uniqueSigners: 18,
  joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  lastActiveAt: Date.now() - 2 * 60 * 60 * 1000,
};

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'signed', title: 'Signed guestbook', subtitle: 'of 0xabcd...1234', timestamp: Date.now() - 3600000, emoji: '✍️' },
  { id: '2', type: 'received', title: 'Received signature', subtitle: 'from 0x5678...9abc', timestamp: Date.now() - 7200000, emoji: '📩' },
  { id: '3', type: 'reacted', title: 'Reacted with ❤️', subtitle: 'on signature by 0xdef...4567', timestamp: Date.now() - 10800000, emoji: '❤️' },
  { id: '4', type: 'badge', title: 'Earned badge', subtitle: 'Active Signer', timestamp: Date.now() - 14400000, emoji: '🏆' },
  { id: '5', type: 'tipped', title: 'Received tip', subtitle: '0.001 ETH from 0x1234...5678', timestamp: Date.now() - 18000000, emoji: '💰', amount: '0.001' },
  { id: '6', type: 'signed', title: 'Signed guestbook', subtitle: 'of 0xfedc...8765', timestamp: Date.now() - 21600000, emoji: '✍️' },
  { id: '7', type: 'received', title: 'Received signature', subtitle: 'from 0x9876...5432', timestamp: Date.now() - 86400000, emoji: '📩' },
  { id: '8', type: 'reacted', title: 'Received reaction 🔥', subtitle: 'on your signature', timestamp: Date.now() - 90000000, emoji: '🔥' },
];

const TABS = ['Overview', 'Activity', 'Badges', 'Settings'];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('Based builder exploring Web3 🚀');

  const formattedAddress = address ? formatAddress(address) : '';

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 max-w-md">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect your wallet to view your profile, stats, and activity.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Profile Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl md:text-5xl ring-4 ring-white/20">
              🧑‍💻
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="text-2xl md:text-3xl font-bold bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 mb-2"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {displayName || formattedAddress}
                </h1>
              )}
              <p className="text-white/80 mb-2">{address}</p>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  className="w-full max-w-md text-sm bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 resize-none"
                  rows={2}
                />
              ) : (
                <p className="text-white/70 text-sm max-w-md">{bio}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-colors"
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 font-medium rounded-xl hover:bg-white/90 transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <StatCard label="Signatures Made" value={MOCK_STATS.signaturesMade} icon="✍️" />
            <StatCard label="Signatures Received" value={MOCK_STATS.signaturesReceived} icon="📩" />
            <StatCard label="Current Streak" value={`${MOCK_STATS.currentStreak} days`} icon="🔥" />
            <StatCard label="Leaderboard Rank" value={`#${MOCK_STATS.rank}`} icon="🏆" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'Overview' && <OverviewTab stats={MOCK_STATS} />}
        {activeTab === 'Activity' && <ActivityTab activity={MOCK_ACTIVITY} />}
        {activeTab === 'Badges' && <BadgesTab />}
        {activeTab === 'Settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm text-white/70">{label}</p>
    </div>
  );
}

function OverviewTab({ stats }: { stats: UserStats }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Signing Stats */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Signing Activity</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Signatures Made</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.signaturesMade}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Signatures Received</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.signaturesReceived}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Unique Guestbooks</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.uniqueGuestbooks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Unique Signers</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.uniqueSigners}</span>
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Engagement</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Reactions Given</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.reactionsGiven}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Reactions Received</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.reactionsReceived}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Tips Given</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.tipsGiven} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Tips Received</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.tipsReceived} ETH</span>
          </div>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Streaks & Rank</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
            <span className="font-bold text-orange-500">{stats.currentStreak} days 🔥</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Longest Streak</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.longestStreak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Leaderboard Rank</span>
            <span className="font-bold text-blue-600">#{stats.rank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Badges Earned</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.badgesEarned}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {activity.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              item.type === 'signed' ? 'bg-blue-100 dark:bg-blue-900/30' :
              item.type === 'received' ? 'bg-green-100 dark:bg-green-900/30' :
              item.type === 'reacted' ? 'bg-pink-100 dark:bg-pink-900/30' :
              item.type === 'badge' ? 'bg-amber-100 dark:bg-amber-900/30' :
              'bg-yellow-100 dark:bg-yellow-900/30'
            }`}>
              {item.emoji}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
            </div>
            <span className="text-xs text-gray-400">
              {formatRelativeTime(item.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgesTab() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🏅</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">View All Badges</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        See your complete badge collection
      </p>
      <a
        href="/badges"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
      >
        Go to Badge Gallery
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Notification Settings */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          <SettingToggle label="Email notifications" description="Receive updates about new signatures" defaultChecked />
          <SettingToggle label="Push notifications" description="Browser notifications for reactions" />
          <SettingToggle label="Weekly digest" description="Summary of your activity" defaultChecked />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Privacy</h3>
        <div className="space-y-4">
          <SettingToggle label="Public profile" description="Allow others to view your profile" defaultChecked />
          <SettingToggle label="Show on leaderboard" description="Appear in public rankings" defaultChecked />
          <SettingToggle label="Show activity" description="Display recent activity on profile" />
        </div>
      </div>

      {/* Display Settings */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Display</h3>
        <div className="space-y-4">
          <SettingToggle label="Dark mode" description="Use dark theme" />
          <SettingToggle label="Compact view" description="Show more items with smaller cards" />
          <SettingToggle label="Animations" description="Enable motion effects" defaultChecked />
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ 
  label, 
  description, 
  defaultChecked = false 
}: { 
  label: string; 
  description: string; 
  defaultChecked?: boolean;
}) {
  const [isEnabled, setIsEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          isEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            isEnabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
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
