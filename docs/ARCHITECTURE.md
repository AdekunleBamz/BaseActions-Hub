# Architecture Overview

Technical architecture documentation for BaseActions Hub.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  Hooks         │  Providers │
│  - /            │  - UI            │  - Web3        │  - Theme   │
│  - /sign        │  - Feature       │  - Utility     │  - Toast   │
│  - /leaderboard │  - Layout        │  - Contract    │  - Modal   │
│  - /badges      │  - Web3          │  - Data        │  - Web3    │
│  - /profile     │                  │                │            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ wagmi / viem
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Smart Contracts (Solidity)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Guestbook   │  │   BadgeNFT   │  │ Leaderboard  │           │
│  │              │  │              │  │              │           │
│  │ - sign()     │  │ - mint()     │  │ - getTop()   │           │
│  │ - react()    │  │ - burn()     │  │ - getStats() │           │
│  │ - pin()      │  │ - tokenURI() │  │ - record()   │           │
│  │ - edit()     │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│           │                │                │                    │
│           └────────────────┼────────────────┘                    │
│                            ▼                                     │
│                   ┌──────────────────┐                           │
│                   │  BaseActionsHub  │                           │
│                   │                  │                           │
│                   │ - batchSign()    │                           │
│                   │ - tip()          │                           │
│                   │ - pause()        │                           │
│                   └──────────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Base Mainnet (Chain ID: 8453)                │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| wagmi | 3.1.4 | Web3 React hooks |
| viem | 2.43.5 | Ethereum library |
| RainbowKit | 2.2.10 | Wallet UI |
| TanStack Query | 5.x | Data fetching |

### Smart Contracts
| Technology | Version | Purpose |
|------------|---------|---------|
| Solidity | 0.8.20 | Contract language |
| OpenZeppelin | 5.x | Security patterns |
| Foundry | Latest | Testing framework |

### Blockchain
| Network | Chain ID | Purpose |
|---------|----------|---------|
| Base Mainnet | 8453 | Production |
| Base Goerli | 84531 | Testing |

## Directory Structure

```
baseactions-hub/
├── frontend/                 # Next.js frontend
│   ├── app/                  # App router pages
│   │   ├── page.tsx          # Homepage
│   │   ├── sign/             # Sign guestbook
│   │   ├── leaderboard/      # Rankings
│   │   ├── badges/           # Badge gallery
│   │   ├── profile/          # User profile
│   │   ├── activity/         # Activity feed
│   │   └── search/           # Search
│   ├── components/           # React components
│   │   ├── ui/               # Base UI components
│   │   └── [feature]/        # Feature components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── config/               # Configuration
│   ├── providers/            # Context providers
│   └── types/                # TypeScript types
├── contracts/                # Solidity contracts
│   ├── Guestbook.sol
│   ├── BadgeNFT.sol
│   ├── Leaderboard.sol
│   └── BaseActionsHub.sol
└── docs/                     # Documentation
```

## Data Flow

### Signing a Guestbook

```
User Action          Frontend              Contract           Blockchain
    │                   │                     │                   │
    │  Click Sign       │                     │                   │
    ├──────────────────►│                     │                   │
    │                   │  useGuestbookV2     │                   │
    │                   │  sign(message)      │                   │
    │                   ├────────────────────►│                   │
    │                   │                     │  signGuestbook()  │
    │                   │                     ├──────────────────►│
    │                   │                     │                   │
    │                   │                     │  emit Signed()    │
    │                   │                     │◄──────────────────┤
    │                   │  Transaction Hash   │                   │
    │                   │◄────────────────────┤                   │
    │  Show Success     │                     │                   │
    │◄──────────────────┤                     │                   │
```

## State Management

### Client State
- React useState for local UI state
- Context for global UI state (theme, toast, modal)

### Server State
- TanStack Query for contract data
- Automatic caching and refetching
- Optimistic updates for better UX

### Blockchain State
- wagmi hooks for wallet state
- viem for contract interactions
- Event listeners for real-time updates

## Security Considerations

### Frontend
- Input validation before contract calls
- XSS prevention with React
- CSRF protection
- Rate limiting awareness

### Smart Contracts
- ReentrancyGuard on payable functions
- Access control with Ownable
- Input validation
- Emergency pause functionality

## Performance Optimizations

- Next.js App Router for optimal loading
- React Server Components where possible
- Image optimization with next/image
- Code splitting by route
- Skeleton loading states
- Optimistic UI updates
