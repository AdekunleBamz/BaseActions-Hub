// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Leaderboard
 * @notice Tracks user points and rankings
 */
contract Leaderboard is Ownable {
    struct UserStats {
        uint256 totalPoints;
        uint256 actionsCount;
        uint256 signaturesGiven;
        uint256 signaturesReceived;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastActionTime;
    }

    // User => Stats
    mapping(address => UserStats) public userStats;
    
    // Total users
    uint256 public totalUsers;
    
    // Authorized updaters (Hub contract)
    mapping(address => bool) public updaters;

    // Points per action type
    uint256 public constant SIGN_POINTS = 10;
    uint256 public constant RECEIVE_SIGN_POINTS = 5;
    uint256 public constant STREAK_BONUS = 2;

    event PointsEarned(address indexed user, uint256 points, string reason);
    event StatsUpdated(address indexed user, uint256 totalPoints, uint256 streak);

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
     * @notice Record a guestbook signature (called by Hub)
     */
    function recordSignature(
        address signer,
        address guestbookOwner
    ) external onlyUpdater {
        // Initialize new user
        if (userStats[signer].lastActionTime == 0) {
            totalUsers++;
        }

        // Update signer stats
        userStats[signer].actionsCount++;
        userStats[signer].signaturesGiven++;
        userStats[signer].totalPoints += SIGN_POINTS;
        
        // Check and update streak
        _updateStreak(signer);

        emit PointsEarned(signer, SIGN_POINTS, "Signed guestbook");

        // Update guestbook owner stats
        if (guestbookOwner != signer) {
            if (userStats[guestbookOwner].lastActionTime == 0) {
                totalUsers++;
            }
            userStats[guestbookOwner].signaturesReceived++;
            userStats[guestbookOwner].totalPoints += RECEIVE_SIGN_POINTS;
            
            emit PointsEarned(guestbookOwner, RECEIVE_SIGN_POINTS, "Received signature");
        }
    }

    /**
     * @notice Update user streak
     */
    function _updateStreak(address user) internal {
        UserStats storage stats = userStats[user];
        
        uint256 lastAction = stats.lastActionTime;
        uint256 currentTime = block.timestamp;
        
        if (lastAction == 0) {
            // First action
            stats.currentStreak = 1;
        } else {
            uint256 daysSinceLastAction = (currentTime - lastAction) / 1 days;
            
            if (daysSinceLastAction == 0) {
                // Same day, no change
            } else if (daysSinceLastAction == 1) {
                // Consecutive day
                stats.currentStreak++;
                stats.totalPoints += STREAK_BONUS * stats.currentStreak;
                emit PointsEarned(user, STREAK_BONUS * stats.currentStreak, "Streak bonus");
            } else {
                // Streak broken
                stats.currentStreak = 1;
            }
        }

        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }

        stats.lastActionTime = currentTime;

        emit StatsUpdated(user, stats.totalPoints, stats.currentStreak);
    }

    /**
     * @notice Get user stats
     */
    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }

    /**
     * @notice Add bonus points (for special events)
     */
    function addBonusPoints(
        address user,
        uint256 points,
        string calldata reason
    ) external onlyUpdater {
        userStats[user].totalPoints += points;
        emit PointsEarned(user, points, reason);
    }
}
