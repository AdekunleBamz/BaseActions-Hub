// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Guestbook V2
 * @notice On-chain guestbook with reactions and pinned signatures
 * @dev Upgraded with reaction system for signature engagement
 */
contract Guestbook is Ownable, ReentrancyGuard {
    struct Signature {
        address signer;
        string message;
        uint256 timestamp;
        uint256 reactions;      // Reaction count
        bool isPinned;          // Pinned status
        uint256 editedAt;       // Last edit time (0 if never edited)
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
    
    // Total reactions globally
    uint256 public totalReactions;
    
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
    
    event Unreacted(
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

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Set authorized signer (Hub contract)
     */
    function setAuthorizedSigner(address signer, bool authorized) external onlyOwner {
        authorizedSigners[signer] = authorized;
    }

    /**
     * @notice Sign a guestbook (called by Hub)
     * @param guestbookOwner The owner of the guestbook
     * @param signer The person signing
     * @param message The signature message
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
        totalReactions++;

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
        totalReactions--;

        emit Unreacted(
            guestbookOwner,
            signatureIndex,
            msg.sender,
            guestbooks[guestbookOwner][signatureIndex].reactions
        );
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

    /**
     * @notice Check if user has reacted to a signature
     */
    function checkReaction(
        address guestbookOwner,
        uint256 signatureIndex,
        address user
    ) external view returns (bool) {
        return hasReacted[guestbookOwner][signatureIndex][user];
    }

    /**
     * @notice Get reaction count for a signature
     */
    function getReactionCount(
        address guestbookOwner,
        uint256 signatureIndex
    ) external view returns (uint256) {
        require(signatureIndex < guestbooks[guestbookOwner].length, "Invalid index");
        return guestbooks[guestbookOwner][signatureIndex].reactions;
    }
}
