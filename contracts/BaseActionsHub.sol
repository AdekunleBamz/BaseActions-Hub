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
 * @notice Main hub with tipping, batch signing, referrals, and emergency controls
 * @dev Enhanced with pause functionality and new features
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
     * @dev This single call interacts with 3 contracts!
     * @param guestbookOwner The guestbook to sign
     * @param message Your signature message
     */
    function signAndEarn(
        address guestbookOwner,
        string calldata message
    ) external payable nonReentrant whenNotPaused {
        _signInternal(guestbookOwner, message, address(0));
    }

    /**
     * @notice Sign with a referral code
     * @param guestbookOwner The guestbook to sign
     * @param message Your signature message
     * @param referrer Address of the referrer
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
        if (referrer != address(0) && actionsCount == 0 && referrer != msg.sender) {
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
            
            // Check for early adopter badge
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
     * @notice Batch sign multiple guestbooks in one transaction
     * @param guestbookOwners Array of guestbook addresses
     * @param messages Array of messages (must match length)
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
            
            if (earlyAdopterCount < EARLY_ADOPTER_LIMIT && !isEarlyAdopter[msg.sender]) {
                isEarlyAdopter[msg.sender] = true;
                earlyAdopterCount++;
                badgeNFT.mintBadge(msg.sender, IBadgeNFT.BadgeType.EARLY_ADOPTER);
            }
        }

        _checkAndAwardStreakBadges(msg.sender);
        _checkAndAwardWhaleBadge(msg.sender);

        totalActions += guestbookOwners.length;
        totalFeesCollected += msg.value;

        emit BatchSign(msg.sender, guestbookOwners.length, msg.value);
    }

    /**
     * @notice Send a tip to another user
     * @param recipient The user to tip
     * @param message Optional message with the tip
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
     * @notice Check and award whale badge (100+ signatures)
     */
    function _checkAndAwardWhaleBadge(address user) internal {
        (,, uint256 signaturesGiven,,,,) = leaderboard.getUserStats(user);
        
        if (signaturesGiven >= 100 && !badgeNFT.hasBadge(user, IBadgeNFT.BadgeType.WHALE)) {
            badgeNFT.mintBadge(user, IBadgeNFT.BadgeType.WHALE);
        }
    }

    // ============ Emergency Functions ============

    /**
     * @notice Pause all contract operations
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Resume all contract operations
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
