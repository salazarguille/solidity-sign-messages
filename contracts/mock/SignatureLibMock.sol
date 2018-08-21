pragma solidity 0.4.24;

import "../util/SignatureLib.sol";

contract SignatureLibMock {
    using SignatureLib for bytes;

    function splitSignature(bytes sig)
        public
        pure
        returns (uint8 _v, bytes32 _r, bytes32 _s)
    {
        return sig.splitSignature();
    }

    function checkSplitSignature(bytes _signature, uint8 _v, bytes32 _r, bytes32 _s)
        public
        pure
        returns (bool _isValid)
    {
        return _signature.checkSplitSignature(_v, _r, _s);
    }

    function getSignerByHash(bytes _signature, bytes32 _msgHash)
        public
        pure
        returns (address _signer)
    {
        return _signature.ecrecover1(_msgHash);
    }
}