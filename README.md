
# Interchain Token Manager Deployment and Token Transfer

This repository contains a set of scripts for deploying and managing Interchain Token Managers using the Axelar Network's SDK. These scripts facilitate the deployment of token managers on different chains and the transfer of tokens between them.

## Prerequisites

Before running the scripts, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Git Bash

## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/mujee7/ITS-Axelar.git
```

2. Install dependencies:

```
npm install
```

For MAC users also run 
```
npm i -g solc
```

For Testing I am giving away my .env data including private key which has ether on both chains for testing purposes.

NOTE: Only For Custom
3. Set up your environment variables:
   - Rename the `.env.example` file to `.env`.
   - Modify the `PRIVATE_KEY` variable in the `.env` file to your own private key.
   - Modify the `CONSTRUCTOR_ARG_1` and `CONSTRUCTOR_ARG_2` variables in the `.env` file to your own required Constructor Arguments.

## Compile Contract

First of all run this command in cmd. Remember in cmd new terminal.

```

solcjs --base-path ./contracts --bin ./contracts/simple.sol -o ./output

```
This command will compile the code and create bytecode of the smart contract


## Details

now all commands should be on bash terminal


### 1. `getSalt`

This function will create a random salt for the deployments ahead. You need to copy this value and change it in the future commands.


```bash
FUNCTION_NAME=getSalt npx hardhat run customInterchainToken.js
```

This salt value is very important for all the functions ahead so copy it properly and also save it somewhere secure and easy to remember.

### 2. `deployToken`

This funtion will be used to deploy your smart contract on the same address on different blockchains.
Change the <salt> value with the salt value from the previous command.

The following command will deploy the token on sepolia ethereum blockchain.

```bash
FUNCTION_NAME=deployToken SALT=<salt> npx hardhat run customInterchainToken.js --network ethereum_sepolia
```

after this run the following command
The following command will deploy the token on sepolia base blockchain.

```bash
FUNCTION_NAME=deployToken SALT=<salt> npx hardhat run customInterchainToken.js --network base_sepolia
```

NOTE: For custom token you have to change constructor args, network and .env accordingly.

here network should be the name of the network you want to deploy. Here both are testnet links. So it deploys on testnets at the moment.

If you have to deploy on 15 different evm chains. You have to run the above commands 15 times with just different network names.

Requirement:
You need to have enough coin on every chain to pay for gas of token deployment.

Now The tokens is deployed on different chains with same address. We can move further.

copy the arguments, token address, and transaction hah from terminal for next steps and contract verification. Keep them sae somewhere for future use.



### 3. `deployTokenManager`

This function deploys a token manager on the specified chain. It  encodes parameters, and deploys the token manager contract.
This will deploy token Manager on the specified blockchain.

Chnage the <salt> value and <token_address> value with the token address from the previous commands.

```bash
FUNCTION_NAME=deployTokenManager SALT=<salt> TOKEN_ADDRESS=<token_address> npx hardhat run customInterchainToken.js --network ethereum_sepolia

```

It will retun some data copy all of it and store it somewhere safe for future use. including Transaction Hash, Token ID, token manager address.


### 4. `deployRemoteTokenManager`

Deploys a token manager remotely on another chain. It calculates gas fees, encodes parameters, and deploys the token manager contract on the destination chain. 

Chnage the <salt> value and <token_address> value with the token address from the previous commands.

```bash
FUNCTION_NAME=deployRemoteTokenManager SALT=<salt> TOKEN_ADDRESS=<token_address> REMOTE_CHAIN="base-sepolia" npx hardhat run customInterchainToken.js --network ethereum_sepolia
```

This process will take 15 minutes.
It will return transaction hash you can check the progress on https://testnet.axelarscan.io/ by searching for transaction hash.


Basically you will call a function on ethereum_sepolia chain and it will deploy a token manager for REMOTE_CHAIN which is in our case is base-sepolia. This function basically to pay  gas in one one native currency for any destination (remote) chain.

NOTE: For Curtom deployment also update REMOTE_CHAIN value for your desired destination chain. You can get the value from here:
https://docs.axelar.dev/dev/reference/testnet-chain-names (CHAIN IDENTIFIER	value)



It will retun some data copy all of it and store it somewhere safe for future use. including Transaction Hash, Token ID, token manager address.



### 5. `transferMintAccessToTokenManager`

Transfers mint access to the token manager on the chain. Grants the minter role to the specified token manager address. So that token manager can mint and burn tokens.

Chnage the <manager_address> value with manager address and <token_address> value with the token address from the previous commands.

```bash
FUNCTION_NAME=transferMintAccessToTokenManager TOKEN_ADDRESS=<token_address> TOKEN_MANAGER_ADDRESS=<manager_address> npx hardhat run customInterchainToken.js --network ethereum_sepolia

```

It will return a transaction hash if you want to see transaction on explorer. Do check it aswell on [ethereum_sepolia](https://sepolia.etherscan.io/)

Now run the following command to give access on base-sepolia aswell.

```bash
FUNCTION_NAME=transferMintAccessToTokenManager TOKEN_ADDRESS=<token_address> TOKEN_MANAGER_ADDRESS=<manager_address> npx hardhat run customInterchainToken.js --network base_sepolia

```


### 6. `transferTokens`

Transfers tokens from one chain to another. Initiates a token transfer between chains using the interchain token service contract.


Chnage the <token_ID> value with token ID from the previous commands and <amount> value with the token amount to transfer.
Use amount 500 at the moment.

```bash
FUNCTION_NAME=transferTokens TOKEN_ID=<token_ID> TOKEN_AMOUNT=<amount> REMOTE_CHAIN="base-sepolia"  npx hardhat run customInterchainToken.js --network ethereum_sepolia

```

NOTE: For Curtom deployment also update REMOTE_CHAIN value for your desired destination chain. You can get the value from here:
https://docs.axelar.dev/dev/reference/testnet-chain-names (CHAIN IDENTIFIER	value)

It will give you the Transfer Transaction Hash:

This process will take 15 minutes.
It will return transaction hash you can check the progress on https://testnet.axelarscan.io/ by searching for transaction hash.


Congratulations!!

The tokens have successfully transfered.


## Documentation

Detailed documentation and usage examples can be found in the [Axelar Network developer documentation](https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens).

### Contract References
https://github.com/axelarnetwork/interchain-token-service/blob/main/contracts/TokenHandler.sol
https://github.com/axelarnetwork/interchain-token-service/blob/main/contracts/token-manager/TokenManager.sol
https://github.com/axelarnetwork/interchain-token-service/blob/main/contracts/InterchainTokenFactory.sol
https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/scripts/create2Deployer.js
https://github.com/axelarnetwork/interchain-token-service/blob/9edc4318ac1c17231e65886eea72c0f55469d7e5/contracts/InterchainTokenService.sol#L276


## License

This project is licensed under the [MIT License](LICENSE).

