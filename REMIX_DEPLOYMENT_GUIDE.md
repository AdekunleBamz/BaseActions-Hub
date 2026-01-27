# 🛠️ Remix Deployment Guide - BaseActions Hub V2

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Contract Deployment Order](#contract-deployment-order)
4. [Step-by-Step Instructions](#step-by-step-instructions)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Overview

You will deploy **4 contracts** in a specific order because they depend on each other:

```
1. Guestbook.sol     → Independent (deploy first)
2. BadgeNFT.sol      → Independent (deploy second)  
3. Leaderboard.sol   → Independent (deploy third)
4. BaseActionsHub.sol → Depends on 1, 2, 3 (deploy last)
```

After deployment, you'll configure cross-contract permissions.

---

## Prerequisites

### 1. MetaMask Setup
- Install MetaMask browser extension
- Add Base network:
  
  **Base Mainnet:**
  - Network Name: `Base`
  - RPC URL: `https://mainnet.base.org`
  - Chain ID: `8453`
  - Currency: `ETH`
  - Explorer: `https://basescan.org`

  **Base Sepolia (Testnet):**
  - Network Name: `Base Sepolia`
  - RPC URL: `https://sepolia.base.org`
  - Chain ID: `84532`
  - Currency: `ETH`
  - Explorer: `https://sepolia.basescan.org`

### 2. Get ETH for Gas
- **Testnet**: Use [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- **Mainnet**: Bridge ETH from Ethereum via [Base Bridge](https://bridge.base.org)

### 3. Remix IDE
- Open [Remix IDE](https://remix.ethereum.org)
- Set Solidity compiler to version `0.8.20` or higher

---

## Contract Deployment Order

Deploy contracts based on which commit you're implementing:

| Phase | Commits | Contracts to Deploy |
|-------|---------|---------------------|
| Initial | 1-4 | Guestbook.sol |
| Badge Upgrades | 5-7 | BadgeNFT.sol |
| Leaderboard | 8-10 | Leaderboard.sol |
| Hub Upgrades | 11-15 | BaseActionsHub.sol |

**For a full fresh deployment, deploy all 4 in order.**

---

## Step-by-Step Instructions

### STEP 1: Deploy Guestbook.sol

#### 1.1 Create the Contract
In Remix, create a new file `contracts/Guestbook.sol` and paste:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Guestbook V2
 * @notice On-chain guestbook with reactions and pinned signatures
 */
contract Guestbook is Ownable, ReentrancyGuard {
    struct Signature {
        address signer;
        string message;
        uint256 timestamp;
        uint256 reactions;      // NEW: reaction count
        bool isPinned;          // NEW: pinned status
        uint256 editedAt;       // NEW: last edit time (0 if never edited)
    }

    // Guestbook owner => array of signatures
    mapping(address => Signature[]) public guestbooks;
    
    // Guestbook owner => signature index => user => has reacted
    mapping(address => mapping(uint256 => mapping(address => bool))) public hasReacted;
    
    // Total signatures per guestbook
    mapping(address => uint256) public signatureCount;
    
    // Pinned signature index per guestbook (-1 if none)
    mapping(address => int256) public pinnedSignature;
    
    // Total signatures globally
    uint256 public totalSignatures;
    
    // Edit time window (5 minutes)
    uint256 public constant EDIT_WINDOW = 5 minutes;

    // Authorized signers (Hub contract)
    mapping(address => bool) public authorizedSigners;

    event Signed(
        address indexed guestbookOwner,
        address indexed signer,
        string message,
        uint256 indexed signatureIndex,
        uint256 timestamp
    );
    
    event SignatureEdited(
        address indexed guestbookOwner,
        uint256 indexed signatureIndex,
        string newMessage,
        uint256 timestamp
    );
    
    event Reacted(
        address indexed guestbookOwner,
        uint256 indexed signatureIndex,
        address indexed reactor,
        uint256 newReactionCount
    );
    
    event SignaturePinned(
        address indexed guestbookOwner,
        uint256 indexed signatureIndex
    );
    
    event SignatureUnpinned(
        address indexed guestbookOwner,
        uint256 indexed signatureIndex
    );

    modifier onlyAuthorized() {
        require(authorizedSigners[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Initialize pinned signatures to -1 (none)
    }

    /**
     * @notice Set authorized signer (Hub contract)
     */
    function setAuthorizedSigner(address signer, bool authorized) external onlyOwner {
        authorizedSigners[signer] = authorized;
    }

    /**
     * @notice Sign a guestbook (called by Hub)
     */
    function sign(
        address guestbookOwner,
        address signer,
        string calldata message
    ) external onlyAuthorized nonReentrant {
        require(bytes(message).length > 0, "Message required");
        require(bytes(message).length <= 280, "Message too long");

        uint256 index = guestbooks[guestbookOwner].length;
        
        guestbooks[guestbookOwner].push(Signature({
            signer: signer,
            message: message,
            timestamp: block.timestamp,
            reactions: 0,
            isPinned: false,
            editedAt: 0
        }));

        signatureCount[guestbookOwner]++;
        totalSignatures++;

        emit Signed(guestbookOwner, signer, message, index, block.timestamp);
    }

    /**
     * @notice Edit a signature within the edit window
     */
    function editSignature(
        address guestbookOwner,
        uint256 signatureIndex,
        string calldata newMessage
    ) external nonReentrant {
        require(signatureIndex < guestbooks[guestbookOwner].length, "Invalid index");
        
        Signature storage sig = guestbooks[guestbookOwner][signatureIndex];
        require(sig.signer == msg.sender, "Not your signature");
        require(block.timestamp <= sig.timestamp + EDIT_WINDOW, "Edit window closed");
        require(bytes(newMessage).length > 0, "Message required");
        require(bytes(newMessage).length <= 280, "Message too long");

        sig.message = newMessage;
        sig.editedAt = block.timestamp;

        emit SignatureEdited(guestbookOwner, signatureIndex, newMessage, block.timestamp);
    }

    /**
     * @notice React to a signature (like/heart)
     */
    function react(
        address guestbookOwner,
        uint256 signatureIndex
    ) external nonReentrant {
        require(signatureIndex < guestbooks[guestbookOwner].length, "Invalid index");
        require(!hasReacted[guestbookOwner][signatureIndex][msg.sender], "Already reacted");

        hasReacted[guestbookOwner][signatureIndex][msg.sender] = true;
        guestbooks[guestbookOwner][signatureIndex].reactions++;

        emit Reacted(
            guestbookOwner,
            signatureIndex,
            msg.sender,
            guestbooks[guestbookOwner][signatureIndex].reactions
        );
    }

    /**
     * @notice Remove reaction from a signature
     */
    function unreact(
        address guestbookOwner,
        uint256 signatureIndex
    ) external nonReentrant {
        require(signatureIndex < guestbooks[guestbookOwner].length, "Invalid index");
        require(hasReacted[guestbookOwner][signatureIndex][msg.sender], "Not reacted");

        hasReacted[guestbookOwner][signatureIndex][msg.sender] = false;
        guestbooks[guestbookOwner][signatureIndex].reactions--;
    }

    /**
     * @notice Pin a signature to top (only guestbook owner)
     */
    function pinSignature(uint256 signatureIndex) external {
        require(signatureIndex < guestbooks[msg.sender].length, "Invalid index");
        
        // Unpin previous if exists
        int256 currentPinned = pinnedSignature[msg.sender];
        if (currentPinned >= 0) {
            guestbooks[msg.sender][uint256(currentPinned)].isPinned = false;
            emit SignatureUnpinned(msg.sender, uint256(currentPinned));
        }
        
        guestbooks[msg.sender][signatureIndex].isPinned = true;
        pinnedSignature[msg.sender] = int256(signatureIndex);
        
        emit SignaturePinned(msg.sender, signatureIndex);
    }

    /**
     * @notice Unpin current pinned signature
     */
    function unpinSignature() external {
        int256 currentPinned = pinnedSignature[msg.sender];
        require(currentPinned >= 0, "No pinned signature");
        
        guestbooks[msg.sender][uint256(currentPinned)].isPinned = false;
        pinnedSignature[msg.sender] = -1;
        
        emit SignatureUnpinned(msg.sender, uint256(currentPinned));
    }

    /**
     * @notice Get signatures with pagination
     */
    function getSignatures(
        address guestbookOwner,
        uint256 offset,
        uint256 limit
    ) external view returns (Signature[] memory) {
        uint256 total = signatureCount[guestbookOwner];
        if (offset >= total) {
            return new Signature[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        Signature[] memory result = new Signature[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = guestbooks[guestbookOwner][i];
        }

        return result;
    }

    /**
     * @notice Get single signature by index
     */
    function getSignature(
        address guestbookOwner,
        uint256 index
    ) external view returns (Signature memory) {
        require(index < guestbooks[guestbookOwner].length, "Invalid index");
        return guestbooks[guestbookOwner][index];
    }

    /**
     * @notice Get pinned signature for a guestbook
     */
    function getPinnedSignature(
        address guestbookOwner
    ) external view returns (Signature memory, bool exists) {
        int256 pinned = pinnedSignature[guestbookOwner];
        if (pinned < 0) {
            return (Signature(address(0), "", 0, 0, false, 0), false);
        }
        return (guestbooks[guestbookOwner][uint256(pinned)], true);
    }
}
```

#### 1.2 Compile
1. Go to "Solidity Compiler" tab (left sidebar)
2. Select compiler version `0.8.20`
3. Click "Compile Guestbook.sol"

#### 1.3 Deploy
1. Go to "Deploy & Run Transactions" tab
2. Environment: "Injected Provider - MetaMask"
3. Confirm MetaMask is on Base network
4. Contract: "Guestbook"
5. Click "Deploy"
6. Confirm the transaction in MetaMask

#### 1.4 Save Address
📝 **Copy and save the deployed contract address!**
```
GUESTBOOK_ADDRESS = 0x...
```

---

### STEP 2: Deploy BadgeNFT.sol

#### 2.1 Create the Contract
Create `contracts/BadgeNFT.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BadgeNFT V2
 * @notice NFT badges with rarity levels and soulbound option
 */
contract BadgeNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    // Badge types with rarity
    enum BadgeType { 
        SIGNER,       // Common - First signature
        SUPPORTER,    // Common - Received 10 signatures
        STREAK_3,     // Uncommon - 3 day streak
        STREAK_7,     // Rare - 7 day streak
        STREAK_30,    // Epic - 30 day streak
        EARLY_ADOPTER,// Legendary - First 1000 users
        TOP_10,       // Legendary - Leaderboard top 10
        WHALE,        // Epic - Signed 100+ guestbooks
        COLLECTOR,    // Rare - Collected 5+ badges
        INFLUENCER    // Epic - Guestbook has 50+ signatures
    }

    enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }

    struct Badge {
        BadgeType badgeType;
        Rarity rarity;
        address recipient;
        uint256 timestamp;
        string customMetadata;
    }

    // Token ID => Badge data
    mapping(uint256 => Badge) public badges;
    
    // User => BadgeType => has badge
    mapping(address => mapping(BadgeType => bool)) public hasBadge;
    
    // User => BadgeType => token ID
    mapping(address => mapping(BadgeType => uint256)) public userBadgeTokenId;
    
    // User => total badges
    mapping(address => uint256) public userBadgeCount;
    
    // BadgeType => total minted
    mapping(BadgeType => uint256) public badgeTypeMintCount;

    // Authorized minters (Hub contract)
    mapping(address => bool) public minters;
    
    // Soulbound setting (non-transferable)
    bool public soulbound = false;

    string private _baseTokenURI;

    // Rarity mappings
    mapping(BadgeType => Rarity) public badgeRarity;

    event BadgeMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        BadgeType badgeType,
        Rarity rarity
    );
    
    event SoulboundUpdated(bool enabled);

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC721("BaseActions Badge", "BADGE") Ownable(msg.sender) {
        _baseTokenURI = "https://baseactions.vercel.app/api/badge/";
        
        // Set rarity levels
        badgeRarity[BadgeType.SIGNER] = Rarity.COMMON;
        badgeRarity[BadgeType.SUPPORTER] = Rarity.COMMON;
        badgeRarity[BadgeType.STREAK_3] = Rarity.UNCOMMON;
        badgeRarity[BadgeType.STREAK_7] = Rarity.RARE;
        badgeRarity[BadgeType.STREAK_30] = Rarity.EPIC;
        badgeRarity[BadgeType.EARLY_ADOPTER] = Rarity.LEGENDARY;
        badgeRarity[BadgeType.TOP_10] = Rarity.LEGENDARY;
        badgeRarity[BadgeType.WHALE] = Rarity.EPIC;
        badgeRarity[BadgeType.COLLECTOR] = Rarity.RARE;
        badgeRarity[BadgeType.INFLUENCER] = Rarity.EPIC;
    }

    /**
     * @notice Set minter authorization
     */
    function setMinter(address minter, bool authorized) external onlyOwner {
        minters[minter] = authorized;
    }

    /**
     * @notice Set soulbound mode
     */
    function setSoulbound(bool _soulbound) external onlyOwner {
        soulbound = _soulbound;
        emit SoulboundUpdated(_soulbound);
    }

    /**
     * @notice Mint a badge (called by Hub)
     */
    function mintBadge(
        address recipient,
        BadgeType badgeType
    ) external onlyMinter returns (uint256) {
        // Don't mint duplicate badges
        if (hasBadge[recipient][badgeType]) {
            return userBadgeTokenId[recipient][badgeType];
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(recipient, tokenId);

        badges[tokenId] = Badge({
            badgeType: badgeType,
            rarity: badgeRarity[badgeType],
            recipient: recipient,
            timestamp: block.timestamp,
            customMetadata: ""
        });

        hasBadge[recipient][badgeType] = true;
        userBadgeTokenId[recipient][badgeType] = tokenId;
        userBadgeCount[recipient]++;
        badgeTypeMintCount[badgeType]++;

        emit BadgeMinted(recipient, tokenId, badgeType, badgeRarity[badgeType]);

        // Check for collector badge
        if (userBadgeCount[recipient] >= 5 && !hasBadge[recipient][BadgeType.COLLECTOR]) {
            _mintInternal(recipient, BadgeType.COLLECTOR);
        }

        return tokenId;
    }

    /**
     * @notice Internal mint without collector check (prevents recursion)
     */
    function _mintInternal(address recipient, BadgeType badgeType) internal returns (uint256) {
        if (hasBadge[recipient][badgeType]) {
            return userBadgeTokenId[recipient][badgeType];
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(recipient, tokenId);

        badges[tokenId] = Badge({
            badgeType: badgeType,
            rarity: badgeRarity[badgeType],
            recipient: recipient,
            timestamp: block.timestamp,
            customMetadata: ""
        });

        hasBadge[recipient][badgeType] = true;
        userBadgeTokenId[recipient][badgeType] = tokenId;
        userBadgeCount[recipient]++;
        badgeTypeMintCount[badgeType]++;

        emit BadgeMinted(recipient, tokenId, badgeType, badgeRarity[badgeType]);

        return tokenId;
    }

    /**
     * @notice Get all badges for a user
     */
    function getUserBadges(address user) external view returns (Badge[] memory) {
        uint256 count = userBadgeCount[user];
        Badge[] memory userBadges = new Badge[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < 10; i++) { // 10 badge types
            BadgeType bt = BadgeType(i);
            if (hasBadge[user][bt]) {
                uint256 tokenId = userBadgeTokenId[user][bt];
                userBadges[index] = badges[tokenId];
                index++;
            }
        }
        
        return userBadges;
    }

    /**
     * @notice Get badge rarity
     */
    function getRarity(BadgeType badgeType) external view returns (Rarity) {
        return badgeRarity[badgeType];
    }

    /**
     * @notice Override transfer to support soulbound
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        if (soulbound && from != address(0) && to != address(0)) {
            revert("Badge is soulbound");
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Set base URI for metadata
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        Badge memory badge = badges[tokenId];
        return string(abi.encodePacked(
            _baseTokenURI,
            uint256(badge.badgeType).toString(),
            "/",
            tokenId.toString()
        ));
    }

    function totalSupply() public view override(ERC721Enumerable) returns (uint256) {
        return _tokenIdCounter;
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

#### 2.2 Compile and Deploy
1. Compile with Solidity 0.8.20
2. Deploy (no constructor arguments)
3. Confirm transaction

#### 2.3 Save Address
📝 **Copy and save the deployed contract address!**
```
BADGENFT_ADDRESS = 0x...
```

---

### STEP 3: Deploy Leaderboard.sol

#### 3.1 Create the Contract
Create `contracts/Leaderboard.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Leaderboard V2
 * @notice Tracks user points, rankings, and referrals
 */
contract Leaderboard is Ownable, ReentrancyGuard {
    struct UserStats {
        uint256 totalPoints;
        uint256 actionsCount;
        uint256 signaturesGiven;
        uint256 signaturesReceived;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastActionTime;
        uint256 lastActionDay;     // NEW: day number for streak tracking
        uint256 referralPoints;    // NEW: points from referrals
        uint256 referralCount;     // NEW: number of referrals
        address referrer;          // NEW: who referred this user
    }

    // User => Stats
    mapping(address => UserStats) public userStats;
    
    // Weekly snapshots: week number => user => points
    mapping(uint256 => mapping(address => uint256)) public weeklyPoints;
    
    // Monthly snapshots: month number => user => points
    mapping(uint256 => mapping(address => uint256)) public monthlyPoints;
    
    // Total users
    uint256 public totalUsers;
    
    // Authorized updaters (Hub contract)
    mapping(address => bool) public updaters;
    
    // Activity multiplier for special events (100 = 1x, 200 = 2x)
    uint256 public activityMultiplier = 100;
    
    // Multiplier end time
    uint256 public multiplierEndTime;

    // Points per action type
    uint256 public constant SIGN_POINTS = 10;
    uint256 public constant RECEIVE_SIGN_POINTS = 5;
    uint256 public constant STREAK_BONUS = 2;
    uint256 public constant REFERRAL_BONUS = 20;
    uint256 public constant REFERRER_BONUS = 10;

    event PointsEarned(address indexed user, uint256 points, string reason);
    event StatsUpdated(address indexed user, uint256 totalPoints, uint256 streak);
    event ReferralRecorded(address indexed referrer, address indexed referee);
    event MultiplierUpdated(uint256 multiplier, uint256 endTime);
    event WeeklySnapshot(uint256 indexed weekNumber, uint256 timestamp);
    event MonthlySnapshot(uint256 indexed monthNumber, uint256 timestamp);

    modifier onlyUpdater() {
        require(updaters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Set updater authorization
     */
    function setUpdater(address updater, bool authorized) external onlyOwner {
        updaters[updater] = authorized;
    }

    /**
     * @notice Set activity multiplier for special events
     */
    function setMultiplier(uint256 _multiplier, uint256 duration) external onlyOwner {
        require(_multiplier >= 100 && _multiplier <= 500, "Multiplier 100-500");
        activityMultiplier = _multiplier;
        multiplierEndTime = block.timestamp + duration;
        emit MultiplierUpdated(_multiplier, multiplierEndTime);
    }

    /**
     * @notice Get current multiplier (returns to 100 after end time)
     */
    function getCurrentMultiplier() public view returns (uint256) {
        if (block.timestamp > multiplierEndTime) {
            return 100;
        }
        return activityMultiplier;
    }

    /**
     * @notice Apply multiplier to points
     */
    function applyMultiplier(uint256 points) internal view returns (uint256) {
        return (points * getCurrentMultiplier()) / 100;
    }

    /**
     * @notice Record a referral
     */
    function recordReferral(
        address referee,
        address referrer
    ) external onlyUpdater {
        require(referee != referrer, "Cannot refer self");
        require(userStats[referee].referrer == address(0), "Already referred");
        require(userStats[referee].actionsCount == 0, "Already active user");
        
        userStats[referee].referrer = referrer;
        userStats[referrer].referralCount++;
        
        // Award referral bonuses
        uint256 referrerPoints = applyMultiplier(REFERRER_BONUS);
        uint256 refereePoints = applyMultiplier(REFERRAL_BONUS);
        
        userStats[referrer].referralPoints += referrerPoints;
        userStats[referrer].totalPoints += referrerPoints;
        
        userStats[referee].referralPoints += refereePoints;
        userStats[referee].totalPoints += refereePoints;
        
        emit ReferralRecorded(referrer, referee);
        emit PointsEarned(referrer, referrerPoints, "Referral bonus");
        emit PointsEarned(referee, refereePoints, "Welcome bonus");
    }

    /**
     * @notice Record a guestbook signature (called by Hub)
     */
    function recordSignature(
        address signer,
        address guestbookOwner
    ) external onlyUpdater nonReentrant {
        // Initialize new user
        if (userStats[signer].lastActionTime == 0) {
            totalUsers++;
        }

        // Calculate points with multiplier
        uint256 signPoints = applyMultiplier(SIGN_POINTS);

        // Update signer stats
        userStats[signer].actionsCount++;
        userStats[signer].signaturesGiven++;
        userStats[signer].totalPoints += signPoints;
        
        // Update periodic snapshots
        _updateSnapshots(signer, signPoints);
        
        // Check and update streak
        _updateStreak(signer);

        emit PointsEarned(signer, signPoints, "Signed guestbook");

        // Update guestbook owner stats
        if (guestbookOwner != signer) {
            if (userStats[guestbookOwner].lastActionTime == 0) {
                totalUsers++;
            }
            
            uint256 receivePoints = applyMultiplier(RECEIVE_SIGN_POINTS);
            userStats[guestbookOwner].signaturesReceived++;
            userStats[guestbookOwner].totalPoints += receivePoints;
            
            _updateSnapshots(guestbookOwner, receivePoints);
            
            emit PointsEarned(guestbookOwner, receivePoints, "Received signature");
        }
    }

    /**
     * @notice Update weekly/monthly snapshots
     */
    function _updateSnapshots(address user, uint256 points) internal {
        uint256 currentWeek = block.timestamp / 1 weeks;
        uint256 currentMonth = block.timestamp / 30 days;
        
        weeklyPoints[currentWeek][user] += points;
        monthlyPoints[currentMonth][user] += points;
    }

    /**
     * @notice Update user streak
     */
    function _updateStreak(address user) internal {
        UserStats storage stats = userStats[user];
        
        uint256 currentDay = block.timestamp / 1 days;
        uint256 lastDay = stats.lastActionDay;
        
        if (lastDay == 0) {
            // First action
            stats.currentStreak = 1;
        } else if (currentDay == lastDay) {
            // Same day, no change
        } else if (currentDay == lastDay + 1) {
            // Consecutive day
            stats.currentStreak++;
            uint256 streakBonus = applyMultiplier(STREAK_BONUS * stats.currentStreak);
            stats.totalPoints += streakBonus;
            emit PointsEarned(user, streakBonus, "Streak bonus");
        } else {
            // Streak broken
            stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }

        stats.lastActionDay = currentDay;
        stats.lastActionTime = block.timestamp;

        emit StatsUpdated(user, stats.totalPoints, stats.currentStreak);
    }

    /**
     * @notice Get user stats
     */
    function getUserStats(address user) external view returns (
        uint256 totalPoints,
        uint256 actionsCount,
        uint256 signaturesGiven,
        uint256 signaturesReceived,
        uint256 currentStreak,
        uint256 longestStreak,
        uint256 lastActionTime
    ) {
        UserStats memory stats = userStats[user];
        return (
            stats.totalPoints,
            stats.actionsCount,
            stats.signaturesGiven,
            stats.signaturesReceived,
            stats.currentStreak,
            stats.longestStreak,
            stats.lastActionTime
        );
    }

    /**
     * @notice Get full user stats including referrals
     */
    function getFullUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }

    /**
     * @notice Get weekly points for a user
     */
    function getWeeklyPoints(address user) external view returns (uint256) {
        uint256 currentWeek = block.timestamp / 1 weeks;
        return weeklyPoints[currentWeek][user];
    }

    /**
     * @notice Get monthly points for a user
     */
    function getMonthlyPoints(address user) external view returns (uint256) {
        uint256 currentMonth = block.timestamp / 30 days;
        return monthlyPoints[currentMonth][user];
    }

    /**
     * @notice Add bonus points (for special events)
     */
    function addBonusPoints(
        address user,
        uint256 points,
        string calldata reason
    ) external onlyUpdater {
        uint256 bonusPoints = applyMultiplier(points);
        userStats[user].totalPoints += bonusPoints;
        _updateSnapshots(user, bonusPoints);
        emit PointsEarned(user, bonusPoints, reason);
    }
}
```

#### 3.2 Compile and Deploy
1. Compile with Solidity 0.8.20
2. Deploy (no constructor arguments)
3. Confirm transaction

#### 3.3 Save Address
📝 **Copy and save the deployed contract address!**
```
LEADERBOARD_ADDRESS = 0x...
```

---

### STEP 4: Deploy BaseActionsHub.sol

#### 4.1 Create the Contract
Create `contracts/BaseActionsHub.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IGuestbook {
    function sign(address guestbookOwner, address signer, string calldata message) external;
}

interface IBadgeNFT {
    enum BadgeType { 
        SIGNER, SUPPORTER, STREAK_3, STREAK_7, STREAK_30,
        EARLY_ADOPTER, TOP_10, WHALE, COLLECTOR, INFLUENCER 
    }
    function mintBadge(address recipient, BadgeType badgeType) external returns (uint256);
    function hasBadge(address user, BadgeType badgeType) external view returns (bool);
    function userBadgeCount(address user) external view returns (uint256);
}

interface ILeaderboard {
    function recordSignature(address signer, address guestbookOwner) external;
    function recordReferral(address referee, address referrer) external;
    function getUserStats(address user) external view returns (
        uint256 totalPoints,
        uint256 actionsCount,
        uint256 signaturesGiven,
        uint256 signaturesReceived,
        uint256 currentStreak,
        uint256 longestStreak,
        uint256 lastActionTime
    );
}

/**
 * @title BaseActionsHub V2
 * @notice Main hub with tipping, batch signing, and emergency controls
 */
contract BaseActionsHub is Ownable, ReentrancyGuard, Pausable {
    IGuestbook public guestbook;
    IBadgeNFT public badgeNFT;
    ILeaderboard public leaderboard;

    // Fees
    uint256 public signFee = 0.0001 ether;
    uint256 public platformFeePercent = 10; // 10%

    // Stats
    uint256 public totalActions;
    uint256 public totalFeesCollected;
    uint256 public totalTips;
    
    // Early adopter tracking
    uint256 public constant EARLY_ADOPTER_LIMIT = 1000;
    uint256 public earlyAdopterCount;
    mapping(address => bool) public isEarlyAdopter;

    // Platform wallet
    address public platformWallet;

    event ActionPerformed(
        address indexed user,
        address indexed target,
        string actionType,
        uint256 fee,
        uint256 timestamp
    );

    event SignAndBadge(
        address indexed signer,
        address indexed guestbookOwner,
        string message,
        uint256 badgeTokenId
    );
    
    event TipSent(
        address indexed from,
        address indexed to,
        uint256 amount,
        string message
    );
    
    event BatchSign(
        address indexed signer,
        uint256 count,
        uint256 totalFee
    );
    
    event ReferralUsed(
        address indexed referee,
        address indexed referrer
    );

    constructor(
        address _guestbook,
        address _badgeNFT,
        address _leaderboard,
        address _platformWallet
    ) Ownable(msg.sender) {
        guestbook = IGuestbook(_guestbook);
        badgeNFT = IBadgeNFT(_badgeNFT);
        leaderboard = ILeaderboard(_leaderboard);
        platformWallet = _platformWallet;
    }

    /**
     * @notice Sign a guestbook + earn badge + update leaderboard
     */
    function signAndEarn(
        address guestbookOwner,
        string calldata message
    ) external payable nonReentrant whenNotPaused {
        _signInternal(guestbookOwner, message, address(0));
    }

    /**
     * @notice Sign with a referral code
     */
    function signWithReferral(
        address guestbookOwner,
        string calldata message,
        address referrer
    ) external payable nonReentrant whenNotPaused {
        _signInternal(guestbookOwner, message, referrer);
    }

    /**
     * @notice Internal sign logic
     */
    function _signInternal(
        address guestbookOwner,
        string calldata message,
        address referrer
    ) internal {
        require(msg.value >= signFee, "Insufficient fee");
        require(guestbookOwner != address(0), "Invalid guestbook");

        // Process referral if first action
        (,uint256 actionsCount,,,,,) = leaderboard.getUserStats(msg.sender);
        if (referrer != address(0) && actionsCount == 0) {
            leaderboard.recordReferral(msg.sender, referrer);
            emit ReferralUsed(msg.sender, referrer);
        }

        // Calculate fee split
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;

        // 1️⃣ Contract #1: Sign the guestbook
        guestbook.sign(guestbookOwner, msg.sender, message);

        // 2️⃣ Contract #2: Mint badge NFT (if first time)
        uint256 badgeTokenId = 0;
        if (!badgeNFT.hasBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER)) {
            badgeTokenId = badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER);
            
            // Check for early adopter
            if (earlyAdopterCount < EARLY_ADOPTER_LIMIT && !isEarlyAdopter[msg.sender]) {
                isEarlyAdopter[msg.sender] = true;
                earlyAdopterCount++;
                badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.EARLY_ADOPTER);
            }
        }

        // 3️⃣ Contract #3: Update leaderboard stats
        leaderboard.recordSignature(msg.sender, guestbookOwner);

        // Check for streak badges
        _checkAndAwardStreakBadges(msg.sender);
        
        // Check for whale badge (100+ signatures)
        _checkAndAwardWhaleBadge(msg.sender);

        // Transfer funds
        if (creatorAmount > 0) {
            (bool sent, ) = payable(guestbookOwner).call{value: creatorAmount}("");
            require(sent, "Transfer failed");
        }

        if (platformFee > 0) {
            (bool sent, ) = payable(platformWallet).call{value: platformFee}("");
            require(sent, "Platform fee transfer failed");
        }

        totalActions++;
        totalFeesCollected += msg.value;

        emit ActionPerformed(msg.sender, guestbookOwner, "SIGN", msg.value, block.timestamp);
        emit SignAndBadge(msg.sender, guestbookOwner, message, badgeTokenId);
    }

    /**
     * @notice Batch sign multiple guestbooks
     */
    function batchSign(
        address[] calldata guestbookOwners,
        string[] calldata messages
    ) external payable nonReentrant whenNotPaused {
        require(guestbookOwners.length == messages.length, "Length mismatch");
        require(guestbookOwners.length > 0 && guestbookOwners.length <= 10, "1-10 guestbooks");
        
        uint256 totalFeeRequired = signFee * guestbookOwners.length;
        require(msg.value >= totalFeeRequired, "Insufficient fee");

        for (uint256 i = 0; i < guestbookOwners.length; i++) {
            require(guestbookOwners[i] != address(0), "Invalid guestbook");
            
            uint256 platformFee = (signFee * platformFeePercent) / 100;
            uint256 creatorAmount = signFee - platformFee;

            guestbook.sign(guestbookOwners[i], msg.sender, messages[i]);
            leaderboard.recordSignature(msg.sender, guestbookOwners[i]);

            if (creatorAmount > 0) {
                (bool sent, ) = payable(guestbookOwners[i]).call{value: creatorAmount}("");
                require(sent, "Transfer failed");
            }

            if (platformFee > 0) {
                (bool sent, ) = payable(platformWallet).call{value: platformFee}("");
                require(sent, "Platform fee transfer failed");
            }
        }

        // Mint signer badge if first time
        if (!badgeNFT.hasBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER)) {
            badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER);
        }

        _checkAndAwardStreakBadges(msg.sender);
        _checkAndAwardWhaleBadge(msg.sender);

        totalActions += guestbookOwners.length;
        totalFeesCollected += msg.value;

        emit BatchSign(msg.sender, guestbookOwners.length, msg.value);
    }

    /**
     * @notice Send a tip to another user
     */
    function tip(
        address recipient,
        string calldata message
    ) external payable nonReentrant whenNotPaused {
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot tip self");
        require(msg.value > 0, "Tip required");

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 tipAmount = msg.value - platformFee;

        (bool sent, ) = payable(recipient).call{value: tipAmount}("");
        require(sent, "Tip transfer failed");

        if (platformFee > 0) {
            (bool feesSent, ) = payable(platformWallet).call{value: platformFee}("");
            require(feesSent, "Platform fee transfer failed");
        }

        totalTips += msg.value;

        emit TipSent(msg.sender, recipient, msg.value, message);
    }

    /**
     * @notice Check and award streak badges
     */
    function _checkAndAwardStreakBadges(address user) internal {
        (,,,, uint256 currentStreak,,) = leaderboard.getUserStats(user);

        if (currentStreak >= 3 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.STREAK_3)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.STREAK_3);
        }
        if (currentStreak >= 7 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.STREAK_7)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.STREAK_7);
        }
        if (currentStreak >= 30 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.STREAK_30)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.STREAK_30);
        }
    }

    /**
     * @notice Check and award whale badge
     */
    function _checkAndAwardWhaleBadge(address user) internal {
        (,, uint256 signaturesGiven,,,,) = leaderboard.getUserStats(user);
        
        if (signaturesGiven >= 100 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.WHALE)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.WHALE);
        }
    }

    // ============ Emergency Functions ============

    /**
     * @notice Pause all actions
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause all actions
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ Admin Functions ============

    function setContracts(
        address _guestbook,
        address _badgeNFT,
        address _leaderboard
    ) external onlyOwner {
        if (_guestbook != address(0)) guestbook = IGuestbook(_guestbook);
        if (_badgeNFT != address(0)) badgeNFT = IBadgeNFT(_badgeNFT);
        if (_leaderboard != address(0)) leaderboard = ILeaderboard(_leaderboard);
    }

    function setFees(uint256 _signFee, uint256 _platformFeePercent) external onlyOwner {
        require(_platformFeePercent <= 20, "Max 20%");
        signFee = _signFee;
        platformFeePercent = _platformFeePercent;
    }

    function setPlatformWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "Invalid wallet");
        platformWallet = _wallet;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        (bool sent, ) = payable(owner()).call{value: balance}("");
        require(sent, "Withdraw failed");
    }

    receive() external payable {}
}
```

#### 4.2 Compile and Deploy
1. Compile with Solidity 0.8.20
2. Deploy with constructor arguments:
   - `_guestbook`: Your Guestbook address from Step 1
   - `_badgeNFT`: Your BadgeNFT address from Step 2
   - `_leaderboard`: Your Leaderboard address from Step 3
   - `_platformWallet`: Your wallet address

3. Confirm transaction

#### 4.3 Save Address
📝 **Copy and save the deployed contract address!**
```
HUB_ADDRESS = 0x...
```

---

## Post-Deployment Configuration

### 1. Configure Guestbook
On the Guestbook contract:
```
setAuthorizedSigner(HUB_ADDRESS, true)
```

### 2. Configure BadgeNFT
On the BadgeNFT contract:
```
setMinter(HUB_ADDRESS, true)
```

### 3. Configure Leaderboard
On the Leaderboard contract:
```
setUpdater(HUB_ADDRESS, true)
```

---

## Verification

### Verify on BaseScan

1. Go to BaseScan (or Sepolia BaseScan for testnet)
2. Find your contract
3. Click "Verify and Publish"
4. Select:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.20+commit.a1b79de6
   - Open Source License: MIT
5. Paste source code
6. For BaseActionsHub, add constructor arguments (ABI-encoded)

---

## Update Frontend

After deployment, update `/frontend/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  BaseActionsHub: "0x...",  // Your new Hub address
  Guestbook: "0x...",       // Your new Guestbook address
  BadgeNFT: "0x...",        // Your new BadgeNFT address
  Leaderboard: "0x...",     // Your new Leaderboard address
} as const;
```

---

## Troubleshooting

### "Gas estimation failed"
- Make sure you have enough ETH
- Check all addresses are correct

### "Not authorized" error
- Verify you called setMinter/setUpdater/setAuthorizedSigner

### "Insufficient fee"
- Send at least 0.0001 ETH with signAndEarn

### Contract not verified
- Wait 1-2 minutes after deployment
- Ensure compiler version matches exactly

---

## Checklist

- [ ] Guestbook deployed
- [ ] BadgeNFT deployed
- [ ] Leaderboard deployed
- [ ] BaseActionsHub deployed
- [ ] Guestbook: setAuthorizedSigner called
- [ ] BadgeNFT: setMinter called
- [ ] Leaderboard: setUpdater called
- [ ] All contracts verified on BaseScan
- [ ] Frontend config updated
- [ ] Test signAndEarn transaction works
