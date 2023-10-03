// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract SapphireTest {
    constructor() {}

    function deriveSymmetricKey(
        Sapphire.Curve25519PublicKey publicKey,
        Sapphire.Curve25519SecretKey privateKey
    ) public view returns (bytes32) {
        return Sapphire.deriveSymmetricKey(publicKey, privateKey);
    }

    function randomBytes(uint256 numBytes) public view returns (bytes memory) {
        bytes memory randomPad = Sapphire.randomBytes(numBytes, "");
        return randomPad;
    }

    function generateCurve25519KeyPair(
        bytes memory pers
    ) public view returns (Sapphire.Curve25519PublicKey pk, Sapphire.Curve25519SecretKey sk) {
        return Sapphire.generateCurve25519KeyPair(pers);
    }

    function encrypt(
        bytes32 key,
        bytes32 nonce,
        bytes memory plaintext,
        bytes memory additionalData
    ) public view returns (bytes memory) {
        return Sapphire.encrypt(key, nonce, plaintext, additionalData);
    }

    function decrypt(
        bytes32 key,
        bytes32 nonce,
        bytes memory ciphertext,
        bytes memory additionalData
    ) public view returns (bytes memory) {
        return Sapphire.decrypt(key, nonce, ciphertext, additionalData);
    }

    function generateSigningKeyPair(
        Sapphire.SigningAlg alg,
        bytes memory seed
    ) public view returns (bytes memory publicKey, bytes memory secretKey) {
        return Sapphire.generateSigningKeyPair(alg, seed);
    }

    function sign(
        Sapphire.SigningAlg alg,
        bytes memory secretKey,
        bytes memory contextOrHash,
        bytes memory message
    ) public view returns (bytes memory signature) {
        return Sapphire.sign(alg, secretKey, contextOrHash, message);
    }

    function verify(
        Sapphire.SigningAlg alg,
        bytes memory publicKey,
        bytes memory contextOrHash,
        bytes memory message,
        bytes memory signature
    ) public view returns (bool verified) {
        return Sapphire.verify(alg, publicKey, contextOrHash, message, signature);
    }
}
