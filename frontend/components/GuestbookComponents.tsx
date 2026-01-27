'use client';

import React, { useState, useMemo } from 'react';
import { Card } from './DisplayComponents';
import { Tabs } from './OverlayComponents';

interface GuestbookViewProps {
  address: string;
  ownerInfo?: {
    ensName?: string;
    avatar?: string;
    signatureCount: number;
    totalReactions: number;
    joinedAt: Date;
  };
}

// Guestbook Header with owner info
export function GuestbookHeader({ address, ownerInfo }: GuestbookViewProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8 mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/25">
          {address.slice(2, 4).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white mb-1">
            {ownerInfo?.ensName || shortAddress}&apos;s Guestbook
          </h1>
          <p className="text-gray-400 font-mono text-sm mb-4">{address}</p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div>
              <span className="text-xl font-bold text-white">{ownerInfo?.signatureCount || 0}</span>
              <span className="text-gray-500 text-sm ml-1">signatures</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">{ownerInfo?.totalReactions || 0}</span>
              <span className="text-gray-500 text-sm ml-1">reactions</span>
            </div>
            {ownerInfo?.joinedAt && (
              <div>
                <span className="text-gray-500 text-sm">Joined </span>
                <span className="text-white text-sm">
                  {ownerInfo.joinedAt.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
            Sign Guestbook
          </button>
        </div>
      </div>
    </div>
  );
}

// Signature item with reactions
interface SignatureItemProps {
  signature: {
    id: number;
    message: string;
    signer: string;
    signerEns?: string;
    timestamp: Date;
    isPinned?: boolean;
    reactions: Record<string, number>;
  };
  onReact?: (signatureId: number, reaction: string) => void;
}

export function SignatureItem({ signature, onReact }: SignatureItemProps) {
  const [showReactions, setShowReactions] = useState(false);
  const shortAddress = `${signature.signer.slice(0, 6)}...${signature.signer.slice(-4)}`;

  const reactions = [
    { emoji: '👍', key: 'like' },
    { emoji: '❤️', key: 'love' },
    { emoji: '🔥', key: 'fire' },
    { emoji: '👏', key: 'clap' },
    { emoji: '🚀', key: 'rocket' },
  ];

  const totalReactions = Object.values(signature.reactions).reduce((a, b) => a + b, 0);

  return (
    <Card className="group relative">
      {signature.isPinned && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4a4 4 0 10-4.58 3.96L10 12H8l-1 8 5-3 5 3-1-8h-2l-1.42-4.04A4 4 0 0016 4z" />
          </svg>
        </div>
      )}

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
          {signature.signer.slice(2, 4).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white truncate">
              {signature.signerEns || shortAddress}
            </span>
            <span className="text-gray-500 text-sm">
              {signature.timestamp.toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-300 whitespace-pre-wrap break-words">
            {signature.message}
          </p>

          {/* Reactions */}
          <div className="flex items-center gap-2 mt-4">
            {/* Reaction counts */}
            {Object.entries(signature.reactions)
              .filter(([, count]) => count > 0)
              .map(([key, count]) => {
                const reaction = reactions.find((r) => r.key === key);
                return reaction ? (
                  <button
                    key={key}
                    onClick={() => onReact?.(signature.id, key)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-gray-300">{count}</span>
                  </button>
                ) : null;
              })}

            {/* Add reaction button */}
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-2 rounded-xl bg-gray-900 border border-gray-800 shadow-xl">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.key}
                      onClick={() => {
                        onReact?.(signature.id, reaction.key);
                        setShowReactions(false);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-lg"
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {totalReactions === 0 && (
              <span className="text-sm text-gray-500">Be the first to react!</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Guestbook Tabs
interface GuestbookTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    pinned: number;
    recent: number;
  };
}

export function GuestbookTabs({ activeTab, onTabChange, counts }: GuestbookTabsProps) {
  const tabs = [
    { id: 'all', label: 'All', badge: counts.all },
    { id: 'pinned', label: 'Pinned', badge: counts.pinned },
    { id: 'recent', label: 'Recent', badge: counts.recent },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onChange={onTabChange}
      variant="pills"
    />
  );
}

// Empty Guestbook State
export function EmptyGuestbook({ isOwner }: { isOwner: boolean }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {isOwner ? 'No signatures yet' : 'Be the first to sign!'}
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        {isOwner
          ? 'Share your guestbook link to get signatures from friends and the community.'
          : 'Leave a message in this guestbook to show your support.'}
      </p>
      <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
        {isOwner ? 'Share Guestbook' : 'Sign Guestbook'}
      </button>
    </div>
  );
}

// Sign Form
interface SignFormProps {
  onSubmit: (message: string) => void;
  isSubmitting?: boolean;
  fee?: string;
  quickMessages?: string[];
}

export function GuestbookSignForm({ onSubmit, isSubmitting, fee, quickMessages }: SignFormProps) {
  const [message, setMessage] = useState('');
  const maxLength = 280;

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSubmitting) {
      onSubmit(message);
    }
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold text-white mb-4">Sign the Guestbook</h3>

        {/* Quick messages */}
        {quickMessages && quickMessages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {quickMessages.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickMessage(msg)}
                className="px-3 py-1.5 rounded-full text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {msg}
              </button>
            ))}
          </div>
        )}

        {/* Message input */}
        <div className="relative mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
            placeholder="Write your message..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-none"
          />
          <span className={`absolute bottom-3 right-3 text-xs ${message.length >= maxLength ? 'text-red-400' : 'text-gray-500'}`}>
            {message.length}/{maxLength}
          </span>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Fee: <span className="text-white font-medium">{fee || '0.000001'} ETH</span>
          </span>
          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Guestbook
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default {
  GuestbookHeader,
  SignatureItem,
  GuestbookTabs,
  EmptyGuestbook,
  GuestbookSignForm,
};
