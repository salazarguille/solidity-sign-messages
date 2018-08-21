const _ = require('lodash');
const StandardTokenMock = artifacts.require("./mock/StandardTokenMock.sol");
const ERC20SignPayments = artifacts.require("./ERC20SignPayments.sol");
const config = require("../truffle");
const t = require('./utils/TestUtil').title;

const {
  splitSignature
} = require('./utils/signatureUtil');
const {
  assertEvent,
  emptyCallback
} = require('./utils/utils');

const BigNumber = web3.BigNumber
const should = require('chai').use(require('chai-bignumber')(BigNumber)).should();


contract('ERC20SignPaymentsTest', function(accounts) {

  let token;
  const owner = accounts[0];
  const recipient = accounts[1];
  const invalidRecipient = accounts[2];

  beforeEach(async function() {
    token = await StandardTokenMock.deployed();
    this.contract = await ERC20SignPayments.new(token.address);
  })

  it(t('aRecipient', 'claimTokens', 'Should be able to claim tokens.'), async function() {
    // Setup
    const amountOfTokens = 200;
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amountOfTokens, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);

    const initialOwnerBalance = await token.balanceOf(owner);

    await token.approve(this.contract.address, amountOfTokens, {from: owner});

    // Invocation
    const result = await this.contract.claimTokens(signature, amountOfTokens, nonce, {from: recipient});

    // Assertions
    assert(result);

    await assertEvent(
      this.contract,
      {
        event: "TokensTransfered",
        args: {
          signer: owner,
          recipient: recipient
        }
      },
      1,
      (log) => {
          const args = log[0].args;
          assert.equal(args.amount, amountOfTokens);
          assert.equal(args.nonce, nonce);
      }
    );

    const contractBalance = await token.balanceOf(this.contract.address);
    contractBalance.should.be.bignumber.equal(new BigNumber(0));

    const recipientBalance = await token.balanceOf(recipient);
    recipientBalance.should.be.bignumber.equal(new BigNumber(amountOfTokens));

    const contractAllowance = await token.allowance(owner, this.contract.address);
    contractAllowance.should.be.bignumber.equal(new BigNumber(0));

    const finalOwnerBalance = await token.balanceOf(owner);
    finalOwnerBalance.should.be.bignumber.equal(new BigNumber(initialOwnerBalance).sub(amountOfTokens));
  });

  it(t('aRecipient', 'claimTokens', 'Should not be able to claim tokens twice.', true), async function() {
    // Setup
    const amountOfTokens = 200;
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amountOfTokens, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);

    const initialOwnerBalance = await token.balanceOf(owner);

    await token.approve(this.contract.address, amountOfTokens, {from: owner});
    await this.contract.claimTokens(signature, amountOfTokens, nonce, {from: recipient});

    // Invocation
    try {
      await this.contract.claimTokens(signature, amountOfTokens, nonce, {from: recipient});

      // Assertions
      assert(false, "It should have failed because signature was processed.");
    } catch (error) {
      // Assertions
      assert(error);
      assert(error.message.includes("revert"));
    }
  });

  it(t('anInvalidRecipient', 'claimTokens', 'Should not be able to claim tokens.', true), async function() {
    // Setup
    const amountOfTokens = 200;
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amountOfTokens, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);

    const initialOwnerBalance = await token.balanceOf(owner);

    await token.approve(this.contract.address, amountOfTokens, {from: owner});

    // Invocation
    try {
      await this.contract.claimTokens(signature, amountOfTokens, nonce, {from: invalidRecipient});

      // Assertions
      assert(false, "It should have failed because recipient is invalid.");
    } catch (error) {
      // Assertions
      assert(error);
      assert(error.message.includes("revert"));
    }
  });
})