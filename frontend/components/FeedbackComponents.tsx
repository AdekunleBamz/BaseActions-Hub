'use client';

import React from 'react';

// Alert Component
interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const alertStyles = {
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: 'text-blue-400',
    title: 'text-blue-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: 'text-green-400',
    title: 'text-green-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: 'text-yellow-400',
    title: 'text-yellow-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: 'text-red-400',
    title: 'text-red-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export function Alert({ 
  type = 'info', 
  title, 
  children, 
  icon, 
  dismissible = false, 
  onDismiss,
  className = ''
}: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${styles.bg} ${className}`}>
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {icon || styles.defaultIcon}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-medium mb-1 ${styles.title}`}>{title}</h4>
        )}
        <div className="text-sm text-gray-300">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Banner Component
interface BannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

const bannerStyles = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
};

export function Banner({ 
  type = 'info', 
  children, 
  action, 
  dismissible = false, 
  onDismiss 
}: BannerProps) {
  return (
    <div className={`${bannerStyles[type]} py-3 px-4`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-sm text-white">{children}</div>
        <div className="flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-white/90 hover:text-white underline underline-offset-2"
            >
              {action.label}
            </button>
          )}
          {dismissible && (
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Callout Component
interface CalloutProps {
  emoji?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ emoji = '💡', title, children, className = '' }: CalloutProps) {
  return (
    <div className={`flex gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700 ${className}`}>
      <span className="text-2xl flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium text-white mb-1">{title}</h4>
        )}
        <div className="text-sm text-gray-400">{children}</div>
      </div>
    </div>
  );
}

// Inline Alert (minimal)
interface InlineAlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

const inlineAlertStyles = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

export function InlineAlert({ type = 'info', children }: InlineAlertProps) {
  return (
    <div className={`flex items-center gap-2 text-sm ${inlineAlertStyles[type]}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyStateV2({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
      {icon ? (
        <div className="text-gray-600 mb-4">{icon}</div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Network Status Indicator
interface NetworkStatusProps {
  isConnected: boolean;
  chainName?: string;
  showLabel?: boolean;
}

export function NetworkStatus({ isConnected, chainName, showLabel = true }: NetworkStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
      {showLabel && (
        <span className="text-sm text-gray-400">
          {isConnected ? chainName || 'Connected' : 'Disconnected'}
        </span>
      )}
    </div>
  );
}

// Transaction Status
interface TransactionStatusProps {
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  explorerUrl?: string;
}

const txStatusStyles = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pending...' },
  confirmed: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Confirmed' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Failed' },
};

export function TransactionStatus({ status, hash, explorerUrl }: TransactionStatusProps) {
  const styles = txStatusStyles[status];
  const shortHash = hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : null;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${styles.bg}`}>
      {status === 'pending' && (
        <svg className="w-5 h-5 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {status === 'confirmed' && (
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {status === 'failed' && (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <div className="flex-1">
        <span className={`text-sm font-medium ${styles.text}`}>{styles.label}</span>
        {shortHash && explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-gray-500 hover:text-gray-400 mt-0.5"
          >
            {shortHash} →
          </a>
        )}
      </div>
    </div>
  );
}

export default {
  Alert,
  Banner,
  Callout,
  InlineAlert,
  EmptyStateV2,
  NetworkStatus,
  TransactionStatus,
};
