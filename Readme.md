
# Interchain Token Manager Deployment and Token Transfer

This repository contains a set of scripts for deploying and managing Interchain Token Managers using the Axelar Network's SDK. These scripts facilitate the deployment of token managers on different chains and the transfer of tokens between them.

## Prerequisites

Before running the scripts, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Hardhat (Ethereum development environment)
- Axelar Network's SDK

## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/mujee7/ITS-Axelar.git
```

2. Install dependencies:

```
npm install
```

3. Set up your environment variables:
   - Rename the `.env.example` file to `.env`.
   - Modify the `FUNCTION_NAME` variable in the `.env` file to specify which function you want to run.
   - Update other environment-specific variables as needed.

## Usage

To execute a specific function, run the following command:

```
npx hardhat run customInterchainToken.js --network yourChainName


```

Replace `yourScript.js` with the script you want to run (e.g., `customInterchainToken.js`) and `yourNetwork` with the desired network (e.g., `ethereum` or `base`).

Right now there are only two networks I have added. If you want to add more you can follow the same sequence in hardhat.config.js file


npx hardhat run customInterchainToken.js --network ethereum

## Functionality

On every step you have to change FUNCTION_NAME in .env file before running the command.

### 1. `getSalt`

This function will create a random salt for the deployments ahead. You need to copy this value and change it in the customInterchainToken.js file variable "salt".
This salt value is very important for all the functions ahead so copy it properly and also save it somewhere secure and easy to remember.

### 2. `deploysToken`

This funtion will be used to deploy your smart contract on the same address on different blockchains.
But before this you have to get smart contract and paste it in remix https://remix.ethereum.org/ and compile it and add the constructor arguments in the boxes shown and copy the byte code by clickcing Calldata button. 

![alt text](https://github.com/mujee7/ITS-Axelar/blob/main/images/image.PNG)


Then paste in in the tokenByteCode.js file in byteCode folder. Now change the function name in env and run the following command.

npx hardhat run customInterchainToken.js --network yourNetwork

here yourNetwork should be the name of the network you want to deploy on and it should be added in the config file. If it is not there add your network the same way as those two are there ethereum and base. Here both are testnet links. So it deploys on testnets at the moment.

If you have to deploy on 15 different evm chains. You have to add those 15 chains data in config file. and run the same command 15 times with each time with a different network.

Requirement:
You need to have enough coin to pay for gas of token deployment.

Now The tokens is deployed on different chains with same address. We can move further.



### 1. `deployTokenManager`

This function deploys a token manager on the specified chain. It  encodes parameters, and deploys the token manager contract.
This will deploy token Manager on the specified blockchain.

Before calling this function change tokenAddress value in customInterchainToken.js file with your token address.


npx hardhat run customInterchainToken.js --network ethereum


### 2. `deployRemoteTokenManager`

Deploys a token manager remotely on another chain. It calculates gas fees, encodes parameters, and deploys the token manager contract on the target chain.

Before calling this function you need to change the remoteChain value inside this function deployRemoteTokenManager. You can get you desired chain value from this link https://docs.axelar.dev/dev/reference/testnet-chain-names (CHAIN IDENTIFIER	value)

For this command you dont have to change the chain name but it should have the same chain name on which you have money on. Like you can now deploy token manager from ethereum blockchain on any chain by paying gas in ethereum.

npx hardhat run customInterchainToken.js --network ethereum

Now you have to repeat this step for all your blockchains

Dont Forget to copy and save the token ID for future use.


### 3. `transferMintAccessToTokenManager`

Transfers mint access to the token manager on the chain. Grants the minter role to the specified token manager address.

Before calling you have to change the tokenManagerAddress with your token manager address inside this function transferMintAccessToTokenManager

Now you have to run this command with all the blockchains you deployed token on

npx hardhat run customInterchainToken.js --network yourChainName


### 5. `transferTokens`

Transfers tokens from one chain to another. Initiates a token transfer between chains using the interchain token service contract.

Before this change the tokenID and remoteChain values in the function transferTokens. tokenID will be the one you stored in the previous steps and remoteChain will be the chain to you want to receive tokens.

here yourChainName will be the from chain where tokens need to be sent.
npx hardhat run customInterchainToken.js --network yourChainName



## Documentation

Detailed documentation and usage examples can be found in the [Axelar Network developer documentation](https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens).

## License

This project is licensed under the [MIT License](LICENSE).

