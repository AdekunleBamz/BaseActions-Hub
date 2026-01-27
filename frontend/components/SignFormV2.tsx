'use client';

import React, { useState } from 'react';

interface SignFormV2Props {
  recipientAddress: string;
  recipientEns?: string;
  onSubmit: (message: string) => Promise<void>;
  suggestedMessages?: string[];
  isLoading?: boolean;
  fee?: string;
  disabled?: boolean;
}

export function SignFormV2({
  recipientAddress,
  recipientEns,
  onSubmit,
  suggestedMessages = [],
  isLoading = false,
  fee = '0.000001 ETH',
  disabled = false,
}: SignFormV2Props) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const maxLength = 280;
  const remaining = maxLength - message.length;
  const isValid = message.length >= 2 && message.length <= maxLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading || disabled) return;

    await onSubmit(message);
    setMessage('');
  };

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
  };

  const formatAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`;

  const defaultSuggestions = [
    'GM! 🌞',
    'Love your work! 🔥',
    'We\'re all gonna make it! 💪',
    'Based and onchain ✨',
    'Hello from the blockchain! 🚀',
  ];

  const suggestions = suggestedMessages.length > 0 ? suggestedMessages : defaultSuggestions;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Recipient Display */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Signing guestbook of
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          <div>
            <p className="font-medium text-white">
              {recipientEns || formatAddress(recipientAddress)}
            </p>
            {recipientEns && (
              <p className="text-xs text-gray-500">{formatAddress(recipientAddress)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className={`
        relative rounded-xl border-2 transition-all
        ${isFocused
          ? 'border-blue-500 bg-blue-500/5'
          : 'border-gray-700 bg-gray-900/50'
        }
      `}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Write your message..."
          rows={4}
          maxLength={maxLength}
          disabled={isLoading || disabled}
          className="w-full p-4 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-3 right-3">
          <span className={`
            text-xs font-medium
            ${remaining < 20 ? 'text-yellow-500' : ''}
            ${remaining < 0 ? 'text-red-500' : 'text-gray-500'}
          `}>
            {remaining}
          </span>
        </div>
      </div>

      {/* Quick Messages */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Quick Messages</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((msg, i) => (
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
      </div>

      {/* Fee Info */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-400">Signing fee</span>
        </div>
        <span className="text-sm font-medium text-white">{fee}</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isLoading || disabled}
        className={`
          w-full py-4 rounded-xl font-semibold text-white
          transition-all transform
          ${isValid && !isLoading && !disabled
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-gray-700 cursor-not-allowed opacity-50'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✍️ Sign Guestbook
          </span>
        )}
      </button>
    </form>
  );
}

// Success Modal Content
interface SignSuccessProps {
  txHash: string;
  message: string;
  recipientAddress: string;
  recipientEns?: string;
  onViewGuestbook?: () => void;
  onSignAnother?: () => void;
}

export function SignSuccessModal({
  txHash,
  message,
  recipientAddress,
  recipientEns,
  onViewGuestbook,
  onSignAnother,
}: SignSuccessProps) {
  const formatAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`;
  const formatTxHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <div className="p-6 text-center">
      {/* Success Animation */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-in">
        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Signature Complete! 🎉</h3>
      <p className="text-gray-400 mb-6">
        Your message has been permanently recorded on the blockchain
      </p>

      {/* Signature Preview */}
      <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-left mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">To:</span>
          <span className="text-sm text-white">
            {recipientEns || formatAddress(recipientAddress)}
          </span>
        </div>
        <p className="text-gray-300 italic">&quot;{message}&quot;</p>
      </div>

      {/* Transaction Link */}
      <a
        href={`https://sepolia.basescan.org/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-6"
      >
        <span>View on BaseScan</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span className="text-gray-500">({formatTxHash(txHash)})</span>
      </a>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onViewGuestbook && (
          <button
            onClick={onViewGuestbook}
            className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            View Guestbook
          </button>
        )}
        {onSignAnother && (
          <button
            onClick={onSignAnother}
            className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Sign Another
          </button>
        )}
      </div>
    </div>
  );
}

export default SignFormV2;
