// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Leaderboard V2
 * @notice Tracks user points, rankings, referrals, and periodic snapshots
 * @dev Enhanced with multiplier events and referral system
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
        uint256 lastActionDay;     // Day number for streak tracking
        uint256 referralPoints;    // Points from referrals
        uint256 referralCount;     // Number of referrals
        address referrer;          // Who referred this user
    }

    // User => Stats
    mapping(address => UserStats) public userStats;
    
    // Weekly snapshots: week number => user => points
    mapping(uint256 => mapping(address => uint256)) public weeklyPoints;
    
    // Monthly snapshots: month number => user => points
    mapping(uint256 => mapping(address => uint256)) public monthlyPoints;
    
    // Total users
    uint256 public totalUsers;
    
    // Total points awarded
    uint256 public totalPointsAwarded;
    
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
    event WeeklySnapshot(uint256 indexed weekNumber, address indexed user, uint256 points);
    event MonthlySnapshot(uint256 indexed monthNumber, address indexed user, uint256 points);

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
        
        // Award referral bonuses with multiplier
        uint256 referrerPoints = applyMultiplier(REFERRER_BONUS);
        uint256 refereePoints = applyMultiplier(REFERRAL_BONUS);
        
        userStats[referrer].referralPoints += referrerPoints;
        userStats[referrer].totalPoints += referrerPoints;
        totalPointsAwarded += referrerPoints;
        
        userStats[referee].referralPoints += refereePoints;
        userStats[referee].totalPoints += refereePoints;
        totalPointsAwarded += refereePoints;
        
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
        totalPointsAwarded += signPoints;
        
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
            totalPointsAwarded += receivePoints;
            
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
        
        emit WeeklySnapshot(currentWeek, user, weeklyPoints[currentWeek][user]);
        emit MonthlySnapshot(currentMonth, user, monthlyPoints[currentMonth][user]);
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
            totalPointsAwarded += streakBonus;
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
     * @notice Get user stats (legacy interface)
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
     * @notice Get historical weekly points
     */
    function getWeeklyPointsHistory(address user, uint256 weekNumber) external view returns (uint256) {
        return weeklyPoints[weekNumber][user];
    }

    /**
     * @notice Get historical monthly points
     */
    function getMonthlyPointsHistory(address user, uint256 monthNumber) external view returns (uint256) {
        return monthlyPoints[monthNumber][user];
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
        totalPointsAwarded += bonusPoints;
        _updateSnapshots(user, bonusPoints);
        emit PointsEarned(user, bonusPoints, reason);
    }
}
