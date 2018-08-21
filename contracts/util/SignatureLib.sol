pragma solidity 0.4.24;

/*
 * @title This library is used to work with signatures, and V, R, and S values.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
library SignatureLib {

    bytes constant private SIGNED_MESSAGE_PREFIX = "\x19Ethereum Signed Message:\n32";

    function splitSignature(bytes signature)
        internal
        pure
        returns (uint8, bytes32, bytes32)
    {
        require(signature.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(signature, 32))
            // second 32 bytes
            s := mload(add(signature, 64))
            // final byte (first byte of the next 32 bytes)
            //v := byte(0, mload(add(signature, 96)))
            v := and(mload(add(signature, 65)), 255)
        }

        // https://github.com/ethereum/go-ethereum/issues/2053
        if (v < 27) {
            v += 27;
        }
        return (v, r, s);
    }

    function checkSplitSignature(bytes _signature, uint8 _v, bytes32 _r, bytes32 _s)
        internal
        pure
        returns (bool _isValid)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(_signature);
        require(v == _v, "V part is not equal to expected.");
        require(r == _r, "R part is not equal to expected.");
        require(s == _s, "S part is not equal to expected.");
        return true;
    }

    function ecrecover1(bytes _signature, bytes32 _msgHash)
        internal
        pure
        returns(address _signer)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(_signature);

        bytes32 prefixedHash = keccak256(abi.encodePacked(SIGNED_MESSAGE_PREFIX, _msgHash));
        return ecrecover(prefixedHash, v, r, s);
    }
}