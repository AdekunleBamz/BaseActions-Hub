// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BadgeNFT
 * @notice NFT badges awarded for actions
 */
contract BadgeNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    enum BadgeType { SIGNER, SUPPORTER, STREAK_3, STREAK_7, STREAK_30 }

    struct Badge {
        BadgeType badgeType;
        address recipient;
        uint256 timestamp;
    }

    // Token ID => Badge data
    mapping(uint256 => Badge) public badges;
    
    // User => BadgeType => has badge
    mapping(address => mapping(BadgeType => bool)) public hasBadge;
    
    // User => total badges
    mapping(address => uint256) public userBadgeCount;

    // Authorized minters (Hub contract)
    mapping(address => bool) public minters;

    string private _baseTokenURI;

    event BadgeMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        BadgeType badgeType
    );

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC721("BaseActions Badge", "BADGE") Ownable(msg.sender) {
        _baseTokenURI = "https://baseactions.vercel.app/api/badge/";
    }

    /**
     * @notice Set minter authorization
     */
    function setMinter(address minter, bool authorized) external onlyOwner {
        minters[minter] = authorized;
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
            return 0;
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(recipient, tokenId);

        badges[tokenId] = Badge({
            badgeType: badgeType,
            recipient: recipient,
            timestamp: block.timestamp
        });

        hasBadge[recipient][badgeType] = true;
        userBadgeCount[recipient]++;

        emit BadgeMinted(recipient, tokenId, badgeType);

        return tokenId;
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

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
