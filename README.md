# BaseActions Hub

A decentralized guestbook and leaderboard dApp built on Base. Sign guestbooks, earn badges, climb the leaderboard, and interact with multiple smart contracts in a single transaction.

## Features

- 📝 **Guestbook** - Sign guestbooks with custom messages
- 🏆 **Leaderboard** - Track top signers and earn points
- 🎖️ **Badges** - Earn NFT badges for achievements
- ⚡ **Multi-Contract Actions** - One transaction interacts with 3+ contracts

## Live Demo

[https://base-actions-hub.vercel.app](https://base-actions-hub.vercel.app)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/AdekunleBamz/BaseActions-Hub.git
cd BaseActions-Hub
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Smart Contracts (Base Mainnet)

| Contract | Address |
|----------|---------|
| BaseActionsHub | `0x7de391745702d84C1e88ac80d19cfd748b3Fe5D1` |
| Guestbook | `0xca42701231170d21311897908b1Ba0BDA5003f8b` |
| BadgeNFT | `0x509d96ECd357b9D6bF2E4287172F3f777E587ca1` |
| Leaderboard | `0xF78Dc0c57153bC09810bA2aA174a261Cec2559eB` |

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: RainbowKit, wagmi
- **Farcaster**: Miniapp SDK integration

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AdekunleBamz/BaseActions-Hub)

## License

MIT
