// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Enclave, Result, autoswitch} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";
import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";
import {BaseBlindBid} from "./BaseBlindBid.sol";

contract BlindBid is BaseBlindBid, Enclave {
    constructor(address auctionAddress, bytes32 networkName) Enclave(auctionAddress, autoswitch(networkName)) {
        registerEndpoint("createBid", _oplCreateBid);
    }

    function estimateMsgFee(uint256 _msgLen) public view returns (uint256) {
        return estimateFee(_msgLen);
    }

    function _oplCreateBid(bytes calldata args) internal returns (Result) {
        (uint256 auctionId, address auctioneer, uint256 startTime, uint256 endTime, uint256 reservePrice) = abi.decode(
            args,
            (uint256, address, uint256, uint256, uint256)
        );
        _createBid(auctionId, auctioneer, startTime, endTime, reservePrice);

        return Result.Success;
    }

    function _postMessage(bytes memory _method, bytes memory _message) internal virtual override {
        postMessage(_method, _message);
    }

    function _generateSymmetricKey() internal view virtual override returns (bytes32 symmetricKey) {
        bytes memory randomPad = Sapphire.randomBytes(32, "");
        (Sapphire.Curve25519PublicKey publicKey, Sapphire.Curve25519SecretKey secretKey) = Sapphire
            .generateCurve25519KeyPair(randomPad);
        symmetricKey = Sapphire.deriveSymmetricKey(publicKey, secretKey);
    }

    function _encryptBid(
        bytes32 symmetricKey,
        uint256 bid
    ) internal view virtual override returns (bytes memory encryptedBid, bytes memory nonce) {
        nonce = Sapphire.randomBytes(32, "");
        encryptedBid = Sapphire.encrypt(symmetricKey, bytes32(nonce), _toBytes(bid), "");
    }

    function _decryptBid(
        bytes32 symmetricKey,
        bytes32 nonce,
        bytes memory encryptedBid
    ) internal view virtual override returns (uint256 bid) {
        bytes memory decryptedBid = Sapphire.decrypt(symmetricKey, nonce, encryptedBid, "");
        bid = uint256(bytes32(decryptedBid));
    }
}
