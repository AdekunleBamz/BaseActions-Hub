// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Guestbook
 * @notice On-chain guestbook where users can sign with messages
 */
contract Guestbook is Ownable {
    struct Signature {
        address signer;
        string message;
        uint256 timestamp;
    }

    // Guestbook owner => array of signatures
    mapping(address => Signature[]) public guestbooks;
    
    // Total signatures per guestbook
    mapping(address => uint256) public signatureCount;
    
    // Total signatures globally
    uint256 public totalSignatures;

    event Signed(
        address indexed guestbookOwner,
        address indexed signer,
        string message,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

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
    ) external {
        require(bytes(message).length > 0, "Message required");
        require(bytes(message).length <= 280, "Message too long");

        guestbooks[guestbookOwner].push(Signature({
            signer: signer,
            message: message,
            timestamp: block.timestamp
        }));

        signatureCount[guestbookOwner]++;
        totalSignatures++;

        emit Signed(guestbookOwner, signer, message, block.timestamp);
    }

    /**
     * @notice Get signatures for a guestbook
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
}
