// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Host, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";
import {BaseBlindAuction} from "./BaseBlindAuction.sol";

contract BlindAuction is BaseBlindAuction, Host {
    constructor(address bidAddress) Host(bidAddress) {
        registerEndpoint("bidClosed", _oplBidClosed);
    }

    function estimateMsgFee(uint256 _msgLen) public view returns (uint256) {
        return estimateFee(_msgLen);
    }

    function _postMessage(bytes memory _method, bytes memory _message) internal virtual override {
        postMessage(_method, _message);
    }

    function _oplBidClosed(bytes calldata args) internal returns (Result) {
        (uint256 auctionId, address highestBidder, uint256 highestBid) = abi.decode(args, (uint256, address, uint256));

        _closeAuction(auctionId, highestBidder, highestBid);

        return Result.Success;
    }
}
