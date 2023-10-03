// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {BaseBlindAuction} from "../BaseBlindAuction.sol";

contract BlindAuctionTest is BaseBlindAuction {
    function _postMessage(bytes memory _method, bytes memory _message) internal virtual override {}

    // simulate to close auction
    function close(uint256 auctionId, address highestBidder, uint256 highestBid) external {
        _closeAuction(auctionId, highestBidder, highestBid);
    }
}
