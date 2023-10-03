// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {EnumerableMap} from "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

abstract contract BaseBlindBid {
    using EnumerableMap for EnumerableMap.AddressToUintMap;
    error UnderReservePrice();
    error BidClosed();
    error InvalidBiddingTime();
    error InvalidPermission();

    struct AuctionInfo {
        uint256 id;
        address auctioneer;
        uint256 startTime;
        uint256 endTime;
        uint256 reservePrice;
        bool closed;
    }

    struct Bid {
        bytes32 symmetricKey;
        AuctionInfo auction;
        // bidder => bid
        // mapping(address => uint256) commitments;
        EnumerableMap.AddressToUintMap commitments;
    }

    // auctionId -> Bid
    mapping(uint256 => Bid) private _bids;

    // get bid by sender
    function getBid(uint256 auctionId) external view returns (address bidder, uint256 bid) {
        // TODO: handle permission

        bidder = msg.sender;
        bid = _bids[auctionId].commitments.get(msg.sender);
    }

    function getTotalBidders(uint256 auctionId) public view returns (uint256) {
        return _bids[auctionId].commitments.length();
    }

    function encryptBid(
        uint256 auctionId,
        uint256 bid
    ) external view returns (bytes memory encryptedBid, bytes memory nonce) {
        (encryptedBid, nonce) = _encryptBid(_bids[auctionId].symmetricKey, bid);
    }

    function commitBid(uint256 auctionId, bytes calldata encryptedBid, bytes32 nonce) external payable {
        // validation
        if (_bids[auctionId].auction.closed) revert BidClosed();

        // validate bidding time
        if (block.timestamp < _bids[auctionId].auction.startTime) revert InvalidBiddingTime();
        if (block.timestamp > _bids[auctionId].auction.endTime) revert InvalidBiddingTime();

        // decrypt
        uint256 bid = _decryptBid(_bids[auctionId].symmetricKey, nonce, encryptedBid);
        if (_bids[auctionId].auction.reservePrice > bid) revert UnderReservePrice();

        // add bid commitment
        _bids[auctionId].commitments.set(msg.sender, bid);
    }

    function closeBid(uint256 auctionId) external payable {
        // validation
        // only auctioneer can close
        if (_bids[auctionId].auction.auctioneer != msg.sender) revert InvalidPermission();

        // close bid
        _bids[auctionId].auction.closed = true;

        // find highest Bidder
        (address highestBidder, uint256 highestBid) = _getHighestBid(auctionId);

        _postMessage("bidClosed", abi.encode(auctionId, highestBidder, highestBid));
    }

    function _postMessage(bytes memory _method, bytes memory _message) internal virtual;

    function _createBid(
        uint256 auctionId,
        address auctioneer,
        uint256 startTime,
        uint256 endTime,
        uint256 reservePrice
    ) internal virtual {
        // gen symmetricKey
        bytes32 symmetricKey = _generateSymmetricKey();

        // init
        Bid storage bid = _bids[auctionId];
        bid.auction.id = auctionId;
        bid.auction.auctioneer = auctioneer;
        bid.auction.startTime = startTime;
        bid.auction.endTime = endTime;
        bid.auction.reservePrice = reservePrice;
        bid.symmetricKey = symmetricKey;
    }

    function _generateSymmetricKey() internal view virtual returns (bytes32 symmetricKey) {}

    function _encryptBid(
        bytes32 symmetricKey,
        uint256 bid
    ) internal view virtual returns (bytes memory encryptedBid, bytes memory nonce) {}

    function _decryptBid(
        bytes32 symmetricKey,
        bytes32 nonce,
        bytes memory encryptedBid
    ) internal view virtual returns (uint256 bid) {}

    function _toBytes(uint256 num) internal pure returns (bytes memory b) {
        b = new bytes(32);
        assembly {
            mstore(add(b, 32), num)
        }
    }

    function _getHighestBid(uint256 auctionId) internal view returns (address bidder, uint256 bid) {
        uint256 highestBid = 0;
        for (uint256 i = 0; i < _bids[auctionId].commitments.length(); i++) {
            (address _bidder, uint256 _bid) = _bids[auctionId].commitments.at(i);
            if (_bid > highestBid) {
                highestBid = _bid;

                bidder = _bidder;
                bid = _bid;
            }
        }
    }
}
