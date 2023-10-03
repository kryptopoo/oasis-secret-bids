require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("hardhat-abi-exporter");
require("@xtools-at/hardhat-sourcify");

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    local: {
      url: "http://localhost:8545",
      accounts: [process.env.PRIVATE_KEY]
    },
    ethereum_goerli: {
      name: "ethereum_goerli",
      url: `https://rpc.ankr.com/eth_goerli`,
      gasPrice: 1000000000, // 1 gwei
      accounts: [process.env.PRIVATE_KEY]
    },
    polygon_mumbai: {
      name: "polygon_mumbai",
      url: "https://rpc-mumbai.maticvigil.com",
      gasPrice: 10000000000, // 10 gwei
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc_testnet: {
      name: "bsc_testnet",
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      gasPrice: 10000000000, // 10 gwei
      accounts: [process.env.PRIVATE_KEY]
    },
    sapphire_testnet: {
      name: "sapphire_testnet",
      url: "https://testnet.sapphire.oasis.dev",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 0x5aff
    }
  },
  gasReporter: {
    enabled: true,
    currency: "ETH",
    showTimeSpent: true,
    gasPrice: process.env.GAS_PRICE ? process.env.GAS_PRICE : 15,
    coinmarketcap: process.env.COINMARKETCAP_KEY
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_SCAN_API
    }
  }
};
