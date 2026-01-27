# BaseActions Hub API Reference

## Smart Contract Functions

### Guestbook Contract

**Address:** `0x19fE1aE089A46a1243f021447632eDF3AaF629C5`

#### Sign Guestbook
```solidity
function sign(address guestbook, string memory message) external payable
```
Signs a guestbook with a message.
- **Parameters:**
  - `guestbook`: The address of the guestbook owner
  - `message`: The signature message (max 500 characters)
- **Value:** 0.000001 ETH signing fee

#### Add Reaction
```solidity
function addReaction(uint256 signatureId, uint8 reactionType) external
```
Adds a reaction to a signature.
- **Reaction Types:**
  - 0: Like 👍
  - 1: Love ❤️
  - 2: Fire 🔥
  - 3: Laugh 😂
  - 4: Wow 😮
  - 5: Sad 😢

#### Pin Signature
```solidity
function pinSignature(uint256 signatureId) external
```
Pins a signature to the top of your guestbook.

#### Edit Signature
```solidity
function editSignature(uint256 signatureId, string memory newMessage) external
```
Edits an existing signature (owner only, within time limit).

### BadgeNFT Contract

**Address:** `0x08E314B704e4d9101773Ef1d4CC217d09487F2bd`

#### Mint Badge
```solidity
function mintBadge(address to, uint8 badgeType) external onlyOwner
```
Mints a badge NFT to a user.
- **Badge Types:**
  - 0: Pioneer (First 100 signers)
  - 1: Collector (10+ signatures)
  - 2: Super Signer (50+ signatures)
  - 3: Whale (100+ signatures)
  - 4: Streak Master (7-day streak)
  - 5: Tipper (Tipped 10+ times)
  - 6: Popular (100+ reactions received)
  - 7: Veteran (30-day active)
  - 8: Influencer (50+ referrals)
  - 9: Diamond Hands (Never sold)
  - 10: Community Leader (Top 10)
  - 11: Legendary (All badges)

#### Get User Badges
```solidity
function getUserBadges(address user) external view returns (uint256[] memory)
```
Returns all badge token IDs owned by a user.

### Leaderboard Contract

**Address:** `0xD1344d3049d04aE5D004E05F36bc91383511bD24`

#### Get Rankings
```solidity
function getTopRankers(uint256 count) external view returns (RankerInfo[] memory)
```
Returns the top N rankers on the leaderboard.

#### Get User Stats
```solidity
function getUserStats(address user) external view returns (UserStats memory)
```
Returns complete stats for a user.

#### Record Referral
```solidity
function recordReferral(address referrer, address referee) external
```
Records a referral relationship.

### BaseActionsHub Contract

**Address:** `0x45CAA41b1891AB31c1691bF015F8483FFB6fb0d8`

#### Batch Sign
```solidity
function batchSign(address[] memory guestbooks, string[] memory messages) external payable
```
Signs multiple guestbooks in one transaction.

#### Tip Signer
```solidity
function tipSigner(uint256 signatureId) external payable
```
Sends an ETH tip to a signature's author.

## Frontend Hooks

### useGuestbookV2
```typescript
const {
  signatures,
  loading,
  sign,
  addReaction,
  pinSignature,
  editSignature,
  tipSigner
} = useGuestbookV2(address);
```

### useLeaderboardV2
```typescript
const {
  rankings,
  userStats,
  loading,
  refresh
} = useLeaderboardV2();
```

### useBadgesV2
```typescript
const {
  badges,
  progress,
  loading,
  claimBadge
} = useBadgesV2(address);
```

## Events

### Guestbook Events
- `Signed(address indexed guestbook, address indexed signer, uint256 signatureId)`
- `ReactionAdded(uint256 indexed signatureId, address indexed reactor, uint8 reactionType)`
- `SignaturePinned(uint256 indexed signatureId)`
- `SignatureEdited(uint256 indexed signatureId, string newMessage)`

### Badge Events
- `BadgeMinted(address indexed to, uint256 tokenId, uint8 badgeType)`
- `BadgeUpgraded(uint256 indexed tokenId, uint8 newRarity)`

### Leaderboard Events
- `RankingUpdated(address indexed user, uint256 newRank)`
- `ReferralRecorded(address indexed referrer, address indexed referee)`

## Error Codes

| Code | Description |
|------|-------------|
| `InsufficientFee` | Signing fee not provided |
| `MessageTooLong` | Message exceeds 500 characters |
| `AlreadySigned` | User already signed this guestbook |
| `NotSignatureOwner` | Caller doesn't own the signature |
| `EditWindowClosed` | Edit time limit exceeded |
| `BadgeAlreadyMinted` | User already has this badge |
| `ContractPaused` | Hub is paused |
