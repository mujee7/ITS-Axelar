require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20", // Specify the desired compiler version here
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    ethereum: {
      url: "https://rpc.ankr.com/eth_sepolia",
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: "https://rpc.ankr.com/base_sepolia",
      chainId: 84532,
      accounts: [PRIVATE_KEY],
    },
  },
};
