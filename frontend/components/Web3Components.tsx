'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './DisplayComponents';
import { Button } from './ButtonComponents';

// Connection Status
interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  chainId?: number;
  expectedChainId?: number;
  onConnect?: () => void;
  onSwitchNetwork?: () => void;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  chainId,
  expectedChainId = 8453, // Base mainnet
  onConnect,
  onSwitchNetwork,
}: ConnectionStatusProps) {
  const isWrongNetwork = isConnected && chainId !== expectedChainId;

  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    8453: 'Base',
    84532: 'Base Sepolia',
  };

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800">
        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-gray-400 text-sm">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Button variant="primary" size="sm" onClick={onConnect}>
        Connect Wallet
      </Button>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={onSwitchNetwork}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-900/50 transition-colors"
      >
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="text-sm">Wrong Network</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/30 border border-green-500/30">
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-green-400 text-sm">
        {chainNames[chainId!] || `Chain ${chainId}`}
      </span>
    </div>
  );
}

// Transaction Button
interface TransactionButtonProps {
  label: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function TransactionButton({
  label,
  loadingLabel = 'Processing...',
  successLabel = 'Success!',
  errorLabel = 'Failed',
  onClick,
  disabled,
  className = '',
}: TransactionButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = async () => {
    if (status !== 'idle' || disabled) return;
    
    setStatus('loading');
    try {
      await onClick();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const statusConfig = {
    idle: {
      text: label,
      bg: 'bg-blue-600 hover:bg-blue-500',
      icon: null,
    },
    loading: {
      text: loadingLabel,
      bg: 'bg-blue-600',
      icon: (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ),
    },
    success: {
      text: successLabel,
      bg: 'bg-green-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      text: errorLabel,
      bg: 'bg-red-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={handleClick}
      disabled={status !== 'idle' || disabled}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all ${
        config.bg
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {config.icon}
      {config.text}
    </button>
  );
}

// Gas Estimator
interface GasEstimatorProps {
  gasEstimate?: bigint;
  gasPrice?: bigint;
  isLoading?: boolean;
}

export function GasEstimator({ gasEstimate, gasPrice, isLoading }: GasEstimatorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Estimating gas...
      </div>
    );
  }

  if (!gasEstimate || !gasPrice) {
    return null;
  }

  const totalCost = gasEstimate * gasPrice;
  const ethCost = Number(totalCost) / 1e18;
  const gasPriceGwei = Number(gasPrice) / 1e9;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-gray-400">Estimated Gas</span>
      </div>
      <div className="text-right">
        <p className="text-white font-medium">{ethCost.toFixed(6)} ETH</p>
        <p className="text-gray-500 text-xs">{gasPriceGwei.toFixed(1)} Gwei</p>
      </div>
    </div>
  );
}

// Wallet Balance
interface WalletBalanceProps {
  balance?: bigint;
  symbol?: string;
  decimals?: number;
  isLoading?: boolean;
}

export function WalletBalance({
  balance,
  symbol = 'ETH',
  decimals = 18,
  isLoading,
}: WalletBalanceProps) {
  if (isLoading) {
    return (
      <div className="h-8 w-24 rounded bg-gray-800 animate-pulse" />
    );
  }

  const formattedBalance = balance
    ? (Number(balance) / Math.pow(10, decimals)).toFixed(4)
    : '0.0000';

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-white">{formattedBalance}</span>
      <span className="text-gray-500">{symbol}</span>
    </div>
  );
}

// Transaction Card
interface TransactionCardProps {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  type: string;
  timestamp: Date;
  value?: string;
  explorerUrl?: string;
}

export function TransactionCard({
  hash,
  status,
  type,
  timestamp,
  value,
  explorerUrl,
}: TransactionCardProps) {
  const statusConfig = {
    pending: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/20',
      icon: (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      label: 'Pending',
    },
    success: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: 'Success',
    },
    failed: {
      color: 'text-red-400',
      bg: 'bg-red-900/20',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      label: 'Failed',
    },
  };

  const config = statusConfig[status];
  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  return (
    <Card className={`${config.bg} border-l-4 ${config.color.replace('text-', 'border-')}`}>
      <div className="flex items-center gap-4">
        <div className={config.color}>{config.icon}</div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">{type}</p>
          <p className="text-sm text-gray-500 font-mono truncate">{shortHash}</p>
        </div>

        <div className="text-right">
          {value && <p className="font-medium text-white">{value}</p>}
          <p className="text-sm text-gray-500">
            {timestamp.toLocaleTimeString()}
          </p>
        </div>

        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </Card>
  );
}

// Token Selector
interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo?: string;
  balance?: bigint;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken?: Token;
  onSelect: (token: Token) => void;
}

export function TokenSelector({ tokens, selectedToken, onSelect }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {selectedToken?.logo && (
          <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
        )}
        <span className="font-medium text-white">{selectedToken?.symbol || 'Select'}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-xl bg-gray-900 border border-gray-800 shadow-xl z-50">
            {tokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect(token);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {token.logo && (
                  <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
                )}
                <div className="flex-1 text-left">
                  <p className="font-medium text-white">{token.symbol}</p>
                  <p className="text-sm text-gray-500">{token.name}</p>
                </div>
                {token.balance && (
                  <p className="text-sm text-gray-400">
                    {(Number(token.balance) / Math.pow(10, token.decimals)).toFixed(4)}
                  </p>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Network Selector
interface Network {
  chainId: number;
  name: string;
  icon?: string;
  rpcUrl?: string;
}

interface NetworkSelectorProps {
  networks: Network[];
  currentChainId?: number;
  onSwitch: (chainId: number) => void;
}

export function NetworkSelector({ networks, currentChainId, onSwitch }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentNetwork = networks.find((n) => n.chainId === currentChainId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {currentNetwork?.icon && (
          <img src={currentNetwork.icon} alt={currentNetwork.name} className="w-5 h-5 rounded-full" />
        )}
        <span className="font-medium text-white">{currentNetwork?.name || 'Select Network'}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 p-2 rounded-xl bg-gray-900 border border-gray-800 shadow-xl z-50">
            {networks.map((network) => (
              <button
                key={network.chainId}
                onClick={() => {
                  onSwitch(network.chainId);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  network.chainId === currentChainId
                    ? 'bg-blue-900/30 border border-blue-500/30'
                    : 'hover:bg-gray-800'
                }`}
              >
                {network.icon && (
                  <img src={network.icon} alt={network.name} className="w-6 h-6 rounded-full" />
                )}
                <span className="font-medium text-white">{network.name}</span>
                {network.chainId === currentChainId && (
                  <svg className="w-4 h-4 text-blue-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Signature Request
interface SignatureRequestProps {
  message: string;
  onSign: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SignatureRequest({
  message,
  onSign,
  onCancel,
  isLoading,
}: SignatureRequestProps) {
  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Signature Request</h3>
        <p className="text-gray-400 text-sm">Please sign the following message with your wallet</p>
      </div>

      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 mb-6">
        <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-all">
          {message}
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" className="flex-1" onClick={onSign} disabled={isLoading}>
          {isLoading ? 'Signing...' : 'Sign Message'}
        </Button>
      </div>
    </Card>
  );
}

export default {
  ConnectionStatus,
  TransactionButton,
  GasEstimator,
  WalletBalance,
  TransactionCard,
  TokenSelector,
  NetworkSelector,
  SignatureRequest,
};
