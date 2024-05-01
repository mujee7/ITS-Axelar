const hre = require("hardhat");
const crypto = require("crypto");
const ethers = hre.ethers;
const {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} = require("@axelar-network/axelarjs-sdk");

const interchainTokenServiceContractABI = require("./abis/interchainTokenServiceABI");
const customTokenABI = require("./abis/customTokenABI");

const MINT_BURN = 4;

const interchainTokenServiceContractAddress =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";

const fantomCustomTokenAddress = "0x6Ee1Fa1A82D49D35594B41E29A93D1345893169C"; // Replace with your token address on fantom
const polygonCustomTokenAddress = "0x6Ee1Fa1A82D49D35594B41E29A93D1345893169C"; // Replace with your token address on Polygon

async function getSigner() {
    const [signer] = await ethers.getSigners();
    return signer;
  }

  async function getContractInstance(contractAddress, contractABI, signer) {
    return new ethers.Contract(contractAddress, contractABI, signer);
  }


//...

// Deploy token manager : Fantom
async function deployTokenManager() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Get the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );

  // Generate a random salt
  const salt = "0x" + crypto.randomBytes(32).toString("hex");

  console.log(salt)

  // Create params
  const params = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, fantomCustomTokenAddress]
  );

  // Deploy the token manager
  const deployTxData = await interchainTokenServiceContract.deployTokenManager(
    salt,
    "",
    MINT_BURN,
    params,
    ethers.utils.parseEther("0.01")
  );

  // // Get the tokenId
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    salt
  );

  // Get the token manager address
  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log(
    `
	Salt: ${salt},
	Transaction Hash: ${deployTxData.hash},
	Token ID: ${tokenId},
	Expected token manager address: ${expectedTokenManagerAddress},
	`
  );
}




//Part One completed our token has deployed the token manager


//To remotely deploy token Manager for other chains

//starts here ...

//...

const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

// Estimate gas costs
async function gasEstimator() {
  const gas = await api.estimateGasFee(
    EvmChain.FANTOM,
    EvmChain.POLYGON,
    GasToken.FTM,
    700000,
    1.1
  );

  return gas;
}

//...



//...

// Deploy remote token manager : Polygon
async function deployRemoteTokenManager() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Get the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );

  // Create params
  const param = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, polygonCustomTokenAddress]
  );

  const gasAmount = await gasEstimator();

  // Deploy the token manager
  const deployTxData = await interchainTokenServiceContract.deployTokenManager(
    "0x43f4f3e7556885ebab379406bda0815dfedd74fc701ee79f84e17b87ec11d143", // change salt
    "base-sepolia",
    MINT_BURN,
    param,
    ethers.utils.parseEther("0.01"),
    { value: gasAmount }
  );

  // Get the tokenId
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    "0x43f4f3e7556885ebab379406bda0815dfedd74fc701ee79f84e17b87ec11d143" // change salt
  );

  // Get the token manager address
  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log(
    `
	Transaction Hash: ${deployTxData.hash},
	Token ID: ${tokenId},
	Expected token manager address: ${expectedTokenManagerAddress},
	`
  );
}




//...

// Transfer mint access on all chains to the Expected Token Manager : Fantom
async function transferMintAccessToTokenManagerOnFantom() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const tokenContract = await getContractInstance(
    fantomCustomTokenAddress,
    customTokenABI,
    signer
  );

  // Get the minter role
  const getMinterRole = await tokenContract.MINTER_ROLE();

  console.log(getMinterRole)

  const grantRoleTxn = await tokenContract.grantRole(
    getMinterRole,
    "0x4d07F310d82f1057C013612607B6E21F0C6ac945" //change token manager address to your manager
  );

  console.log("grantRoleTxn: ", grantRoleTxn.hash);
}




//...

// Transfer mint access on all chains to the Expected Token Manager Address : Polygon
async function transferMintAccessToTokenManagerOnPolygon() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const tokenContract = await getContractInstance(
    polygonCustomTokenAddress,
    customTokenABI,
    signer
  );

  // Get the minter role
  const getMinterRole = await tokenContract.MINTER_ROLE();

  const grantRoleTxn = await tokenContract.grantRole(
    getMinterRole,
    "0x4d07F310d82f1057C013612607B6E21F0C6ac945"
  );

  console.log("grantRoleTxn: ", grantRoleTxn.hash);
}

//...




//...

// Transfer tokens : Fantom -> Polygon
async function transferTokens() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );
  const gasAmount = await gasEstimator();
  const transfer = await interchainTokenServiceContract.interchainTransfer(
    "0x76f2fc6fadac5f3b0feae7cf75832bb319a39a5d01f99f65090f00df6f95a028", // tokenId, the one you store in the earlier step
    "base-sepolia", //chain identifier
    "0x0981AD88A960B03CAA47Db6ab2932dA114F85842", // receiver address
    ethers.utils.parseEther("500"), // amount of token to transfer
    "0x",
    ethers.utils.parseEther("0.01"), // gasValue
    {
      // Transaction options should be passed here as an object
      value: gasAmount,
    }
  );

  console.log("Transfer Transaction Hash:", transfer.hash);
  // 0x65258117e8133397b047a6192cf69a1b48f59b0cb806be1c0fa5a7c1efd747ef
}














async function main() {
  const functionName = process.env.FUNCTION_NAME;
  switch (functionName) {
    case "deployTokenManager":
      await deployTokenManager();
      break;
    case "deployRemoteTokenManager":
      await deployRemoteTokenManager();
      break;
    case "transferMintAccessToTokenManagerOnFantom":
      await transferMintAccessToTokenManagerOnFantom();
      break;
    case "transferMintAccessToTokenManagerOnPolygon":
      await transferMintAccessToTokenManagerOnPolygon();
      break;
    case "transferTokens":
      await transferTokens();
      break;
    default:
      console.error(`Unknown function: ${functionName}`);
      process.exitCode = 1;
      return;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});