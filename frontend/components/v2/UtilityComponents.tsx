'use client';

import React from 'react';

// ============================================================================
// UTILITY COMPONENTS V2
// ============================================================================

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  className?: string;
}

export function CopyToClipboard({ text, children, onCopy, className = '' }: CopyToClipboardProps) {
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
      className={`inline-flex items-center gap-2 transition-colors ${className}`}
    >
      {children || (
        <>
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
        </>
      )}
    </button>
  );
}

interface TruncatedAddressProps {
  address: string;
  start?: number;
  end?: number;
  showCopy?: boolean;
  className?: string;
}

export function TruncatedAddress({
  address,
  start = 6,
  end = 4,
  showCopy = true,
  className = '',
}: TruncatedAddressProps) {
  const truncated = address
    ? `${address.slice(0, start)}...${address.slice(-end)}`
    : '';

  return (
    <span className={`inline-flex items-center gap-2 font-mono ${className}`}>
      <span>{truncated}</span>
      {showCopy && <CopyToClipboard text={address} />}
    </span>
  );
}

interface ExplorerLinkProps {
  hash: string;
  type?: 'tx' | 'address' | 'token' | 'block';
  network?: 'base' | 'ethereum' | 'polygon';
  children?: React.ReactNode;
  className?: string;
}

export function ExplorerLink({
  hash,
  type = 'tx',
  network = 'base',
  children,
  className = '',
}: ExplorerLinkProps) {
  const explorers = {
    base: 'https://basescan.org',
    ethereum: 'https://etherscan.io',
    polygon: 'https://polygonscan.com',
  };

  const paths = {
    tx: 'tx',
    address: 'address',
    token: 'token',
    block: 'block',
  };

  const url = `${explorers[network]}/${paths[type]}/${hash}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ${className}`}
    >
      {children || 'View on Explorer'}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactElement;
  children: React.ReactNode;
}

export function ConditionalWrapper({ condition, wrapper, children }: ConditionalWrapperProps) {
  return condition ? wrapper(children) : <>{children}</>;
}

interface ShowProps {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Show({ when, fallback, children }: ShowProps) {
  if (!when) return <>{fallback}</>;
  return <>{children}</>;
}

interface ForProps<T> {
  each: T[];
  fallback?: React.ReactNode;
  children: (item: T, index: number) => React.ReactNode;
}

export function For<T>({ each, fallback, children }: ForProps<T>) {
  if (each.length === 0) return <>{fallback}</>;
  return <>{each.map((item, index) => children(item, index))}</>;
}

interface SwitchCase {
  value: string | number | boolean;
  children: React.ReactNode;
}

interface SwitchProps {
  value: string | number | boolean;
  children: React.ReactElement<SwitchCase>[];
  fallback?: React.ReactNode;
}

export function Switch({ value, children, fallback }: SwitchProps) {
  const matchedCase = React.Children.toArray(children).find(
    (child) => React.isValidElement<SwitchCase>(child) && child.props.value === value
  );

  return <>{matchedCase || fallback}</>;
}

export function Case({ children }: SwitchCase) {
  return <>{children}</>;
}

interface VisuallyHiddenProps {
  children: React.ReactNode;
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {children}
    </span>
  );
}

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export function Portal({ children, containerId = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    return () => {
      if (container && container.childNodes.length === 0) {
        container.remove();
      }
    };
  }, [containerId]);

  if (!mounted) return null;

  const container = document.getElementById(containerId);
  if (!container) return null;

  return require('react-dom').createPortal(children, container);
}

interface DeferProps {
  children: React.ReactNode;
  delay?: number;
}

export function Defer({ children, delay = 0 }: DeferProps) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;
  return <>{children}</>;
}

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

export function Countdown({ targetDate, onComplete, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className={`flex gap-4 ${className}`}>
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
            {formatNumber(item.value)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

interface RelativeTimeProps {
  date: Date | string | number;
  className?: string;
}

export function RelativeTime({ date, className = '' }: RelativeTimeProps) {
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`;
    if (months < 12) return `${months}mo ago`;
    return `${years}y ago`;
  };

  const dateObj = date instanceof Date ? date : new Date(date);

  return (
    <time dateTime={dateObj.toISOString()} className={className}>
      {getRelativeTime(dateObj)}
    </time>
  );
}

interface FormattedNumberProps {
  value: number;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
  className?: string;
}

export function FormattedNumber({
  value,
  style = 'decimal',
  currency = 'USD',
  minimumFractionDigits,
  maximumFractionDigits,
  compact = false,
  className = '',
}: FormattedNumberProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  }).format(value);

  return <span className={className}>{formatted}</span>;
}

interface EthAmountProps {
  wei: bigint | string | number;
  decimals?: number;
  showSymbol?: boolean;
  className?: string;
}

export function EthAmount({ wei, decimals = 6, showSymbol = true, className = '' }: EthAmountProps) {
  const weiValue = BigInt(wei);
  const ethValue = Number(weiValue) / 1e18;

  const formatted = ethValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`font-mono ${className}`}>
      {formatted}
      {showSymbol && <span className="ml-1 text-gray-500">ETH</span>}
    </span>
  );
}

interface PluralizePros {
  count: number;
  singular: string;
  plural?: string;
  showCount?: boolean;
  className?: string;
}

export function Pluralize({ count, singular, plural, showCount = true, className = '' }: PluralizePros) {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return (
    <span className={className}>
      {showCount && `${count} `}{word}
    </span>
  );
}

export default {
  CopyToClipboard,
  TruncatedAddress,
  ExplorerLink,
  ConditionalWrapper,
  Show,
  For,
  Switch,
  Case,
  VisuallyHidden,
  Portal,
  Defer,
  Countdown,
  RelativeTime,
  FormattedNumber,
  EthAmount,
  Pluralize,
};
