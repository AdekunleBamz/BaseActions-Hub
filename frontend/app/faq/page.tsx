'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

// ============================================================================
// FAQ PAGE - Frequently Asked Questions
// ============================================================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  // Getting Started
  {
    id: '1',
    category: 'Getting Started',
    question: 'What is BaseActions Hub?',
    answer: 'BaseActions Hub is a Web3 guestbook platform built on Base, where users can sign each other\'s guestbooks, collect NFT badges, and climb the leaderboard. It\'s a fun way to connect with the Base community while building your onchain reputation.'
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'How do I get started?',
    answer: 'Simply connect your wallet (MetaMask, Rainbow, Coinbase Wallet, etc.), and you\'re ready to go! You can start by signing someone\'s guestbook or sharing your own guestbook link for others to sign.'
  },
  {
    id: '3',
    category: 'Getting Started',
    question: 'Do I need ETH on Base to use this?',
    answer: 'Yes, you need a small amount of ETH on Base to pay for gas fees when signing guestbooks. The signing fee is only 0.000001 ETH (about $0.003) plus gas. You can bridge ETH to Base using the official Base Bridge or third-party bridges.'
  },
  {
    id: '4',
    category: 'Getting Started',
    question: 'Which wallets are supported?',
    answer: 'We support all major wallets including MetaMask, Rainbow, Coinbase Wallet, WalletConnect-compatible wallets, and more. If your wallet supports Base network, it should work with BaseActions Hub.'
  },

  // Signing
  {
    id: '5',
    category: 'Signing',
    question: 'How much does it cost to sign a guestbook?',
    answer: 'Signing costs 0.000001 ETH (1 wei) plus gas fees. Gas on Base is extremely cheap, typically less than $0.01 per transaction.'
  },
  {
    id: '6',
    category: 'Signing',
    question: 'Can I edit or delete my signature?',
    answer: 'Yes! V2 introduces signature editing. You can update your message after signing. However, signatures cannot be completely deleted as they are permanently recorded on the blockchain.'
  },
  {
    id: '7',
    category: 'Signing',
    question: 'What happens when I sign someone\'s guestbook?',
    answer: 'When you sign, your message is permanently recorded on the Base blockchain. You earn points toward the leaderboard, and if you\'re a new signer, you might earn a badge! The guestbook owner also receives a notification.'
  },
  {
    id: '8',
    category: 'Signing',
    question: 'Is there a character limit for messages?',
    answer: 'Yes, signature messages are limited to 280 characters to keep them concise and readable, similar to a tweet.'
  },

  // Badges
  {
    id: '9',
    category: 'Badges',
    question: 'What are badges?',
    answer: 'Badges are NFTs that you earn for achievements on BaseActions Hub. They represent milestones like signing your first guestbook, reaching a signing streak, or climbing the leaderboard.'
  },
  {
    id: '10',
    category: 'Badges',
    question: 'Are badges transferable?',
    answer: 'Yes, badges are standard ERC-721 NFTs that you own in your wallet. You can transfer or sell them like any other NFT, though they are meant to represent your personal achievements.'
  },
  {
    id: '11',
    category: 'Badges',
    question: 'How do I earn rare badges?',
    answer: 'Rarer badges require more significant achievements. Epic badges might require 100+ signatures, while Legendary badges are reserved for top leaderboard positions or early adopters (OGs).'
  },

  // Leaderboard
  {
    id: '12',
    category: 'Leaderboard',
    question: 'How is the leaderboard calculated?',
    answer: 'Your leaderboard score is based on multiple factors: signatures given, signatures received, reactions, tips given/received, and streak bonuses. The exact formula ensures active and engaged community members rise to the top.'
  },
  {
    id: '13',
    category: 'Leaderboard',
    question: 'How often is the leaderboard updated?',
    answer: 'The leaderboard updates in real-time as transactions are confirmed on the blockchain. Your position changes immediately after any qualifying action.'
  },

  // Reactions & Tips
  {
    id: '14',
    category: 'Reactions & Tips',
    question: 'What are reactions?',
    answer: 'Reactions are emoji responses you can add to signatures, similar to liking a post. Available reactions include ❤️, 🔥, 👏, 🚀, and more. Each reaction is recorded onchain.'
  },
  {
    id: '15',
    category: 'Reactions & Tips',
    question: 'How do tips work?',
    answer: 'Tips allow you to send ETH directly to signature authors as appreciation. When you tip, 100% of the amount goes to the signer. Tips also boost both parties\' leaderboard scores.'
  },

  // Technical
  {
    id: '16',
    category: 'Technical',
    question: 'Is this open source?',
    answer: 'Yes! BaseActions Hub smart contracts are verified and open source. You can view the code on Basescan or our GitHub repository.'
  },
  {
    id: '17',
    category: 'Technical',
    question: 'What network is this on?',
    answer: 'BaseActions Hub runs on Base Mainnet, Coinbase\'s L2 network built on Optimism. Make sure your wallet is connected to Base (Chain ID: 8453) to use the platform.'
  },
  {
    id: '18',
    category: 'Technical',
    question: 'What are the contract addresses?',
    answer: 'Our V2 contracts are deployed at:\n• Guestbook: 0x19fE1aE089A46a1243f021447632eDF3AaF629C5\n• BadgeNFT: 0x08E314B704e4d9101773Ef1d4CC217d09487F2bd\n• Leaderboard: 0xD1344d3049d04aE5D004E05F36bc91383511bD24\n• Hub: 0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8'
  },
];

const CATEGORIES = [...new Set(FAQ_ITEMS.map(item => item.category))];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = FAQ_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about BaseActions Hub
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <FAQAccordion
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No questions found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            Can't find what you're looking for? Reach out to us on social media or join our community.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://twitter.com/baseactionshub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter / X
            </a>
            <a
              href="https://warpcast.com/baseactionshub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <span>🟣</span>
              Farcaster
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQAccordion({ 
  item, 
  isOpen, 
  onToggle 
}: { 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
            {item.category}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">{item.question}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
