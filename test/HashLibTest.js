var HashLibMock = artifacts.require("./mock/HashLibMock.sol")
var ethUtil = require('ethereumjs-util');
const config = require("../truffle");
const t = require('./utils/TestUtil').title;

const {
  splitSignature,
  bufferToHex
} = require('./utils/signatureUtil');
const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('HashLibTest', function(accounts) {

  const signer = accounts[0];
  const recipient = accounts[1];

  beforeEach(async function() {
    this.contract = await HashLibMock.new()
  })

  it(t('aUser', 'getSigner', 'Should be able to get signer from a hash and VRS.'), async function() {
    // Setup
    const messageHashed = await config.web3.utils.soliditySha3('Message to sign here.');
    const signature = await web3.eth.sign(signer, messageHashed);
    const signatureData = splitSignature(signature);

    // Invocation
    const addressResult = await this.contract.getSigner(
      messageHashed,
      signatureData.v,
      signatureData.r,
      signatureData.s
    );
    
    // Assertions
    assert.equal(addressResult, signer);
  });

  it(t('aUser', 'getSignerByAssembly', 'Should be able to get signer from a hash and VRS.'), async function() {
    // Setup
    const message = 'Message to sign here.';
    const messageHex = bufferToHex(message);
    var signature = await web3.eth.sign(signer, messageHex.messageToSign);    
    const signatureData = splitSignature(signature);

    // Invocation
    const recoveredAddress = await this.contract.getSignerByAssembly(
      messageHex.messageToSend,
      signatureData.v,
      signatureData.r,
      signatureData.s
    );

    // Assertions
    recoveredAddress.should.be.equal(signer,'The recovered address should match the signing address')
 })

})
