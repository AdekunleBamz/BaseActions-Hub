'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ============================================================================
// ABOUT PAGE - About BaseActions Hub
// ============================================================================

const TEAM_MEMBERS = [
  { name: 'Anonymous Builder', role: 'Founder & Developer', emoji: '👨‍💻', twitter: '#' },
];

const MILESTONES = [
  { date: 'Q1 2024', title: 'Genesis', description: 'BaseActions Hub concept born, initial development begins' },
  { date: 'Q2 2024', title: 'V1 Launch', description: 'First version deployed to Base mainnet with basic guestbook functionality' },
  { date: 'Q3 2024', title: 'V2 Upgrade', description: 'Major upgrade with badges, reactions, tips, and enhanced leaderboard' },
  { date: 'Q4 2024', title: 'Community Growth', description: 'Focus on community building, integrations, and partnerships' },
  { date: '2025', title: 'Future', description: 'Mobile app, cross-chain expansion, and more exciting features' },
];

const FEATURES = [
  { icon: '✍️', title: 'Sign Guestbooks', description: 'Leave your mark on any wallet\'s guestbook with a personal message' },
  { icon: '🏆', title: 'Earn Badges', description: 'Collect NFT badges for achievements and milestones' },
  { icon: '📊', title: 'Climb Leaderboard', description: 'Compete with others and climb the rankings' },
  { icon: '❤️', title: 'React & Engage', description: 'React to signatures with emojis and engage with the community' },
  { icon: '💰', title: 'Tip Signers', description: 'Show appreciation by tipping your favorite signatures with ETH' },
  { icon: '🔥', title: 'Build Streaks', description: 'Keep your signing streak alive for bonus rewards' },
];

const STATS = [
  { label: 'Total Signatures', value: '10,000+', icon: '✍️' },
  { label: 'Active Users', value: '2,500+', icon: '👥' },
  { label: 'Badges Minted', value: '5,000+', icon: '🏅' },
  { label: 'ETH Tipped', value: '2.5+', icon: '💎' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-5" />
        
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About BaseActions Hub
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            The premier Web3 guestbook platform on Base, where every signature is a lasting memory 
            and every interaction builds your onchain reputation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We're building the social fabric of Base by creating meaningful onchain connections. 
            BaseActions Hub transforms simple signatures into a gamified experience with badges, 
            leaderboards, and community engagement — making Web3 social and fun.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((stat) => (
            <div 
              key={stat.label}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div 
                key={feature.title}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Connect Wallet', description: 'Link your Web3 wallet to get started' },
              { step: '2', title: 'Find a Guestbook', description: 'Search for any wallet address' },
              { step: '3', title: 'Sign & Engage', description: 'Leave a message, react, or tip' },
              { step: '4', title: 'Earn Rewards', description: 'Get badges and climb the leaderboard' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Journey
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />
              
              {/* Milestones */}
              <div className="space-y-8">
                {MILESTONES.map((milestone, index) => (
                  <div key={milestone.date} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 ring-4 ring-white dark:ring-gray-900" />
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{milestone.date}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Built With
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Base', icon: '🔵' },
              { name: 'Solidity', icon: '📝' },
              { name: 'Next.js', icon: '⚡' },
              { name: 'React', icon: '⚛️' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'wagmi', icon: '🔌' },
              { name: 'viem', icon: '🔗' },
              { name: 'RainbowKit', icon: '🌈' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="px-6 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <span className="text-xl">{tech.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Start building your onchain reputation today. Sign your first guestbook and join the Base community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-white/90 transition-colors"
            >
              Start Signing
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
