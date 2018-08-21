const Web3 = require("web3");
const web3 = new Web3();

module.exports = {
  /**
   * @dev see: http://solidity.readthedocs.io/en/v0.4.24/using-the-compiler.html
   */
  solc: {
      optimizer: {
          enabled: true,
          runs: 200
      }
  },
  mocha: {
    timeout: 100000,
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 21
    }
  },
  web3: Web3,
  networks : {
    geth: {
      host: "localhost",
      port: 8045,
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
