const hre = require("hardhat");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const ethers = hre.ethers;
const dotenv = require('dotenv');

const {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} = require("@axelar-network/axelarjs-sdk");

// Axelar's API
const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

// Path to the .env file
const envPath = path.resolve(__dirname, '.env');

// Load existing .env variables
const envConfig = dotenv.parse(fs.readFileSync(envPath));

//ABIs
const ITS_CONTRACT_ABI = require("./abis/interchainTokenServiceABI");
const customTokenABI = require("./abis/customTokenABI");
const tokenDeployerABI = require("./abis/tokenDeployer")
const tokenByteCodeFile = fs.readFileSync("./output/simple_sol_SimpleCustomToken.bin");

// Axelar's ITS contract token type
const MINT_BURN = 4;

// Axelar's ITS contract address
const ITS_CONTRACT_ADDRESS =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";

//Same address contract deployer address
const TOKEN_DEPLOYER_ADDRESS =
  "0x98B2920D53612483F91F12Ed7754E51b4A77919e";

// Returns signer
async function getSigner() {
    const [signer] = await ethers.getSigners();
    return signer;
  }

// Returns contract instance
async function getContractInstance(contractAddress, contractABI, signer) {
  return new ethers.Contract(contractAddress, contractABI, signer);
}

// Prints new salt value
function getSalt(){
  const salt = "0x" + crypto.randomBytes(32).toString("hex");
  
  //updates env
  envConfig.SALT = salt;
  const updatedEnvConfig = Object.keys(envConfig)
  .map(key => `${key}=${envConfig[key]}`)
  .join('\n');
  fs.writeFileSync(envPath, updatedEnvConfig, 'utf8');

  console.log("Generated Salt: ",salt)
}

// It deploys contract on same address on different blockchains with same salt value
async function deployToken(salt) {
  // Get a signer to sign the transaction
  const signer = await getSigner();  
  //Constructor values of our smart contract [defaultAdmin, minter]
  const constructorArgs = [process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL, process.env.TOKEN_DEFAULT_ADMIN, process.env.TOKEN_MINTER];

  // Encode constructor arguments
  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    ["string","string","address", "address"], //change these accroding to your contract
    constructorArgs
  );

  //Don't forget to remove 0x while verifying the contract.
  console.log("arguments: ", encodedArgs, "\n Don't forget to remove 0x while verifying the contract.") // Important to copy these for contract verification in future.


  const deployerContract = await getContractInstance(
    TOKEN_DEPLOYER_ADDRESS,
    tokenDeployerABI,
    signer
  );
  
  // Contract byteCode with constructor arguments
  const tokenByteCode = "0x" + tokenByteCodeFile.toString() + encodedArgs.slice(2); 
  // Prints pre determined token address
  const tokenAddress = await deployerContract.deployedAddress(tokenByteCode, signer.address, salt)

  //updates env
  envConfig.TOKEN_ADDRESS = tokenAddress
  const updatedEnvConfig = Object.keys(envConfig)
  .map(key => `${key}=${envConfig[key]}`)
  .join('\n');
  fs.writeFileSync(envPath, updatedEnvConfig, 'utf8');

  console.log("Token Address before deployment: ", tokenAddress);
  // Deploys token
  tx= await deployerContract.deploy(tokenByteCode, salt)
  // Prints Transaction hash
  console.log("Transaction Hash: ",tx.hash)
}



async function mintTokens(tokenAddress, amount) {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Gets Our Token Contract instance
  const tokenContract = await getContractInstance(
    tokenAddress,
    customTokenABI,
    signer
  );  

  // Grants minter role
  const transaction = await tokenContract.mint(
    signer.address,
    Number(amount * 10 ** 18).toString()  
  );
  
  //Prints the transaction hash.
  console.log("Mint TX hash: ", transaction.hash);
}

// Deploys token manager for our token 
async function deployTokenManager(salt, tokenAddress) {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Get the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    ITS_CONTRACT_ADDRESS,
    ITS_CONTRACT_ABI,
    signer
  );

  // Create params
  const params = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, tokenAddress]

  );
  // Deploys the token manager
  const deployTxData = await interchainTokenServiceContract.deployTokenManager(
    salt,
    "",
    MINT_BURN,
    params,
    ethers.utils.parseEther("0.01") //gas fee
  );

  // Gets the tokenId against salt and our wallet address
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    salt
  );

  // Get the token manager address before its deployement
  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);


  //updates env
  envConfig.TOKEN_MANAGER_ADDRESS = expectedTokenManagerAddress;
  envConfig.TOKEN_ID = tokenId;

  const updatedEnvConfig = Object.keys(envConfig)
  .map(key => `${key}=${envConfig[key]}`)
  .join('\n');
  fs.writeFileSync(envPath, updatedEnvConfig, 'utf8');

  console.log(
    `
	Salt: ${salt},
	Transaction Hash: ${deployTxData.hash},
	Token ID: ${tokenId},
	Expected token manager address: ${expectedTokenManagerAddress},
	`
  );
}





// Estimate gas costs for the transactions. For our case we will be using these values. For mainnets you can update these values
async function gasEstimator() {
  const gas = await api.estimateGasFee(
    EvmChain.FANTOM, // Source Chain
    EvmChain.POLYGON, // Destination Chain
    GasToken.FTM, // Source chain Currency Symbol
    700000, //GasLimit
    1.1 // Gas Multiplier
  );
  return gas;
}

// Deploys remote token manager To Remote blockchain. Like we can deploy on base chain by calling contract on ethereum chain and giving fees in ethers on ethereum.
async function deployRemoteTokenManager(salt, tokenAddress, remoteChain) {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Gets the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    ITS_CONTRACT_ADDRESS,
    ITS_CONTRACT_ABI,
    signer
  );

  // Create params
  const param = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, tokenAddress]
  );

  //Gets the Gas cost
  const gasAmount = await gasEstimator();

  // Deploy the token manager on the remote chain because of remoteChain value provided.
  const deployTxData = await interchainTokenServiceContract.deployTokenManager(
    salt, 
    remoteChain, //Destination chain
    MINT_BURN,
    param,
    ethers.utils.parseEther("0.01"),
    { value: gasAmount }
  );

  // Gets the tokenId against salt and our wallet address
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    salt 
  );

  // Get the token manager address before its deployement on the remote chain
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


// Transfer mint access on chains to their specified Token Manager 
async function transferMintAccessToTokenManager(tokenAddress, tokenManagerAddress) {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Gets Our Token Contract instance
  const tokenContract = await getContractInstance(
    tokenAddress,
    customTokenABI,
    signer
  );

  // Gets the minter role
  const getMinterRole = await tokenContract.MINTER_ROLE();

  // Grants minter role
  const grantRoleTxn = await tokenContract.grantRole(
    getMinterRole,
    tokenManagerAddress 
  );
  
  //Prints the transaction hash.
  console.log("grantRoleTxn: ", grantRoleTxn.hash);
}



// Transfer tokens : Sourch Chain -> Destination Chain
async function transferTokens(tokenID, remoteChain, amount) {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Gets the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    ITS_CONTRACT_ADDRESS,
    ITS_CONTRACT_ABI,
    signer
  );

  //Gets the gas Cost
  const gasAmount = await gasEstimator();

  //Transfer Tokens between blockchains
  const transfer = await interchainTokenServiceContract.interchainTransfer(
    tokenID, // TokenID generated against our wallet address and salt
    remoteChain, // Destination chain
    signer.address,  //Receiver address
    ethers.utils.parseEther(amount.toString()), // amount of token to transfer
    "0x",
    ethers.utils.parseEther("0.01"), // gasValue
    {
      // Transaction options should be passed here as an object
      value: gasAmount,
    }
  );

  // Prints Transaction hash.
  console.log("Transfer Transaction Hash:", transfer.hash);
}

async function main() {


  const functionName = process.env.FUNCTION_NAME;  // Function Name to be called
  const SALT = process.env.SALT                    // Generated Salt value 
  const tokenAddress = process.env.TOKEN_ADDRESS   // Token address of our token
  const remoteChain =process.env.REMOTE_CHAIN      // Destination Chain
  const tokenManagerAddress = process.env.TOKEN_MANAGER_ADDRESS   // Generated Token Manager address
  const tokenID = process.env.TOKEN_ID             // Generated TokenID 
  const tokenAmount = process.env.TOKEN_AMOUNT     // Amount of tokens to transfer.
  const tokenSupply = process.env.SUPPLY           // ToKen Supply

  switch (functionName) {
    case "getSalt":
      getSalt();
      break;
    case "deployToken":
      await deployToken(SALT);
      break;
    case "mintTokens":
      await mintTokens(tokenAddress, tokenSupply);
      break;
    case "deployTokenManager":
      await deployTokenManager(SALT, tokenAddress);
      break;
    case "deployRemoteTokenManager":
      await deployRemoteTokenManager(SALT, tokenAddress, remoteChain);
      break;
    case "transferMintAccessToTokenManager":
      await transferMintAccessToTokenManager(tokenAddress, tokenManagerAddress);
      break;
    case "transferTokens":
      await transferTokens(tokenID, remoteChain, tokenAmount);
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