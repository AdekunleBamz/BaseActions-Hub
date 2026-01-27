# Changelog

All notable changes to BaseActions Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-15

### Added

#### Smart Contracts
- **Guestbook V2**: Reactions, pinning, editing, and tipping features
- **BadgeNFT V2**: Rarity system with 5 tiers, soulbound option
- **Leaderboard V2**: Referral system, point multipliers, snapshots
- **BaseActionsHub V2**: Batch signing, protocol fees, emergency pause

#### Frontend - Pages
- Badges gallery page with filtering and progress tracking
- Search page with advanced filters and recent searches
- Profile page with stats, activity, badges, and settings tabs
- Activity feed page with real-time updates
- FAQ page with search and categories
- About page with mission and roadmap
- Getting Started onboarding page

#### Frontend - Components
- Transaction history component
- Share buttons for social platforms
- Enhanced header with mobile menu
- Comprehensive footer with links
- 50+ V2 UI components
- Animation components library
- Stats dashboard with charts

#### Frontend - Hooks
- `useGuestbookV2` - Signing, reactions, tips
- `useLeaderboardV2` - Rankings, user stats
- `useBadgesV2` - Badge tracking, progress
- `useContractActions` - Contract interactions
- `useContractData` - Data fetching
- 30+ utility hooks

#### Frontend - Styling
- Extended Tailwind utilities
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Dark mode support

### Changed
- Signing fee reduced from 0.0001 ETH to 0.000001 ETH
- Improved mobile responsiveness
- Enhanced accessibility features
- Better error handling and loading states

### Security
- ReentrancyGuard on all payable functions
- Input validation on all user inputs
- Emergency pause functionality
- OpenZeppelin security patterns

## [1.0.0] - 2024-12-01

### Added
- Initial release
- Basic guestbook signing
- Simple leaderboard
- Wallet connection
- Basic UI components

---

## Upgrade Guide

### From V1 to V2

1. **Update Dependencies**
   ```bash
   npm install
   ```

2. **Update Contract Addresses**
   - Use addresses from `config/contracts-v2.ts`

3. **Update Hooks**
   - Replace `useGuestbook` with `useGuestbookV2`
   - Replace `useLeaderboard` with `useLeaderboardV2`

4. **New Features**
   - Reactions are now available
   - Badge system is active
   - Referrals can be tracked

---

[2.0.0]: https://github.com/AdekunleBamz/BaseActions-Hub/releases/tag/v2.0.0
[1.0.0]: https://github.com/AdekunleBamz/BaseActions-Hub/releases/tag/v1.0.0
