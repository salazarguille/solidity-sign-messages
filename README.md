<h1 align="center">
<br>
Solidity Sign Messages
<br>
</h1>

## Get Started

* Download truffle v4.1.13 or up from [here](https://github.com/trufflesuite/truffle/releases)

```
npm install -g truffle
```
* Execute in the root folder
```
npm install
```
* Execute the test cases executing:
```
truffle test
```
## How do I get set up?

#### Working with Truffle

cd into your working directory.
From there, you can run truffle compile, truffle migrate and truffle test to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

#### How to run tests

In order to can run the tests with Truffle, execute the below command in your project root folder:

```
truffle test
```

## Libraries Details

### HashLib

#### getSigner(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns (address _signer)
Returns an address which represents the hash signer.

Arguments:

 - _hash The hash to get its signer address.
 - _v The V part from the signature.
 - _r The R part from the signature.
 - _s The S part from the signature.

Returns the hash signer address.

#### function getSignerByAssembly(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _s) internal view returns (address _signer)
Returns an address which represents the hash signer. This operation works with assembly code.

Arguments:

 - _hash The hash to get its signer address.
 - _v The V part from the signature.
 - _r The R part from the signature.
 - _s The S part from the signature.

Returns the hash signer address.

### SignatureLib

#### function splitSignature(bytes signature) internal pure returns (uint8, bytes32, bytes32)
Split a signature into V, R and S components.

Arguments:
 - signature The signature to get its components.

Returns The V, R, and S components.

#### function checkSplitSignature(bytes _signature, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns (bool)

Checks whether the signature matches with the V, R, and S components.

Arguments:
 - _signature The signature to check its components
 - _v The V component to be checked.
 - _r The R component to be checked.
 - _s The S component to be checked.

Returns true if the validation is passed ok.

#### function ecrecover1(bytes _signature, bytes32 _msgHash) internal pure returns(address _signer)

Gets the signer address for a signature and a hashed message.

Arguments:
 - _signature The signature used to get the signer address.
 - _msgHash The hashed message used to get the signer address.

## Smart Contract Details

### SignPayments

#### function claimPayment(bytes _signature, uint256 _amount, uint256 _nonce) public

Claims a payment with a specific amount and nonce.

Arguments:
 - _signature The signature created by the owner.
 - _amount The amount that the owner allows a user to be transferred.
 - _nonce A random value to be validated before processing the transfer.

The nonce value is used as a validation to avoid a recipient can transfer more than once the amount allowed.

The TransferSent event is emitted when the transfer is done successfully.

### ERC20SignPayments

#### function claimTokens(bytes _signature, uint256 _amountOfTokens, uint256 _nonce) public

Claims a tokens transfer based on a hashed message by the tokens' owner.

Arguments:
 - _signature The signature to be validated.
 - _amountOfTokens The amount of tokens to be transferred.
 - _nonce A random value to be validated before processing the transfer.

The nonce value is used as a validation to avoid a recipient can transfer more than once the amount allowed.

The TokensTransfered event is emitted when the transfer is done successfully.

### Mocks and Other Smart Contracts

  This project uses some external smart contracts from OpenZeppelin.

 - contracts/interface/ERC20.sol
 - contracts/interface/ERC20Basic.sol
 - contracts/mock/BasicToken.sol
 - contracts/mock/StandardToken.sol
 - contracts/mock/StandardTokenMock.sol
 - contracts/util/SafeMath.sol

 You can take the latest version from thie URL below:

https://github.com/OpenZeppelin/openzeppelin-solidity


### Use Cases

#### SignatureLib Library
    
    contract SignatureSmartContract {
        using SignatureLib for bytes;

        function splitSignature(bytes sig)
            public
            pure
            returns (uint8 _v, bytes32 _r, bytes32 _s)
        {
            return sig.splitSignature();
        }
    }

#### HashLib Library
    
    contract HashSmartContract {
        using HashLib for bytes32;

        function getSigner(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s)
            public
            pure
            returns (address _signer)
        {
            return msgHash.getSigner(v, r, s);
        }
    }

## Do you want to contact me?

You can send me an email to ```guillesalazar@gmail.com```.