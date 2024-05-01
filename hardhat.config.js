require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
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
