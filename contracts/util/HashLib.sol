pragma solidity 0.4.24;

/**
 * @dev This library is used to get signer messages based on a hashed message and V, R, and S values.
 * @dev This library uses the ecrecover(...) function.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
library HashLib {

    bytes constant private SIGNED_MESSAGE_PREFIX = "\x19Ethereum Signed Message:\n32";

    function getSigner(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _s)
        internal
        pure
        returns (address _signer)
    {
        bytes32 prefixedHash = keccak256(abi.encodePacked(SIGNED_MESSAGE_PREFIX, _hash));
        return ecrecover(prefixedHash, _v, _r, _s);
    }
 
    function getSignerByAssembly(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _s)
        internal
        view
        returns (address _signer)
    {
        bool ret;
        address addr;

        assembly {
            let size := mload(0x40)
            mstore(size, _hash)
            mstore(add(size, 32), _v)
            mstore(add(size, 64), _r)
            mstore(add(size, 96), _s)
            ret := call(3000, 1, 0, size, 128, size, 32)
            addr := mload(size)
        }
        return addr;
    }

}