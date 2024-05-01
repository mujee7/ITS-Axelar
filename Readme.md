
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
git clone https://github.com/your-username/your-repo.git
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
npx hardhat run yourScript.js --network yourNetwork
```

Replace `yourScript.js` with the script you want to run (e.g., `customInterchainToken.js`) and `yourNetwork` with the desired network (e.g., `ethereum` or `base`).

## Functionality

### 1. `deployTokenManager`

This function deploys a token manager on the specified chain. It generates a random salt, encodes parameters, and deploys the token manager contract.

### 2. `deployRemoteTokenManager`

Deploys a token manager remotely on another chain. It calculates gas fees, encodes parameters, and deploys the token manager contract on the target chain.

### 3. `transferMintAccessToTokenManagerOnFantom`

Transfers mint access to the token manager on the Fantom chain. Grants the minter role to the specified token manager address.

### 4. `transferMintAccessToTokenManagerOnPolygon`

Transfers mint access to the token manager on the Polygon chain. Grants the minter role to the specified token manager address.

### 5. `transferTokens`

Transfers tokens from one chain to another. Initiates a token transfer between chains using the interchain token service contract.

## Documentation

Detailed documentation and usage examples can be found in the [Axelar Network developer documentation](https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens).

## License

This project is licensed under the [MIT License](LICENSE).

