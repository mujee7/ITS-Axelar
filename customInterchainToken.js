const hre = require("hardhat");
const crypto = require("crypto");
const ethers = hre.ethers;
const fs = require('fs');
const {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} = require("@axelar-network/axelarjs-sdk");

const interchainTokenServiceContractABI = require("./abis/interchainTokenServiceABI");
const customTokenABI = require("./abis/customTokenABI");
const tokenDeployerABI = require("./abis/tokenDeployer")
const tokenByteCode = fs.readFileSync("./output/simple_sol_SimpleCustomToken.bin");

const MINT_BURN = 4;

const interchainTokenServiceContractAddress =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";

const tokenDeployerAddress =
  "0x98B2920D53612483F91F12Ed7754E51b4A77919e";

const tokenAddress = "0x6Ee1Fa1A82D49D35594B41E29A93D1345893169C"; // Replace with your token address on fantom

let salt = '0xda3deead44e19a8954789a523314acaaa423bfe67798112e65b96378ee4b2bd8'; //update the salt value

async function getSigner() {
    const [signer] = await ethers.getSigners();
    return signer;
  }

  async function getContractInstance(contractAddress, contractABI, signer) {
    return new ethers.Contract(contractAddress, contractABI, signer);
  }
function getSalt(){
  const salt = "0x" + crypto.randomBytes(32).toString("hex");

  console.log(salt)
}


//...

async function deploysToken() {
  // Get a signer to sign the transaction
  const signer = await getSigner();  

  // Example constructor arguments
  // change these address values
  const constructorArgs = ["0x277491d370d1C3014C1473420d74f2a9C5E6c345", "0x277491d370d1C3014C1473420d74f2a9C5E6c345"];

  // Encode constructor arguments
  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    ["address", "address"], //change these accroding to your contract
    constructorArgs
  );
  console.log("arguments: ", encodedArgs)

  const deployerContract = await getContractInstance(
    tokenDeployerAddress,
    tokenDeployerABI,
    signer
  );

  const some = "0x" + tokenByteCode.toString() + encodedArgs.slice(2); 

  console.log("Token Address before deployment: ",await deployerContract.deployedAddress(some, signer.address, salt));

  tx= await deployerContract.deploy(some,salt)
  console.log("Transaction Hash: ",tx.hash)
}

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
  

  // Create params
  const params = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, tokenAddress]
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

  const remoteChain = "base-sepolia" // remote chain update on each call

  // Get the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );

  // Create params
  const param = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, tokenAddress]
  );

  const gasAmount = await gasEstimator();

  // Deploy the token manager
  const deployTxData = await interchainTokenServiceContract.deployTokenManager(
    salt, 
    remoteChain,
    MINT_BURN,
    param,
    ethers.utils.parseEther("0.01"),
    { value: gasAmount }
  );

  // Get the tokenId
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    salt 
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
async function transferMintAccessToTokenManager() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const tokenManagerAddress = "0x4d07F310d82f1057C013612607B6E21F0C6ac945" //change token manager address to your manager

  const tokenContract = await getContractInstance(
    tokenAddress,
    customTokenABI,
    signer
  );

  // Get the minter role
  const getMinterRole = await tokenContract.MINTER_ROLE();

  console.log(getMinterRole)

  const grantRoleTxn = await tokenContract.grantRole(
    getMinterRole,
    tokenManagerAddress 
  );

  console.log("grantRoleTxn: ", grantRoleTxn.hash);
}



//...

// Transfer tokens : Fantom -> Polygon
async function transferTokens() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const tokenID = "0x76f2fc6fadac5f3b0feae7cf75832bb319a39a5d01f99f65090f00df6f95a028" // tokenId, the one you store in the earlier step

  const remoteChain = "base-sepolia" // remote chain update on each call

  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );
  const gasAmount = await gasEstimator();
  const transfer = await interchainTokenServiceContract.interchainTransfer(
    tokenID, 
    remoteChain, 
    signer.address,  //receiver address
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
    case "getSalt":
      getSalt();
      break;
    case "deploysToken":
      await deploysToken();
      break;
    case "deployTokenManager":
      await deployTokenManager();
      break;
    case "deployRemoteTokenManager":
      await deployRemoteTokenManager();
      break;
    case "transferMintAccessToTokenManager":
      await transferMintAccessToTokenManager();
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