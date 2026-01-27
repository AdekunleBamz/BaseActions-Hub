'use client';

import React from 'react';
import Link from 'next/link';

// ============================================================================
// GETTING STARTED PAGE - Onboarding Guide
// ============================================================================

const STEPS = [
  {
    number: 1,
    title: 'Connect Your Wallet',
    description: 'Click the "Connect Wallet" button in the top right corner. We support MetaMask, Rainbow, Coinbase Wallet, and any WalletConnect-compatible wallet.',
    image: '🔌',
    tips: [
      'Make sure you\'re on Base network (Chain ID: 8453)',
      'You\'ll need a small amount of ETH on Base for transactions',
      'First time on Base? You\'ll need to add it to your wallet'
    ]
  },
  {
    number: 2,
    title: 'Get ETH on Base',
    description: 'You need ETH on Base to pay for gas and signing fees. Bridge from Ethereum mainnet or buy directly through various options.',
    image: '💎',
    tips: [
      'Use the official Base Bridge at bridge.base.org',
      'Use Coinbase to withdraw directly to Base',
      'Third-party bridges like Hop, Across, or Stargate also work'
    ]
  },
  {
    number: 3,
    title: 'Find a Guestbook',
    description: 'Every wallet address has a guestbook. Search for any address, ENS name, or browse the leaderboard to find active guestbooks.',
    image: '🔍',
    tips: [
      'Try signing a popular builder\'s guestbook',
      'Check the leaderboard for top signers',
      'Share your guestbook link with friends'
    ]
  },
  {
    number: 4,
    title: 'Sign Your First Guestbook',
    description: 'Write a message (up to 280 characters) and confirm the transaction. Your signature is permanently recorded on Base.',
    image: '✍️',
    tips: [
      'The signing fee is only 0.000001 ETH',
      'Gas fees on Base are very cheap (<$0.01)',
      'Your first signature earns you a badge!'
    ]
  },
  {
    number: 5,
    title: 'React & Engage',
    description: 'Browse signatures and react with emojis. You can also tip signatures with ETH to show appreciation.',
    image: '❤️',
    tips: [
      'Reactions are onchain and earn you points',
      'Tips go 100% to the signer',
      'Engaging helps you climb the leaderboard'
    ]
  },
  {
    number: 6,
    title: 'Collect Badges',
    description: 'Earn NFT badges for achievements like signing streaks, receiving signatures, and reaching milestones.',
    image: '🏆',
    tips: [
      'Check your badge collection in your profile',
      'Rare badges require significant achievements',
      'Legendary OG badge for early adopters'
    ]
  }
];

const WALLETS = [
  { name: 'MetaMask', icon: '🦊', url: 'https://metamask.io', description: 'The most popular Web3 wallet' },
  { name: 'Rainbow', icon: '🌈', url: 'https://rainbow.me', description: 'Beautiful mobile-first wallet' },
  { name: 'Coinbase Wallet', icon: '💙', url: 'https://wallet.coinbase.com', description: 'Easy to use, by Coinbase' },
];

const BRIDGES = [
  { name: 'Base Bridge', url: 'https://bridge.base.org', description: 'Official bridge by Base' },
  { name: 'Hop Protocol', url: 'https://hop.exchange', description: 'Fast cross-chain bridge' },
  { name: 'Across Protocol', url: 'https://across.to', description: 'Quick and low-fee bridging' },
];

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <span className="text-5xl mb-4 block">🚀</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Getting Started
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your complete guide to joining BaseActions Hub and starting your onchain journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Steps */}
        <div className="space-y-12">
          {STEPS.map((step, index) => (
            <div 
              key={step.number}
              className="flex gap-6"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-0.5 h-16 bg-gradient-to-b from-blue-600/50 to-transparent mx-auto mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl flex-shrink-0">{step.image}</span>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {step.description}
                      </p>
                      
                      {/* Tips */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">💡 Tips</p>
                        <ul className="space-y-1">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wallets Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recommended Wallets
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {WALLETS.map((wallet) => (
              <a
                key={wallet.name}
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <span className="text-4xl mb-4 block">{wallet.icon}</span>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{wallet.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{wallet.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Bridges Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Bridge to Base
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {BRIDGES.map((bridge) => (
              <a
                key={bridge.name}
                href={bridge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🌉</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{bridge.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{bridge.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Add Base Network */}
        <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Add Base Network to Your Wallet
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Network Details:</p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>Network Name:</strong> Base</li>
                <li><strong>RPC URL:</strong> https://mainnet.base.org</li>
                <li><strong>Chain ID:</strong> 8453</li>
                <li><strong>Currency:</strong> ETH</li>
                <li><strong>Explorer:</strong> https://basescan.org</li>
              </ul>
            </div>
            <div className="flex items-end">
              <a
                href="https://chainlist.org/chain/8453"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Add Base via ChainList
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You're all set! Connect your wallet and sign your first guestbook.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Sign a Guestbook
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Explore Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
