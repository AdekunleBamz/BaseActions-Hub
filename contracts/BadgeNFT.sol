// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BadgeNFT V2
 * @notice NFT badges with rarity levels and soulbound option
 * @dev Extended with new badge types and rarity system
 */
contract BadgeNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    // Extended badge types with rarity
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

        // Check for collector badge (5+ badges)
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
     * @notice Get badges by rarity for a user
     */
    function getUserBadgesByRarity(address user, Rarity rarity) external view returns (Badge[] memory) {
        uint256 count = 0;
        
        // First, count matching badges
        for (uint256 i = 0; i < 10; i++) {
            BadgeType bt = BadgeType(i);
            if (hasBadge[user][bt] && badgeRarity[bt] == rarity) {
                count++;
            }
        }
        
        Badge[] memory result = new Badge[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < 10; i++) {
            BadgeType bt = BadgeType(i);
            if (hasBadge[user][bt] && badgeRarity[bt] == rarity) {
                uint256 tokenId = userBadgeTokenId[user][bt];
                result[index] = badges[tokenId];
                index++;
            }
        }
        
        return result;
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
