'use client';

import React from 'react';

// ============================================================================
// FEEDBACK COMPONENTS V2
// ============================================================================

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({ type, message, description, onClose, action }: ToastProps) {
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-800 dark:text-green-200',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-200',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      title: 'text-amber-800 dark:text-amber-200',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
    },
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const style = styles[type];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg
        ${style.bg} ${style.border}
        animate-in slide-in-from-top-2 fade-in duration-300
      `}
    >
      <div className={`shrink-0 ${style.icon}`}>{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${style.title}`}>{message}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className={`mt-2 text-sm font-medium ${style.icon} hover:underline`}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export function Alert({ type, title, children, onClose }: AlertProps) {
  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{title}</h4>
          {children && <div className="mt-1 text-sm opacity-90">{children}</div>}
        </div>
        {onClose && (
          <button onClick={onClose} className="opacity-70 hover:opacity-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`
            ${sizes[size]} ${colors[color]} rounded-full
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const baseClass = 'bg-gray-200 dark:bg-gray-700 animate-pulse';

  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  return <div className={`${baseClass} ${variantClass[variant]} ${className}`} style={style} />;
}

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={60} variant="rectangular" />
      <div className="flex gap-2">
        <Skeleton width="30%" height={32} variant="rectangular" />
        <Skeleton width="30%" height={32} variant="rectangular" />
      </div>
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export function Spinner({ size = 'md', color = 'text-blue-600' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`
          absolute ${positions[position]} z-50
          px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 whitespace-nowrap
          pointer-events-none
        `}
      >
        {content}
      </div>
    </div>
  );
}

interface BadgeNotificationProps {
  count: number;
  children: React.ReactElement;
  max?: number;
  showZero?: boolean;
}

export function BadgeNotification({ count, children, max = 99, showZero = false }: BadgeNotificationProps) {
  if (count === 0 && !showZero) return children;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <div className="relative inline-block">
      {children}
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
        {displayCount}
      </span>
    </div>
  );
}

interface TransactionStatusProps {
  status: 'pending' | 'confirming' | 'success' | 'error';
  hash?: string;
  message?: string;
}

export function TransactionStatus({ status, hash, message }: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      icon: <Spinner size="sm" />,
      text: 'Waiting for confirmation...',
      color: 'text-gray-600 dark:text-gray-300',
    },
    confirming: {
      icon: <Spinner size="sm" />,
      text: 'Transaction confirming...',
      color: 'text-blue-600 dark:text-blue-400',
    },
    success: {
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Transaction successful!',
      color: 'text-green-600 dark:text-green-400',
    },
    error: {
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      text: 'Transaction failed',
      color: 'text-red-600 dark:text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
      {config.icon}
      <div className="flex-1">
        <p className={`font-medium ${config.color}`}>{message || config.text}</p>
        {hash && (
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View on BaseScan →
          </a>
        )}
      </div>
    </div>
  );
}

export default {
  Toast,
  Alert,
  ProgressBar,
  Skeleton,
  SkeletonCard,
  Spinner,
  LoadingOverlay,
  EmptyState,
  ErrorState,
  Tooltip,
  BadgeNotification,
  TransactionStatus,
};
