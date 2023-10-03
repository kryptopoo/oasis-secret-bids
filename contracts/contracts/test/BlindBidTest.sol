// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {BaseBlindBid} from "../BaseBlindBid.sol";

contract BlindBidTest is BaseBlindBid {
    constructor(uint256 auctionId, address auctioneer, uint256 startTime, uint256 endTime, uint256 reservePrice) {
        _createBid(auctionId, auctioneer, startTime, endTime, reservePrice);
    }

    function _postMessage(bytes memory _method, bytes memory _message) internal virtual override {}

    // mock for testing
    function _encryptBid(
        bytes32 symmetricKey,
        uint256 bid
    ) internal view virtual override returns (bytes memory encryptedBid, bytes memory nonce) {
        // bytes32 test = bytes32(0);
        nonce = abi.encodePacked(bytes32(0));
        encryptedBid = _toBytes(bid);
    }

    // mock for testing
    function _decryptBid(
        bytes32 symmetricKey,
        bytes32 nonce,
        bytes memory encryptedBid
    ) internal view virtual override returns (uint256 bid) {
        bid = uint256(bytes32(encryptedBid));
    }

    // public for testing
    function getHighestBid(uint256 auctionId) external view returns (address bidder, uint256 bid) {
        return _getHighestBid(auctionId);
    }
}
