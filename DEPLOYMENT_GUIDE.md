# 🚀 BaseActions Hub V2 - Remix Deployment Guide

## Overview

This guide walks you through deploying the BaseActions Hub V2 smart contracts on **Base Sepolia Testnet** (or Base Mainnet) using Remix IDE.

---

## 📋 Deployment Lineup

| Order | Contract | Constructor Args | Depends On |
|-------|----------|------------------|------------|
| **1** | `Guestbook.sol` | None | - |
| **2** | `BadgeNFT.sol` | None | - |
| **3** | `Leaderboard.sol` | None | - |
| **4** | `BaseActionsHub.sol` | 4 addresses | Contracts 1, 2, 3 |

---

## 🔧 Prerequisites

1. **MetaMask** wallet installed
2. **Base Sepolia ETH** for gas (get from [Base Faucet](https://www.coinbase.com/faucets/base-sepolia-faucet))
3. **Remix IDE**: https://remix.ethereum.org

---

## 📄 Contract Files

Copy each contract exactly as shown below into Remix.

---

### Contract #1: Guestbook.sol

**Constructor Arguments:** `NONE`

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
        uint256 reactions;
        bool isPinned;
        uint256 editedAt;
    }

    mapping(address => Signature[]) public guestbooks;
    mapping(address => mapping(uint256 => mapping(address => bool))) public hasReacted;
    mapping(address => uint256) public signatureCount;
    mapping(address => int256) public pinnedSignature;
    uint256 public totalSignatures;
    uint256 public totalReactions;
    uint256 public constant EDIT_WINDOW = 5 minutes;
    mapping(address => bool) public authorizedSigners;

    event Signed(address indexed guestbookOwner, address indexed signer, string message, uint256 indexed signatureIndex, uint256 timestamp);
    event SignatureEdited(address indexed guestbookOwner, uint256 indexed signatureIndex, string newMessage, uint256 timestamp);
    event Reacted(address indexed guestbookOwner, uint256 indexed signatureIndex, address indexed reactor, uint256 newReactionCount);
    event Unreacted(address indexed guestbookOwner, uint256 indexed signatureIndex, address indexed reactor, uint256 newReactionCount);
    event SignaturePinned(address indexed guestbookOwner, uint256 indexed signatureIndex);
    event SignatureUnpinned(address indexed guestbookOwner);

    constructor() Ownable(msg.sender) {
        pinnedSignature[msg.sender] = -1;
    }

    function setAuthorizedSigner(address signer, bool authorized) external onlyOwner {
        authorizedSigners[signer] = authorized;
    }

    function sign(address guestbookOwner, address signer, string calldata message) external {
        require(authorizedSigners[msg.sender] || msg.sender == owner(), "Not authorized");
        require(bytes(message).length > 0, "Empty message");
        require(bytes(message).length <= 280, "Message too long");

        if (pinnedSignature[guestbookOwner] == 0 && guestbooks[guestbookOwner].length == 0) {
            pinnedSignature[guestbookOwner] = -1;
        }

        guestbooks[guestbookOwner].push(Signature({
            signer: signer,
            message: message,
            timestamp: block.timestamp,
            reactions: 0,
            isPinned: false,
            editedAt: 0
        }));

        uint256 index = guestbooks[guestbookOwner].length - 1;
        signatureCount[guestbookOwner]++;
        totalSignatures++;

        emit Signed(guestbookOwner, signer, message, index, block.timestamp);
    }

    function editSignature(address guestbookOwner, uint256 index, string calldata newMessage) external {
        require(index < guestbooks[guestbookOwner].length, "Invalid index");
        Signature storage sig = guestbooks[guestbookOwner][index];
        require(sig.signer == msg.sender, "Not your signature");
        require(block.timestamp <= sig.timestamp + EDIT_WINDOW, "Edit window closed");
        require(bytes(newMessage).length > 0 && bytes(newMessage).length <= 280, "Invalid message");

        sig.message = newMessage;
        sig.editedAt = block.timestamp;

        emit SignatureEdited(guestbookOwner, index, newMessage, block.timestamp);
    }

    function react(address guestbookOwner, uint256 signatureIndex) external {
        require(signatureIndex < guestbooks[guestbookOwner].length, "Invalid signature");
        require(!hasReacted[guestbookOwner][signatureIndex][msg.sender], "Already reacted");

        hasReacted[guestbookOwner][signatureIndex][msg.sender] = true;
        guestbooks[guestbookOwner][signatureIndex].reactions++;
        totalReactions++;

        emit Reacted(guestbookOwner, signatureIndex, msg.sender, guestbooks[guestbookOwner][signatureIndex].reactions);
    }

    function unreact(address guestbookOwner, uint256 signatureIndex) external {
        require(signatureIndex < guestbooks[guestbookOwner].length, "Invalid signature");
        require(hasReacted[guestbookOwner][signatureIndex][msg.sender], "Not reacted");

        hasReacted[guestbookOwner][signatureIndex][msg.sender] = false;
        guestbooks[guestbookOwner][signatureIndex].reactions--;
        totalReactions--;

        emit Unreacted(guestbookOwner, signatureIndex, msg.sender, guestbooks[guestbookOwner][signatureIndex].reactions);
    }

    function pinSignature(uint256 signatureIndex) external {
        require(signatureIndex < guestbooks[msg.sender].length, "Invalid signature");

        if (pinnedSignature[msg.sender] >= 0) {
            guestbooks[msg.sender][uint256(pinnedSignature[msg.sender])].isPinned = false;
        }

        guestbooks[msg.sender][signatureIndex].isPinned = true;
        pinnedSignature[msg.sender] = int256(signatureIndex);

        emit SignaturePinned(msg.sender, signatureIndex);
    }

    function unpinSignature() external {
        require(pinnedSignature[msg.sender] >= 0, "No pinned signature");

        guestbooks[msg.sender][uint256(pinnedSignature[msg.sender])].isPinned = false;
        pinnedSignature[msg.sender] = -1;

        emit SignatureUnpinned(msg.sender);
    }

    function getSignatures(address guestbookOwner, uint256 offset, uint256 limit) external view returns (Signature[] memory) {
        uint256 total = guestbooks[guestbookOwner].length;
        if (offset >= total) return new Signature[](0);

        uint256 end = offset + limit > total ? total : offset + limit;
        Signature[] memory result = new Signature[](end - offset);

        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = guestbooks[guestbookOwner][i];
        }
        return result;
    }

    function getSignature(address guestbookOwner, uint256 index) external view returns (Signature memory) {
        require(index < guestbooks[guestbookOwner].length, "Invalid index");
        return guestbooks[guestbookOwner][index];
    }

    function getGuestbookStats(address guestbookOwner) external view returns (uint256 count, int256 pinned, uint256 totalReacts) {
        uint256 reacts = 0;
        for (uint256 i = 0; i < guestbooks[guestbookOwner].length; i++) {
            reacts += guestbooks[guestbookOwner][i].reactions;
        }
        return (signatureCount[guestbookOwner], pinnedSignature[guestbookOwner], reacts);
    }
}
```

---

### Contract #2: BadgeNFT.sol

**Constructor Arguments:** `NONE`

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

    enum BadgeType { 
        SIGNER, SUPPORTER, STREAK_3, STREAK_7, STREAK_30,
        EARLY_ADOPTER, TOP_10, WHALE, COLLECTOR, INFLUENCER
    }

    enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }

    struct Badge {
        BadgeType badgeType;
        Rarity rarity;
        address recipient;
        uint256 timestamp;
        string customMetadata;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(BadgeType => bool)) public hasBadge;
    mapping(address => mapping(BadgeType => uint256)) public userBadgeTokenId;
    mapping(address => uint256) public userBadgeCount;
    mapping(BadgeType => uint256) public badgeTypeMintCount;
    mapping(address => bool) public minters;
    bool public soulbound = false;
    string private _baseTokenURI;
    mapping(BadgeType => Rarity) public badgeRarity;

    event BadgeMinted(address indexed recipient, uint256 indexed tokenId, BadgeType badgeType, Rarity rarity);
    event SoulboundUpdated(bool enabled);

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC721("BaseActions Badge", "BADGE") Ownable(msg.sender) {
        _baseTokenURI = "https://baseactions.vercel.app/api/badge/";
        
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

    function setMinter(address minter, bool authorized) external onlyOwner {
        minters[minter] = authorized;
    }

    function setSoulbound(bool _soulbound) external onlyOwner {
        soulbound = _soulbound;
        emit SoulboundUpdated(_soulbound);
    }

    function mintBadge(address recipient, BadgeType badgeType) external onlyMinter returns (uint256) {
        if (hasBadge[recipient][badgeType]) {
            return userBadgeTokenId[recipient][badgeType];
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(recipient, tokenId);

        Rarity rarity = badgeRarity[badgeType];
        badges[tokenId] = Badge({
            badgeType: badgeType,
            rarity: rarity,
            recipient: recipient,
            timestamp: block.timestamp,
            customMetadata: ""
        });

        hasBadge[recipient][badgeType] = true;
        userBadgeTokenId[recipient][badgeType] = tokenId;
        userBadgeCount[recipient]++;
        badgeTypeMintCount[badgeType]++;

        emit BadgeMinted(recipient, tokenId, badgeType, rarity);
        return tokenId;
    }

    function mintBadgeWithMetadata(address recipient, BadgeType badgeType, string calldata metadata) external onlyMinter returns (uint256) {
        uint256 tokenId = this.mintBadge(recipient, badgeType);
        badges[tokenId].customMetadata = metadata;
        return tokenId;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token doesn't exist");
        Badge memory badge = badges[tokenId];
        return string(abi.encodePacked(_baseTokenURI, uint256(badge.badgeType).toString(), "/", tokenId.toString()));
    }

    function getUserBadges(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }
        return tokenIds;
    }

    function getBadgeInfo(uint256 tokenId) external view returns (Badge memory) {
        require(ownerOf(tokenId) != address(0), "Token doesn't exist");
        return badges[tokenId];
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        if (soulbound && from != address(0) && to != address(0)) {
            revert("Soulbound: transfers disabled");
        }
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

---

### Contract #3: Leaderboard.sol

**Constructor Arguments:** `NONE`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Leaderboard V2
 * @notice Tracks user points, rankings, referrals, and snapshots
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
        uint256 lastActionDay;
        uint256 referralPoints;
        uint256 referralCount;
        address referrer;
    }

    mapping(address => UserStats) public userStats;
    mapping(uint256 => mapping(address => uint256)) public weeklyPoints;
    mapping(uint256 => mapping(address => uint256)) public monthlyPoints;
    uint256 public totalUsers;
    uint256 public totalPointsAwarded;
    mapping(address => bool) public updaters;
    uint256 public activityMultiplier = 100;
    uint256 public multiplierEndTime;

    uint256 public constant SIGN_POINTS = 10;
    uint256 public constant RECEIVE_SIGN_POINTS = 5;
    uint256 public constant STREAK_BONUS = 2;
    uint256 public constant REFERRAL_BONUS = 20;
    uint256 public constant REFERRER_BONUS = 10;

    event PointsEarned(address indexed user, uint256 points, string reason);
    event StatsUpdated(address indexed user, uint256 totalPoints, uint256 streak);
    event ReferralRecorded(address indexed referrer, address indexed referee);
    event MultiplierUpdated(uint256 multiplier, uint256 endTime);
    event WeeklySnapshot(uint256 indexed weekNumber, address indexed user, uint256 points);
    event MonthlySnapshot(uint256 indexed monthNumber, address indexed user, uint256 points);

    modifier onlyUpdater() {
        require(updaters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function setUpdater(address updater, bool authorized) external onlyOwner {
        updaters[updater] = authorized;
    }

    function setMultiplier(uint256 multiplier, uint256 duration) external onlyOwner {
        require(multiplier >= 100 && multiplier <= 500, "Invalid multiplier");
        activityMultiplier = multiplier;
        multiplierEndTime = block.timestamp + duration;
        emit MultiplierUpdated(multiplier, multiplierEndTime);
    }

    function recordReferral(address referee, address referrer) external onlyUpdater {
        require(userStats[referee].referrer == address(0), "Already has referrer");
        require(referee != referrer, "Cannot refer yourself");

        userStats[referee].referrer = referrer;
        userStats[referrer].referralCount++;

        uint256 bonus = _applyMultiplier(REFERRAL_BONUS);
        userStats[referee].totalPoints += bonus;
        userStats[referee].referralPoints += bonus;
        totalPointsAwarded += bonus;

        uint256 referrerBonus = _applyMultiplier(REFERRER_BONUS);
        userStats[referrer].totalPoints += referrerBonus;
        userStats[referrer].referralPoints += referrerBonus;
        totalPointsAwarded += referrerBonus;

        emit ReferralRecorded(referrer, referee);
        emit PointsEarned(referee, bonus, "referral_bonus");
        emit PointsEarned(referrer, referrerBonus, "referrer_bonus");
    }

    function recordSignature(address signer, address guestbookOwner) external onlyUpdater {
        if (userStats[signer].actionsCount == 0) {
            totalUsers++;
        }

        uint256 currentDay = block.timestamp / 1 days;
        UserStats storage stats = userStats[signer];

        if (stats.lastActionDay == currentDay - 1) {
            stats.currentStreak++;
        } else if (stats.lastActionDay != currentDay) {
            stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }

        stats.lastActionDay = currentDay;
        stats.lastActionTime = block.timestamp;
        stats.actionsCount++;
        stats.signaturesGiven++;

        uint256 points = _applyMultiplier(SIGN_POINTS);
        uint256 streakBonus = stats.currentStreak > 1 ? _applyMultiplier(STREAK_BONUS * (stats.currentStreak - 1)) : 0;
        uint256 totalPoints = points + streakBonus;

        stats.totalPoints += totalPoints;
        totalPointsAwarded += totalPoints;

        userStats[guestbookOwner].signaturesReceived++;
        uint256 receivePoints = _applyMultiplier(RECEIVE_SIGN_POINTS);
        userStats[guestbookOwner].totalPoints += receivePoints;
        totalPointsAwarded += receivePoints;

        _recordSnapshots(signer, totalPoints);
        _recordSnapshots(guestbookOwner, receivePoints);

        emit PointsEarned(signer, totalPoints, "signature");
        emit PointsEarned(guestbookOwner, receivePoints, "received_signature");
        emit StatsUpdated(signer, stats.totalPoints, stats.currentStreak);
    }

    function _applyMultiplier(uint256 basePoints) internal view returns (uint256) {
        if (block.timestamp > multiplierEndTime) {
            return basePoints;
        }
        return (basePoints * activityMultiplier) / 100;
    }

    function _recordSnapshots(address user, uint256 points) internal {
        uint256 week = block.timestamp / 1 weeks;
        uint256 month = block.timestamp / 30 days;

        weeklyPoints[week][user] += points;
        monthlyPoints[month][user] += points;

        emit WeeklySnapshot(week, user, weeklyPoints[week][user]);
        emit MonthlySnapshot(month, user, monthlyPoints[month][user]);
    }

    function getUserStats(address user) external view returns (
        uint256 totalPoints, uint256 actionsCount, uint256 signaturesGiven,
        uint256 signaturesReceived, uint256 currentStreak, uint256 longestStreak,
        uint256 lastActionTime
    ) {
        UserStats memory stats = userStats[user];
        return (stats.totalPoints, stats.actionsCount, stats.signaturesGiven,
            stats.signaturesReceived, stats.currentStreak, stats.longestStreak,
            stats.lastActionTime);
    }

    function getFullUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }

    function getWeeklyPoints(address user) external view returns (uint256) {
        return weeklyPoints[block.timestamp / 1 weeks][user];
    }

    function getMonthlyPoints(address user) external view returns (uint256) {
        return monthlyPoints[block.timestamp / 30 days][user];
    }

    function getCurrentMultiplier() external view returns (uint256 multiplier, uint256 endTime, bool active) {
        return (activityMultiplier, multiplierEndTime, block.timestamp <= multiplierEndTime);
    }
}
```

---

### Contract #4: BaseActionsHub.sol

**Constructor Arguments:** `4 addresses`

| Argument | Description | Value |
|----------|-------------|-------|
| `_guestbook` | Guestbook contract address | From Contract #1 |
| `_badgeNFT` | BadgeNFT contract address | From Contract #2 |
| `_leaderboard` | Leaderboard contract address | From Contract #3 |
| `_platformWallet` | Your wallet for platform fees | Your wallet address |

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
    enum BadgeType { SIGNER, SUPPORTER, STREAK_3, STREAK_7, STREAK_30, EARLY_ADOPTER, TOP_10, WHALE, COLLECTOR, INFLUENCER }
    function mintBadge(address recipient, BadgeType badgeType) external returns (uint256);
    function hasBadge(address user, BadgeType badgeType) external view returns (bool);
    function userBadgeCount(address user) external view returns (uint256);
}

interface ILeaderboard {
    function recordSignature(address signer, address guestbookOwner) external;
    function recordReferral(address referee, address referrer) external;
    function getUserStats(address user) external view returns (
        uint256 totalPoints, uint256 actionsCount, uint256 signaturesGiven,
        uint256 signaturesReceived, uint256 currentStreak, uint256 longestStreak,
        uint256 lastActionTime
    );
}

/**
 * @title BaseActionsHub V2
 * @notice Main hub with tipping, batch signing, referrals, and emergency controls
 */
contract BaseActionsHub is Ownable, ReentrancyGuard, Pausable {
    IGuestbook public guestbook;
    IBadgeNFT public badgeNFT;
    ILeaderboard public leaderboard;

    uint256 public signFee = 0.0001 ether;
    uint256 public platformFeePercent = 10;
    uint256 public totalActions;
    uint256 public totalFeesCollected;
    uint256 public totalTips;
    uint256 public constant EARLY_ADOPTER_LIMIT = 1000;
    uint256 public earlyAdopterCount;
    mapping(address => bool) public isEarlyAdopter;
    address public platformWallet;

    event ActionPerformed(address indexed user, address indexed target, string actionType, uint256 fee, uint256 timestamp);
    event SignAndBadge(address indexed signer, address indexed guestbookOwner, string message, uint256 badgeTokenId);
    event TipSent(address indexed from, address indexed to, uint256 amount, string message);
    event BatchSign(address indexed signer, uint256 count, uint256 totalFee);
    event ReferralUsed(address indexed referee, address indexed referrer);

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

    function signAndEarn(address guestbookOwner, string calldata message) external payable nonReentrant whenNotPaused {
        _signInternal(guestbookOwner, message, address(0));
    }

    function signWithReferral(address guestbookOwner, string calldata message, address referrer) external payable nonReentrant whenNotPaused {
        _signInternal(guestbookOwner, message, referrer);
    }

    function _signInternal(address guestbookOwner, string calldata message, address referrer) internal {
        require(msg.value >= signFee, "Insufficient fee");
        require(guestbookOwner != address(0), "Invalid guestbook");

        (,uint256 actionsCount,,,,,) = leaderboard.getUserStats(msg.sender);
        if (referrer != address(0) && actionsCount == 0 && referrer != msg.sender) {
            leaderboard.recordReferral(msg.sender, referrer);
            emit ReferralUsed(msg.sender, referrer);
        }

        guestbook.sign(guestbookOwner, msg.sender, message);
        leaderboard.recordSignature(msg.sender, guestbookOwner);

        uint256 badgeTokenId = 0;
        if (!badgeNFT.hasBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER)) {
            badgeTokenId = badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER);
        }

        if (!isEarlyAdopter[msg.sender] && earlyAdopterCount < EARLY_ADOPTER_LIMIT) {
            isEarlyAdopter[msg.sender] = true;
            earlyAdopterCount++;
            if (!badgeNFT.hasBadge(msg.sender, IBadgeNFT.BadgeType.EARLY_ADOPTER)) {
                badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.EARLY_ADOPTER);
            }
        }

        _checkAndAwardBadges(msg.sender);

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 ownerAmount = msg.value - platformFee;

        totalActions++;
        totalFeesCollected += msg.value;

        if (ownerAmount > 0 && guestbookOwner != address(0)) {
            payable(guestbookOwner).transfer(ownerAmount);
        }
        if (platformFee > 0 && platformWallet != address(0)) {
            payable(platformWallet).transfer(platformFee);
        }

        emit ActionPerformed(msg.sender, guestbookOwner, "sign", msg.value, block.timestamp);
        emit SignAndBadge(msg.sender, guestbookOwner, message, badgeTokenId);
    }

    function batchSign(address[] calldata guestbookOwners, string[] calldata messages) external payable nonReentrant whenNotPaused {
        require(guestbookOwners.length == messages.length, "Length mismatch");
        require(guestbookOwners.length <= 10, "Max 10 signatures");
        uint256 totalFee = signFee * guestbookOwners.length;
        require(msg.value >= totalFee, "Insufficient fee");

        for (uint256 i = 0; i < guestbookOwners.length; i++) {
            guestbook.sign(guestbookOwners[i], msg.sender, messages[i]);
            leaderboard.recordSignature(msg.sender, guestbookOwners[i]);
        }

        if (!badgeNFT.hasBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER)) {
            badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER);
        }

        _checkAndAwardBadges(msg.sender);

        totalActions += guestbookOwners.length;
        totalFeesCollected += msg.value;

        if (platformWallet != address(0)) {
            payable(platformWallet).transfer(msg.value);
        }

        emit BatchSign(msg.sender, guestbookOwners.length, msg.value);
    }

    function tip(address recipient, string calldata message) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "No tip amount");
        require(recipient != address(0), "Invalid recipient");

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 tipAmount = msg.value - platformFee;

        totalTips += msg.value;

        payable(recipient).transfer(tipAmount);
        if (platformFee > 0 && platformWallet != address(0)) {
            payable(platformWallet).transfer(platformFee);
        }

        emit TipSent(msg.sender, recipient, tipAmount, message);
    }

    function _checkAndAwardBadges(address user) internal {
        (,, uint256 signaturesGiven,, uint256 currentStreak,,) = leaderboard.getUserStats(user);

        if (signaturesGiven >= 100 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.WHALE)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.WHALE);
        }
        if (currentStreak >= 3 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.STREAK_3)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.STREAK_3);
        }
        if (currentStreak >= 7 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.STREAK_7)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.STREAK_7);
        }
        if (currentStreak >= 30 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.STREAK_30)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.STREAK_30);
        }
        if (badgeNFT.userBadgeCount(user) >= 5 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.COLLECTOR)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.COLLECTOR);
        }
    }

    function setSignFee(uint256 _fee) external onlyOwner { signFee = _fee; }
    function setPlatformFeePercent(uint256 _percent) external onlyOwner {
        require(_percent <= 20, "Max 20%");
        platformFeePercent = _percent;
    }
    function setPlatformWallet(address _wallet) external onlyOwner { platformWallet = _wallet; }
    function setContracts(address _guestbook, address _badgeNFT, address _leaderboard) external onlyOwner {
        if (_guestbook != address(0)) guestbook = IGuestbook(_guestbook);
        if (_badgeNFT != address(0)) badgeNFT = IBadgeNFT(_badgeNFT);
        if (_leaderboard != address(0)) leaderboard = ILeaderboard(_leaderboard);
    }
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner()).transfer(balance);
    }
    receive() external payable {}
}
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Open Remix IDE
Go to https://remix.ethereum.org

### Step 2: Create Contract Files
1. In the File Explorer, create 4 new files:
   - `Guestbook.sol`
   - `BadgeNFT.sol`
   - `Leaderboard.sol`
   - `BaseActionsHub.sol`

2. Copy each contract code above into the respective files

### Step 3: Compile Contracts
1. Go to **Solidity Compiler** tab (left sidebar)
2. Set compiler version: **0.8.20**
3. Enable **optimization** (200 runs recommended)
4. Compile each contract

### Step 4: Connect MetaMask
1. Go to **Deploy & Run Transactions** tab
2. Set **Environment** to: `Injected Provider - MetaMask`
3. Ensure you're on **Base Sepolia** network
   - Chain ID: `84532`
   - RPC: `https://sepolia.base.org`

### Step 5: Deploy in Order

#### 🔵 Deploy #1: Guestbook
1. Select `Guestbook.sol` in dropdown
2. Click **Deploy** (no arguments needed)
3. Confirm in MetaMask
4. **Copy the deployed address** ✅

#### 🟢 Deploy #2: BadgeNFT
1. Select `BadgeNFT.sol` in dropdown
2. Click **Deploy** (no arguments needed)
3. Confirm in MetaMask
4. **Copy the deployed address** ✅

#### 🟡 Deploy #3: Leaderboard
1. Select `Leaderboard.sol` in dropdown
2. Click **Deploy** (no arguments needed)
3. Confirm in MetaMask
4. **Copy the deployed address** ✅

#### 🔴 Deploy #4: BaseActionsHub
1. Select `BaseActionsHub.sol` in dropdown
2. Enter constructor arguments:
   ```
   _guestbook: <Guestbook address from step 1>
   _badgeNFT: <BadgeNFT address from step 2>
   _leaderboard: <Leaderboard address from step 3>
   _platformWallet: <Your wallet address>
   ```
3. Click **Deploy**
4. Confirm in MetaMask
5. **Copy the deployed address** ✅

---

## ⚙️ Post-Deployment Setup

### Authorize Hub Contract

After deploying all contracts, you need to authorize the Hub to call the other contracts:

#### 1. Authorize Hub in Guestbook
- Go to Guestbook contract in Remix
- Call `setAuthorizedSigner`:
  ```
  signer: <BaseActionsHub address>
  authorized: true
  ```

#### 2. Authorize Hub in BadgeNFT
- Go to BadgeNFT contract in Remix
- Call `setMinter`:
  ```
  minter: <BaseActionsHub address>
  authorized: true
  ```

#### 3. Authorize Hub in Leaderboard
- Go to Leaderboard contract in Remix
- Call `setUpdater`:
  ```
  updater: <BaseActionsHub address>
  authorized: true
  ```

---

## 📝 Record Your Addresses

Fill in after deployment:

| Contract | Address |
|----------|---------|
| Guestbook | `0x___________________________________` |
| BadgeNFT | `0x___________________________________` |
| Leaderboard | `0x___________________________________` |
| BaseActionsHub | `0x___________________________________` |

---

## ✅ Verification Checklist

- [ ] All 4 contracts deployed
- [ ] Hub authorized in Guestbook
- [ ] Hub authorized in BadgeNFT
- [ ] Hub authorized in Leaderboard
- [ ] Test `signAndEarn` function works

---

## 🌐 Update Frontend Config

After deployment, update `frontend/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  // Base Sepolia Testnet
  84532: {
    guestbook: "YOUR_GUESTBOOK_ADDRESS",
    badgeNFT: "YOUR_BADGENFT_ADDRESS",
    leaderboard: "YOUR_LEADERBOARD_ADDRESS",
    hub: "YOUR_HUB_ADDRESS",
  },
  // Base Mainnet
  8453: {
    guestbook: "YOUR_MAINNET_GUESTBOOK",
    badgeNFT: "YOUR_MAINNET_BADGENFT",
    leaderboard: "YOUR_MAINNET_LEADERBOARD",
    hub: "YOUR_MAINNET_HUB",
  },
};
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not authorized" | Ensure Hub is authorized in all 3 contracts |
| "Insufficient fee" | Send at least 0.0001 ETH with signAndEarn |
| Transaction fails | Check you have enough Base Sepolia ETH |
| Contract not found | Verify addresses are correct in Hub constructor |

---

**Good luck with deployment! 🚀**

Bring back the contract addresses when done, and I'll update the frontend config.
