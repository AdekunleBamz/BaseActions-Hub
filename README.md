# BaseActions Hub

<div align="center">

![Base](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A decentralized social platform for signing guestbooks, earning badges, and climbing leaderboards on Base**

[Live Demo](https://base-actions-hub.vercel.app) · [Documentation](./docs) · [Report Bug](./.github/ISSUE_TEMPLATE/bug_report.md) · [Request Feature](./.github/ISSUE_TEMPLATE/feature_request.md)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Guestbook** | Sign guestbooks with custom messages, reactions, and tips |
| 🏆 **Leaderboard** | Compete for top rankings with streaks and referral bonuses |
| 🎖️ **Badges** | Earn 12 unique NFT badges with 5 rarity tiers |
| ⚡ **Batch Actions** | Sign multiple guestbooks in a single transaction |
| 🔥 **Reactions** | Like, love, fire, laugh, wow, and sad reactions |
| 📌 **Pinning** | Highlight your favorite signatures |
| 💰 **Tipping** | Send ETH tips to your favorite signers |
| 🔗 **Referrals** | Earn bonus points for bringing new users |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm, yarn, or pnpm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/BaseActions-Hub.git
cd BaseActions-Hub/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Smart Contracts V2 (Base Mainnet)

| Contract | Address | Features |
|----------|---------|----------|
| Guestbook | [`0x19fE1aE089A46a1243f021447632eDF3AaF629C5`](https://basescan.org/address/0x19fE1aE089A46a1243f021447632eDF3AaF629C5) | Reactions, Pinning, Editing |
| BadgeNFT | [`0x08E314B704e4d9101773Ef1d4CC217d09487F2bd`](https://basescan.org/address/0x08E314B704e4d9101773Ef1d4CC217d09487F2bd) | Rarity System, Soulbound |
| Leaderboard | [`0xD1344d3049d04aE5D004E05F36bc91383511bD24`](https://basescan.org/address/0xD1344d3049d04aE5D004E05F36bc91383511bD24) | Referrals, Multipliers |
| BaseActionsHub | [`0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8`](https://basescan.org/address/0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8) | Batch Signing, Tipping |

**Sign Fee:** 0.000001 ETH

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Web3** | wagmi 3, viem 2, RainbowKit 2, TanStack Query 5 |
| **Contracts** | Solidity 0.8.20, OpenZeppelin 5 |
| **Blockchain** | Base Mainnet (Chain ID: 8453) |

## 📖 Documentation

- [API Reference](./API.md) - Contract functions and hooks
- [Architecture](./docs/ARCHITECTURE.md) - System overview
- [Components](./docs/COMPONENTS.md) - UI component library
- [Hooks](./docs/HOOKS.md) - Custom React hooks
- [Contracts](./CONTRACTS_V2.md) - Smart contract details
- [Changelog](./CHANGELOG.md) - Version history

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AdekunleBamz/BaseActions-Hub)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Base](https://base.org) - Ethereum L2 network
- [OpenZeppelin](https://openzeppelin.com) - Smart contract security
- [RainbowKit](https://rainbowkit.com) - Wallet connection UI
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

<div align="center">

**Built with 💙 on Base**

</div>
