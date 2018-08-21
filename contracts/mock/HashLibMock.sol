pragma solidity 0.4.24;

import "../util/HashLib.sol";

contract HashLibMock {
    using HashLib for bytes32;

    function getSigner(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s)
        public
        pure
        returns (address _signer)
    {
        return msgHash.getSigner(v, r, s);
    }

    function getSignerByAssembly(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s)
        public
        view
        returns (address)
    {
        return msgHash.getSignerByAssembly(v, r, s);
    }
}