# Deployment Guide

Complete guide for deploying BaseActions Hub to production.

## Prerequisites

- Node.js 20+
- npm or yarn
- Vercel account (recommended) or other hosting provider
- Base mainnet RPC endpoint

## Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env.local
```

2. Configure required variables:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_BASE_MAINNET_RPC=https://mainnet.base.org
```

## Vercel Deployment (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AdekunleBamz/BaseActions-Hub)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Environment Variables

Add these in Vercel dashboard:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect Cloud project ID |
| `NEXT_PUBLIC_BASE_MAINNET_RPC` | Base mainnet RPC URL |

## Self-Hosting

### Docker Deployment

1. Build the image:
```bash
docker build -t baseactions-hub .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id \
  baseactions-hub
```

### Manual Build

1. Install dependencies:
```bash
npm ci
```

2. Build the application:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## Contract Deployment

### V2 Contracts (Live on Base Mainnet)

| Contract | Address |
|----------|---------|
| Guestbook | `0x19fE1aE089A46a1243f021447632eDF3AaF629C5` |
| BadgeNFT | `0x08E314B704e4d9101773Ef1d4CC217d09487F2bd` |
| Leaderboard | `0xD1344d3049d04aE5D004E05F36bc91383511bD24` |
| BaseActionsHub | `0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8` |

### Deploying Your Own Contracts

1. Configure Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Deploy contracts:
```bash
forge create --rpc-url $BASE_RPC \
  --private-key $PRIVATE_KEY \
  contracts/Guestbook.sol:Guestbook
```

3. Verify contracts:
```bash
forge verify-contract \
  --chain-id 8453 \
  --compiler-version v0.8.20 \
  $CONTRACT_ADDRESS \
  contracts/Guestbook.sol:Guestbook
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test wallet connection
- [ ] Verify contract interactions work
- [ ] Check all pages load correctly
- [ ] Test on mobile devices
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

## Monitoring

### Vercel Analytics

Enable analytics in `vercel.json`:
```json
{
  "analytics": {
    "enabled": true
  }
}
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user analytics

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build
```

### Contract Connection Issues

1. Verify RPC endpoint is working
2. Check contract addresses in config
3. Ensure correct chain ID (8453)

### Performance Issues

1. Enable image optimization
2. Use CDN for static assets
3. Enable caching headers

---

For issues, open a [GitHub issue](https://github.com/AdekunleBamz/BaseActions-Hub/issues).
