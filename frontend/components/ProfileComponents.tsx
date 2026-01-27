'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './DisplayComponents';
import { Button } from './ButtonComponents';

// Profile Header
interface ProfileHeaderProps {
  address: string;
  ensName?: string;
  avatar?: string;
  bio?: string;
  stats: {
    signatures: number;
    guestbooksCreated: number;
    badges: number;
    points: number;
  };
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onShare?: () => void;
}

export function ProfileHeader({
  address,
  ensName,
  avatar,
  bio,
  stats,
  isCurrentUser,
  onEditProfile,
  onShare,
}: ProfileHeaderProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 p-8 mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          {/* Avatar */}
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={ensName || shortAddress}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-gray-700">
                {address.slice(2, 4).toUpperCase()}
              </div>
            )}
            {isCurrentUser && (
              <button
                onClick={onEditProfile}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">
              {ensName || shortAddress}
            </h1>
            <p className="text-gray-400 font-mono text-sm mb-3">{address}</p>
            {bio && <p className="text-gray-300 max-w-lg">{bio}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={onShare}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </Button>
            {isCurrentUser ? (
              <Button variant="primary" size="sm" onClick={onEditProfile}>
                Edit Profile
              </Button>
            ) : (
              <Button variant="primary" size="sm">
                Sign Guestbook
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Signatures', value: stats.signatures, icon: '✍️' },
            { label: 'Guestbooks', value: stats.guestbooksCreated, icon: '📖' },
            { label: 'Badges', value: stats.badges, icon: '🏆' },
            { label: 'Points', value: stats.points, icon: '⭐' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{stat.icon}</span>
                <span className="text-gray-500 text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Profile Tabs
interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; count?: number }[];
}

export function ProfileTabs({ activeTab, onTabChange, tabs }: ProfileTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-900 border border-gray-800 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-gray-800 text-white'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 text-xs text-gray-500">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

// Activity Feed Item
interface ActivityItem {
  id: string;
  type: 'signed' | 'received' | 'badge' | 'reaction';
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const typeIcons = {
    signed: '✍️',
    received: '📩',
    badge: '🏆',
    reaction: '❤️',
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
        <p className="text-gray-500">Start signing guestbooks to see your activity here!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg">
            {typeIcons[activity.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white">{activity.title}</p>
            <p className="text-gray-400 text-sm">{activity.description}</p>
          </div>
          <span className="text-sm text-gray-500">{formatTime(activity.timestamp)}</span>
        </Card>
      ))}
    </div>
  );
}

// Settings Form
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Card className="mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

// Settings Toggle
interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div>
        <p className="font-medium text-white">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// Connected Wallets List
interface Wallet {
  address: string;
  type: 'metamask' | 'coinbase' | 'walletconnect' | 'other';
  isPrimary?: boolean;
  connectedAt: Date;
}

interface ConnectedWalletsProps {
  wallets: Wallet[];
  onDisconnect?: (address: string) => void;
  onSetPrimary?: (address: string) => void;
}

export function ConnectedWallets({ wallets, onDisconnect, onSetPrimary }: ConnectedWalletsProps) {
  const walletIcons = {
    metamask: '🦊',
    coinbase: '💙',
    walletconnect: '🔗',
    other: '👛',
  };

  return (
    <div className="space-y-3">
      {wallets.map((wallet) => {
        const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;
        return (
          <div
            key={wallet.address}
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800"
          >
            <div className="text-2xl">{walletIcons[wallet.type]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-white">{shortAddress}</span>
                {wallet.isPrimary && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Connected {wallet.connectedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {!wallet.isPrimary && onSetPrimary && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetPrimary(wallet.address)}
                >
                  Set Primary
                </Button>
              )}
              {onDisconnect && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDisconnect(wallet.address)}
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Notification Settings
interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSetting[];
  onToggle: (id: string, enabled: boolean) => void;
}

export function NotificationSettings({ settings, onToggle }: NotificationSettingsProps) {
  return (
    <div>
      {settings.map((setting) => (
        <SettingsToggle
          key={setting.id}
          label={setting.label}
          description={setting.description}
          checked={setting.enabled}
          onChange={(checked) => onToggle(setting.id, checked)}
        />
      ))}
    </div>
  );
}

// Referral Card
interface ReferralCardProps {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  totalEarnings: string;
  onCopy?: () => void;
  onShare?: () => void;
}

export function ReferralCard({
  referralCode,
  referralLink,
  totalReferrals,
  totalEarnings,
  onCopy,
  onShare,
}: ReferralCardProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
          🎁
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Referral Program</h3>
          <p className="text-gray-400 text-sm">Earn rewards by inviting friends</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-2xl font-bold text-white">{totalReferrals}</p>
          <p className="text-sm text-gray-500">Total Referrals</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-2xl font-bold text-white">{totalEarnings}</p>
          <p className="text-sm text-gray-500">Total Earnings</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 mb-4">
        <p className="text-sm text-gray-500 mb-2">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-lg text-white">{referralCode}</code>
          <Button variant="ghost" size="sm" onClick={onCopy}>
            Copy
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" className="flex-1" onClick={onShare}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Link
        </Button>
      </div>
    </Card>
  );
}

export default {
  ProfileHeader,
  ProfileTabs,
  ActivityFeed,
  SettingsSection,
  SettingsToggle,
  ConnectedWallets,
  NotificationSettings,
  ReferralCard,
};
