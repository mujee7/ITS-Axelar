require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.25", // Specify the desired compiler version here
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    ethereum_sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
    },
    base_sepolia: {
      url: "https://rpc.ankr.com/base_sepolia",
      chainId: 84532,
      accounts: [PRIVATE_KEY],
    },
    arbitrum: {
      url: "https://rpc.ankr.com/arbitrum",
      chainId: 42161,
      accounts: [PRIVATE_KEY],
    },
    avalanche: {
      url: "https://rpc.ankr.com/avalanche",
      chainId: 43114,
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: "https://rpc.ankr.com/base",
      chainId: 8453,
      accounts: [PRIVATE_KEY],
    },
    blast: {
      url: "https://rpc.ankr.com/blast",
      chainId: 81457,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: "https://rpc.ankr.com/bsc",
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
    celo: {
      url: "https://rpc.ankr.com/celo",
      chainId: 42220,
      accounts: [PRIVATE_KEY],
    },
    fantom: {
      url: "https://rpc.ankr.com/fantom",
      chainId: 250,
      accounts: [PRIVATE_KEY],
    },
    filecoin: {
      url: "https://rpc.ankr.com/filecoin",
      chainId: 314,
      accounts: [PRIVATE_KEY],
    },
    kava: {
      url: "https://rpc.ankr.com/http/kava_api",
      chainId: 2222,
      accounts: [PRIVATE_KEY],
    },
    mantle: {
      url: "https://rpc.ankr.com/mantle",
      chainId: 5000,
      accounts: [PRIVATE_KEY],
    },
    moonbeam: {
      url: "https://rpc.ankr.com/moonbeam",
      chainId: 1284,
      accounts: [PRIVATE_KEY],
    },
    optimism: {
      url: "https://rpc.ankr.com/optimism",
      chainId: 10,
      accounts: [PRIVATE_KEY],
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
      chainId: 137,
      accounts: [PRIVATE_KEY],
    },
    scroll: {
      url: "https://rpc.ankr.com/scroll",
      chainId: 534352,
      accounts: [PRIVATE_KEY],
    },
    linea: {
      url: "https://linea.blockpi.network/v1/rpc/public",
      chainId: 59144,
      accounts: [PRIVATE_KEY],
    },
    scroll: {
      url: "https://rpc.frax.com",
      chainId: 252,
      accounts: [PRIVATE_KEY],
    }
  },
};
