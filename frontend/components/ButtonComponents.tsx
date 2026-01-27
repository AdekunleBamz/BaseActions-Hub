'use client';

import React from 'react';

// Button Component with variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
    outline: 'bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

// Button Group
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({ children, orientation = 'horizontal', className = '' }: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: 'flex-row [&>button]:rounded-none [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl [&>button:not(:first-child)]:-ml-px',
    vertical: 'flex-col [&>button]:rounded-none [&>button:first-child]:rounded-t-xl [&>button:last-child]:rounded-b-xl [&>button:not(:first-child)]:-mt-px',
  };

  return (
    <div className={`inline-flex ${orientationClasses[orientation]} ${className}`}>
      {children}
    </div>
  );
}

// Connect Wallet Button
interface ConnectButtonProps {
  isConnected: boolean;
  isConnecting?: boolean;
  address?: string;
  ensName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export function ConnectButton({
  isConnected,
  isConnecting,
  address,
  ensName,
  onConnect,
  onDisconnect,
  className = '',
}: ConnectButtonProps) {
  if (isConnecting) {
    return (
      <Button variant="secondary" isLoading className={className}>
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    const displayName = ensName || `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <button
        onClick={onDisconnect}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-gray-800 border border-gray-700
          hover:border-gray-600 hover:bg-gray-700
          transition-all group
          ${className}
        `}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
        <span className="text-sm font-medium text-white">{displayName}</span>
        <svg
          className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={onConnect}
      leftIcon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      }
      className={className}
    >
      Connect Wallet
    </Button>
  );
}

// Copy Button
interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  className?: string;
}

export function CopyButtonV2({ text, onCopy, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        p-2 rounded-lg text-gray-400 hover:text-white
        hover:bg-gray-800 transition-all
        ${className}
      `}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// Share Button
interface ShareButtonProps {
  title?: string;
  text?: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, text, url, className = '' }: ShareButtonProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || '')}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareToWarpcast = () => {
    window.open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text || '')} ${url}`,
      '_blank'
    );
  };

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div className="relative">
      <button
        onClick={() => hasNativeShare ? handleNativeShare() : setShowOptions(!showOptions)}
        className={`
          p-2 rounded-lg text-gray-400 hover:text-white
          hover:bg-gray-800 transition-all
          ${className}
        `}
        title="Share"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {showOptions && !hasNativeShare && (
        <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50">
          <button
            onClick={shareToTwitter}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
            Share on Twitter
          </button>
          <button
            onClick={shareToWarpcast}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Share on Warpcast
          </button>
        </div>
      )}
    </div>
  );
}

// Action Button (Floating action button style)
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function ActionButton({
  icon,
  label,
  variant = 'primary',
  position = 'bottom-right',
  className = '',
  ...props
}: ActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'right-4 bottom-4',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-4',
    'bottom-left': 'left-4 bottom-4',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
  };

  return (
    <button
      className={`
        fixed ${positionClasses[position]} z-50
        flex items-center gap-2 rounded-full
        ${label ? 'pl-4 pr-5 py-3' : 'p-4'}
        ${variantClasses[variant]}
        transition-all hover:scale-105
        ${className}
      `}
      {...props}
    >
      {icon}
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
}

// Reaction Button (like/heart style)
interface ReactionButtonProps {
  count: number;
  isActive: boolean;
  onClick: () => void;
  icon?: 'heart' | 'thumbsUp' | 'fire' | 'star';
  className?: string;
}

export function ReactionButton({
  count,
  isActive,
  onClick,
  icon = 'heart',
  className = '',
}: ReactionButtonProps) {
  const icons = {
    heart: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    thumbsUp: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
    fire: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    star: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full
        transition-all
        ${isActive
          ? 'bg-pink-500/20 text-pink-400'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
        }
        ${className}
      `}
    >
      {icons[icon]}
      {count > 0 && <span className="text-sm font-medium">{count}</span>}
    </button>
  );
}

export default {
  Button,
  ButtonGroup,
  ConnectButton,
  CopyButtonV2,
  ShareButton,
  ActionButton,
  ReactionButton,
};
