// Config
const config = require("../truffle");
const {initialMessage} = require('./util/deployUtil');

// Json File
const jsonfile = require('jsonfile');
const contractsJson = './build/contracts.json';

// Libraries
const HashLib = artifacts.require("./util/HashLib.sol");
const SignatureLib = artifacts.require("./util/SignatureLib.sol");
const SafeMath = artifacts.require("./util/SafeMath.sol");

// Smart Contracts
const HashLibMock = artifacts.require("./mock/HashLibMock.sol");
const SignatureLibMock = artifacts.require("./mock/SignatureLibMock.sol");
const SignPayments = artifacts.require("./SignPayments.sol");
const ERC20SignPayments = artifacts.require("./ERC20SignPayments.sol");

// Mocks
const StandardTokenMock = artifacts.require("./mock/StandardTokenMock.sol");

const contracts = [];

const addContractInfo = (name, address) => {
    console.log(`Deploy contract '${name.padEnd(20)}' at '${address}'.`);
    contracts.push(
        {
            "address": address,
            "contractName": name
        }
    );
};

const networksForMocks = ["test", "_development"];

module.exports = function(deployer, network, accounts) {

    if(accounts.length < 1) {
        throw new Error(`The deployment needs at least 1 account. Actual accounts ${accounts.length}.`);
    }

    const owner = accounts[0];
    const initialTokensAmount = 1000000000;

    const deployMocks = networksForMocks.indexOf(network) > -1;
    const accountTypes = [{
        type: 'Owner',
        address: accounts[0]
    }];

    initialMessage(network, accountTypes);

    return deployer.deploy(
        SignPayments,
        {
            from: owner,
            value: config.web3.utils.toWei("5", 'ether')
        }
    ).then(async () => {
        addContractInfo("SignPayments", SignPayments.address);

        await deployer.deploy(StandardTokenMock, owner, initialTokensAmount);
        addContractInfo("StandardTokenMock", StandardTokenMock.address);

        await deployer.deploy(HashLib);
        addContractInfo("HashLib", HashLib.address);
        await deployer.deploy(SignatureLib);
        addContractInfo("SignatureLib", SignatureLib.address);

        await deployer.link(HashLib, HashLibMock);
        await deployer.deploy(HashLibMock);
        addContractInfo("HashLibMock", HashLibMock.address);

        await deployer.link(SignatureLib, SignatureLibMock);
        await deployer.deploy(SignatureLibMock);
        addContractInfo("SignatureLibMock", SignatureLibMock.address);



        await deployer.link(SignatureLib, ERC20SignPayments);
        await deployer.deploy(ERC20SignPayments, StandardTokenMock.address);
        addContractInfo("ERC20SignPayments", ERC20SignPayments.address);

        try {
            jsonfile.writeFile(contractsJson, contracts, {spaces: 2, EOL: '\r\n'}, function (err) {
                console.log(`JSON file created at '${contractsJson}'.`);
                console.error("Errors: " + err);
            });

        } catch (error) {
            console.error("Error on deploy: ", error);
            throw new Error(error);
        }
        return deployer;
    });
};
