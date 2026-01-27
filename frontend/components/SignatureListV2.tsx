'use client';

import React from 'react';

interface Signature {
  id: string;
  signer: string;
  signerEns?: string;
  message: string;
  timestamp: number;
  reactions: number;
  isPinned?: boolean;
  editedAt?: number;
  hasReacted?: boolean;
}

interface SignatureListV2Props {
  signatures: Signature[];
  isLoading?: boolean;
  onReact?: (signatureId: string) => void;
  onPin?: (signatureId: string) => void;
  onShare?: (signature: Signature) => void;
  showReactions?: boolean;
  showPin?: boolean;
  emptyMessage?: string;
}

export function SignatureListV2({
  signatures,
  isLoading = false,
  onReact,
  onPin,
  onShare,
  showReactions = true,
  showPin = false,
  emptyMessage = 'No signatures yet',
}: SignatureListV2Props) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-800" />
              <div>
                <div className="h-4 w-24 bg-gray-800 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-800 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-800 rounded" />
              <div className="h-4 w-3/4 bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (signatures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signatures.map((sig) => (
        <div
          key={sig.id}
          className={`
            p-4 rounded-xl border transition-all
            ${sig.isPinned
              ? 'bg-blue-900/20 border-blue-500/30'
              : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
            }
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {sig.signerEns || formatAddress(sig.signer)}
                  </span>
                  {sig.isPinned && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                      📌 Pinned
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatTime(sig.timestamp)}</span>
                  {sig.editedAt && sig.editedAt > 0 && (
                    <span className="text-gray-600">• edited</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-1">
              {showPin && onPin && (
                <button
                  onClick={() => onPin(sig.id)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${sig.isPinned
                      ? 'text-blue-400 hover:bg-blue-500/20'
                      : 'text-gray-500 hover:text-white hover:bg-gray-800'
                    }
                  `}
                  title={sig.isPinned ? 'Unpin' : 'Pin'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
              {onShare && (
                <button
                  onClick={() => onShare(sig)}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-300 leading-relaxed mb-3">{sig.message}</p>

          {/* Footer */}
          {showReactions && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onReact?.(sig.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors
                  ${sig.hasReacted
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                  }
                `}
              >
                <span>{sig.hasReacted ? '❤️' : '🤍'}</span>
                <span>{sig.reactions}</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Compact Signature Card
interface SignatureCardCompactProps {
  signature: Signature;
  onClick?: () => void;
}

export function SignatureCardCompact({ signature, onClick }: SignatureCardCompactProps) {
  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all text-left"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
        <span className="text-sm font-medium text-white">
          {signature.signerEns || formatAddress(signature.signer)}
        </span>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2">{signature.message}</p>
    </button>
  );
}

// Signature Stats Row
interface SignatureStatsProps {
  totalSignatures: number;
  totalReactions: number;
  uniqueSigners: number;
}

export function SignatureStats({
  totalSignatures,
  totalReactions,
  uniqueSigners,
}: SignatureStatsProps) {
  const stats = [
    { label: 'Signatures', value: totalSignatures, icon: '✍️' },
    { label: 'Reactions', value: totalReactions, icon: '❤️' },
    { label: 'Signers', value: uniqueSigners, icon: '👥' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-center"
        >
          <span className="text-2xl mb-1 block">{stat.icon}</span>
          <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default SignatureListV2;
