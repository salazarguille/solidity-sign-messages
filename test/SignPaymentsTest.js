const _ = require('lodash');
const SignPayments = artifacts.require("./SignPayments.sol")
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

contract('SignPaymentsTest', function(accounts) {

  const owner = accounts[0];
  const recipient = accounts[1];
  const invalidRecipient = accounts[2];

  beforeEach(async function() {
    this.contract = await SignPayments.new({
      from: owner,
      value: web3.toWei(5, 'ether')
    });
  })

  it(t('aRecipient', 'claimPayment', 'Should be able to claim a payment.'), async function() {
    // Setup
    const amount = web3.toWei(0.5, 'ether');
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amount, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);
    const initialRecipientBalance = await web3.eth.getBalance(recipient);
    const initialContractBalance = await web3.eth.getBalance(this.contract.address);

    // Invocation
    const result = await this.contract.claimPayment(signature, amount, nonce, {from: recipient});

    // Assertions
    assert(result);
    await assertEvent(
      this.contract,
      {
        event: "TransferSent",
        args: {
          recipient: recipient
        }
      },
      1,
      (log) => {
          const args = log[0].args;
          assert.equal(args.amount, amount);
          assert.equal(args.nonce, nonce);
      }
    )

    const finalRecipientBalance = await web3.eth.getBalance(recipient);
    const finalContractBalance = await web3.eth.getBalance(this.contract.address);

    initialContractBalance.should.be.bignumber.equal(new BigNumber(finalContractBalance).add(amount));
    initialRecipientBalance.should.be.bignumber.lessThan(new BigNumber(finalRecipientBalance));
  });

  it(t('aRecipient', 'claimPayment', 'Should not be able to claim a payment higher than contract balance.', true), async function() {
    // Setup
    const amount = web3.toWei(5.1, 'ether');
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amount, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);
    const initialRecipientBalance = await web3.eth.getBalance(recipient);
    const initialContractBalance = await web3.eth.getBalance(this.contract.address);

    // Invocation
    try {
      await this.contract.claimPayment(signature, amount, nonce, {from: recipient});

      // Assertions
      assert(false, "It should have failed because contract has not enough balance.");
    } catch (error) {
        // Assertions
        assert(error);
        assert(error.message.includes("revert"));
    }
  });

  it(t('aRecipient', 'claimPayment', 'Should not be able to claim a payment twice.', true), async function() {
    // Setup
    const amount = web3.toWei(0.5, 'ether');
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amount, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);
    const initialRecipientBalance = await web3.eth.getBalance(recipient);
    const initialContractBalance = await web3.eth.getBalance(this.contract.address);

    await this.contract.claimPayment(signature, amount, nonce, {from: recipient});
    
    try {
      // Invocation
      await this.contract.claimPayment(signature, amount, nonce, {from: recipient});

      // Assertions
      assert(false, 'It should have failed because payment was claimed.');
    } catch (error) {
        // Assertions
        assert(error);
        assert(error.message.includes("revert"));
    }
  });

  it(t('aInvalidRecipient', 'claimPayment', 'Should not be able to claim a payment.', true), async function() {
    // Setup
    const amount = web3.toWei(5.1, 'ether');
    const nonce = 10;
    const messagetoSign = await config.web3.utils.soliditySha3(recipient, amount, nonce, this.contract.address);    
    const signature = await web3.eth.sign(owner, messagetoSign);
    const initialInvalidRecipientBalance = await web3.eth.getBalance(invalidRecipient);

    // Invocation
    try {
      await this.contract.claimPayment(signature, amount, nonce, {from: invalidRecipient});

      // Assertions
      assert(false, "It should have failed because contract has not enough balance.");
    } catch (error) {
        // Assertions
        assert(error);
        assert(error.message.includes("revert"));
    }
  });
})
