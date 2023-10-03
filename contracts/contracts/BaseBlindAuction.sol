// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Host, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract BaseBlindAuction {
    error InvalidHighestBidPrice();
    error InvalidAuctionId();
    error InvalidHighestBidder();
    error AuctionNotClosed();

    struct Auction {
        uint256 id;
        string name;
        address auctioneer;
        address tokenAddress;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
        uint256 reservePrice;
        address highestBidder;
        uint256 highestBid;
        bool closed;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCount;

    function create(
        address tokenAddress,
        uint256 tokenId,
        string memory name,
        uint256 startTime,
        uint256 endTime,
        uint256 reservePrice
    ) external payable returns (uint256) {
        auctionCount++;
        uint256 auctionId = auctionCount;

        // TODO: validate

        Auction storage auction = auctions[auctionId];
        auction.id = auctionId;
        auction.name = name;
        auction.auctioneer = msg.sender;
        auction.tokenAddress = tokenAddress;
        auction.tokenId = tokenId;
        auction.startTime = startTime;
        auction.endTime = endTime;
        auction.reservePrice = reservePrice;
        auction.closed = false;

        // Reverts if msg.sender does not hold the token.
        ERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);

        _postMessage("createBid", abi.encode(auctionId, msg.sender, startTime, endTime, reservePrice));

        return auctionId;
    }

    function claim(uint256 auctionId) external payable {
        // validate
        if (auctionId > auctionCount) revert InvalidAuctionId();
        Auction memory auction = auctions[auctionId];

        // only allow claiming when auction closed
        if (!auction.closed) revert AuctionNotClosed();

        // found winner
        if (auction.highestBidder != address(0)) {
            if (msg.value != auction.highestBid) revert InvalidHighestBidPrice();
            if (msg.sender != auction.highestBidder) revert InvalidHighestBidder();

            // Transfer auctioned asset to highest bidder.
            ERC721(auction.tokenAddress).transferFrom(address(this), auction.highestBidder, auction.tokenId);
        } else {
            // no found winner, auctioneer can withdraw
            if (msg.sender == auction.auctioneer) {
                ERC721(auction.tokenAddress).transferFrom(address(this), auction.auctioneer, auction.tokenId);
            }
        }
    }

    function _closeAuction(uint256 auctionId, address highestBidder, uint256 highestBid) internal virtual {
        Auction storage auction = auctions[auctionId];
        auction.highestBidder = highestBidder;
        auction.highestBid = highestBid;
        auction.closed = true;
    }

    function _postMessage(bytes memory _method, bytes memory _message) internal virtual;
}
