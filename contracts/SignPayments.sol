pragma solidity 0.4.24;

import "./util/SignatureLib.sol";

/*
 * @title This contract is used to check signed message and transfer ETH to authorized addresses.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
contract SignPayments {
    /** Libraries */
    using SignatureLib for bytes;

    /** Fields */
    address public owner;
    mapping(uint256 => bool) public usedNonces;

    /** Events */

    /**
        @dev This event is emitted when a recipient claims a payment.
     */
    event TransferSent (
        address indexed recipient,
        uint256 nonce,
        uint256 amount
    );

    /** Modifiers */

    /** Functions */
    constructor () public payable {
        owner = msg.sender;
    }

    /**
        @dev It allows an address to claim a payment secured by a signature. The function checks the signature, amount and nonce.
     */
    function claimPayment(bytes _signature, uint256 _amount, uint256 _nonce)
        public
    {
        require(address(this).balance >= _amount, "Contract has not enough balance.");
        require(!usedNonces[_nonce], "Nonce was used previously.");
        usedNonces[_nonce] = true;

        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _amount, _nonce, address(this)));
        address signer = _signature.ecrecover1(messageHash);

        require(signer == owner);

        msg.sender.transfer(_amount);

        emit TransferSent(
            msg.sender,
            _nonce,
            _amount
        );
    }
}