// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IGuestbook {
    function sign(address guestbookOwner, address signer, string calldata message) external;
}

interface IBadgeNFT {
    enum BadgeType { SIGNER, SUPPORTER, STREAK_3, STREAK_7, STREAK_30 }
    function mintBadge(address recipient, BadgeType badgeType) external returns (uint256);
    function hasBadge(address user, BadgeType badgeType) external view returns (bool);
}

interface ILeaderboard {
    function recordSignature(address signer, address guestbookOwner) external;
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
 * @title BaseActionsHub
 * @notice Main hub that coordinates actions across multiple contracts
 * @dev One user transaction = multiple contract interactions
 */
contract BaseActionsHub is Ownable, ReentrancyGuard {
    IGuestbook public guestbook;
    IBadgeNFT public badgeNFT;
    ILeaderboard public leaderboard;

    // Fees
    uint256 public signFee = 0.0001 ether;
    uint256 public platformFeePercent = 10; // 10%

    // Stats
    uint256 public totalActions;
    uint256 public totalFeesCollected;

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
     * @dev This single call interacts with 3 contracts!
     * @param guestbookOwner The guestbook to sign
     * @param message Your signature message
     */
    function signAndEarn(
        address guestbookOwner,
        string calldata message
    ) external payable nonReentrant {
        require(msg.value >= signFee, "Insufficient fee");
        require(guestbookOwner != address(0), "Invalid guestbook");

        // Calculate fee split
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;

        // 1️⃣ Contract #1: Sign the guestbook
        guestbook.sign(guestbookOwner, msg.sender, message);

        // 2️⃣ Contract #2: Mint badge NFT (if first time)
        uint256 badgeTokenId = 0;
        if (!badgeNFT.hasBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER)) {
            badgeTokenId = badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.SIGNER);
        }

        // 3️⃣ Contract #3: Update leaderboard stats
        leaderboard.recordSignature(msg.sender, guestbookOwner);

        // Check for streak badges
        _checkAndAwardStreakBadges(msg.sender);

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
