pragma solidity 0.4.24;

import "./util/SignatureLib.sol";
import "./interface/ERC20.sol";

contract ERC20SignPayments {
    /** Libraries */
    using SignatureLib for bytes;

    /** Fields */
    address public erc20Address;
    address public owner;
    mapping(uint256 => bool) public usedNonces;

    /** Events */
    event TokensTransfered (
        address indexed signer,
        address indexed recipient,
        uint256 nonce,
        uint256 amount
    );

    /** Modifiers */

    /** Functions */
    constructor (address _erc20Address) public {
        erc20Address = _erc20Address;
        owner = msg.sender;
    }

    function getERC20()
        internal
        view
        returns (ERC20 _erc20Instance)
    {
        return ERC20(erc20Address);
    }

    function getSigner(bytes _signature, uint256 _amountOfTokens, uint256 _nonce)
        internal
        view
        returns (address _signer)
    {
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _amountOfTokens, _nonce, address(this)));
        return _signature.ecrecover1(messageHash);
    }

    function claimTokens(bytes _signature, uint256 _amountOfTokens, uint256 _nonce)
        public
    {
        require(!usedNonces[_nonce], "Nonce was used previously.");

        address signer = getSigner(_signature, _amountOfTokens, _nonce);
        require(signer == owner, "The signer must be the owner of this contract.");

        ERC20 erc20 = getERC20();
        uint256 signerBalance = erc20.balanceOf(signer);
        require(signerBalance >= _amountOfTokens, "Signer balance has not enough tokens.");
        
        usedNonces[_nonce] = true;

        erc20.transferFrom(signer, msg.sender, _amountOfTokens);

        emit TokensTransfered(
            signer,
            msg.sender,
            _nonce,
            _amountOfTokens
        );
    }
}