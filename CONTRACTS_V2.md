# BaseActions Hub V2 Smart Contracts

## Overview

V2 contracts deployed on Base Mainnet with enhanced features for social interactions, badges, and leaderboards.

## Contract Addresses (Base Mainnet)

| Contract | Address | Features |
|----------|---------|----------|
| Guestbook | `0x19fE1aE089A46a1243f021447632eDF3AaF629C5` | Reactions, Pinning, Editing |
| BadgeNFT | `0x08E314B704e4d9101773Ef1d4CC217d09487F2bd` | Rarity System, Soulbound |
| Leaderboard | `0xD1344d3049d04aE5D004E05F36bc91383511bD24` | Referrals, Multipliers |
| BaseActionsHub | `0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8` | Batch Signing, Tipping |

## Sign Fee

- **Amount:** 0.000001 ETH (1000000000000 wei)
- **Purpose:** Anti-spam and platform sustainability

## Guestbook V2 Features

- ✅ **Reactions:** Like, Love, Fire, Laugh, Wow, Sad
- ✅ **Pinning:** Highlight important signatures
- ✅ **Editing:** Modify messages within time limit
- ✅ **Tipping:** Send ETH tips to signers

## BadgeNFT V2 Features

- ✅ **Rarity Tiers:** Common, Uncommon, Rare, Epic, Legendary
- ✅ **Soulbound Option:** Non-transferable badges
- ✅ **Dynamic Metadata:** On-chain SVG rendering
- ✅ **12 Badge Types:** Pioneer, Collector, Super Signer, etc.

## Leaderboard V2 Features

- ✅ **Referral System:** Track and reward referrals
- ✅ **Point Multipliers:** Streak bonuses
- ✅ **Snapshots:** Historical rankings
- ✅ **Category Rankings:** By signature count, badges, tips

## Hub V2 Features

- ✅ **Batch Signing:** Sign multiple guestbooks in one tx
- ✅ **Protocol Fees:** Sustainable fee collection
- ✅ **Emergency Pause:** Admin safety feature

## Explorer Links

- [Guestbook on BaseScan](https://basescan.org/address/0x19fE1aE089A46a1243f021447632eDF3AaF629C5)
- [BadgeNFT on BaseScan](https://basescan.org/address/0x08E314B704e4d9101773Ef1d4CC217d09487F2bd)
- [Leaderboard on BaseScan](https://basescan.org/address/0xD1344d3049d04aE5D004E05F36bc91383511bD24)
- [Hub on BaseScan](https://basescan.org/address/0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8)

## Security

- All contracts verified on BaseScan
- OpenZeppelin security patterns
- ReentrancyGuard protection
- Ownable access control
