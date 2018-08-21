var SignatureLibMock = artifacts.require("./mock/SignatureLibMock.sol")
const config = require("../truffle");
const t = require('./utils/TestUtil').title;

const {
  splitSignature
} = require('./utils/signatureUtil');

contract('SignatureLibTest', function(accounts) {

  const owner = accounts[0];
  const recipient = accounts[1];

  beforeEach(async function() {
    this.contract = await SignatureLibMock.new();
  })

  it(t('aUser', 'splitSignature', 'Should be able to get S, R, V from a signature.'), async function() {
    // Setup
    const messageHashed = web3.sha3('Message to sign here.');
    var signature = await web3.eth.sign(owner, messageHashed);
    const signatureData = splitSignature(signature);

    // Invocation
    const vrs = await this.contract.splitSignature(signature);
    
    // Assertions
    const vResult = vrs[0];
    const rResult = vrs[1];
    const sResult = vrs[2];
    assert.equal(vResult, signatureData.v);
    assert.equal(rResult, signatureData.r);
    assert.equal(sResult, signatureData.s);
  });

  it(t('aUser', 'checkSplitSignature', 'Should be able to check if S, R, V are equals.'), async function() {
    // Setup
    const messageHashed = web3.sha3('Message to sign here.');
    const signature = await web3.eth.sign(owner, messageHashed);
    const signatureData = splitSignature(signature);

    // Invocation
    const result = await this.contract.checkSplitSignature(
      signature,
      signatureData.v,
      signatureData.r,
      signatureData.s
    );
    
    // Assertions
    assert(result);
  });

  it(t('aUser', 'getSignerByHash', 'Should be able get the signer address.'), async function() {
    // Setup
    const messageHashed = await config.web3.utils.soliditySha3('Message to sign here.');
    var signature = await web3.eth.sign(owner, messageHashed);

    // Invocation
    const addressResult = await this.contract.getSignerByHash(signature, messageHashed);

    // Assertion
    assert.equal(addressResult, owner);
  });
})
