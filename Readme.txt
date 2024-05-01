resource:
https://docs.axelar.dev/dev/send-tokens/interchain-tokens/developer-guides/link-custom-tokens-deployed-across-multiple-chains-into-interchain-tokens
//chain identifier values:
https://docs.axelar.dev/dev/reference/testnet-chain-names


base
eth
sepolia token address

//address of the tokens
0x6Ee1Fa1A82D49D35594B41E29A93D1345893169C

//Salt used for deployment of both tokens
Salt: 0x084e241d5d6a5301dbda6223acb13da01807a3fcc5541da4f578f5a4fa586210

and address of the deployer (My wallet address)
0x0981AD88A960B03CAA47Db6ab2932dA114F85842

//address of the create2 deployer (contract used to deploy in same address)
0x98b2920d53612483f91f12ed7754e51b4a77919e

//deployed both token using create2 on the same address


first command do deploy token manager.

//change in env  (To every case to run in main need to update FUNCTION_NAME in .env)
FUNCTION_NAME=deployTokenManager 

//run in cmd
npx hardhat run customInterchainToken.js --network ethereum   //(ethereum for eth-sepolia TXs and base for base-sepolia TXs)


return value of the first function

        Salt: 0x43f4f3e7556885ebab379406bda0815dfedd74fc701ee79f84e17b87ec11d143,
        Transaction Hash: 0xbde36774845bdc67309e5cfdf7494d5d17a415c1d7bc341664fc1ee9b78309b0,
        Token ID: 0x76f2fc6fadac5f3b0feae7cf75832bb319a39a5d01f99f65090f00df6f95a028,
        Expected token manager address: 0x4d07F310d82f1057C013612607B6E21F0C6ac945,


//second part

// return values of the remote function call

Transaction Hash: 0xd03d7654f2b69cbeeffbc67fd7204bf138f191d31684c8193360fe9f32cb8a77,
        Token ID: 0x76f2fc6fadac5f3b0feae7cf75832bb319a39a5d01f99f65090f00df6f95a028,
        Expected token manager address: 0x4d07F310d82f1057C013612607B6E21F0C6ac945,

//because both tokens have the same address aswell as same salt thats why they have the same tokenManager address

//it deploys token manager remotely on base aswell

//tx on axelar scan
https://testnet.axelarscan.io/gmp/0xd03d7654f2b69cbeeffbc67fd7204bf138f191d31684c8193360fe9f32cb8a77:84

//end 2nd part

//start 3rd part

//transfering mint access to token manager on eth-sepolia chain

//granted role on eth-sepolia chain
0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
grantRoleTxn:  0xfef733398a0db188fe91fba4cfbdef574d2ba88c3f195c44064d4045fe4e0768
//end 3rd

//start 4th
//granted role on base-aepolia chain

grantRoleTxn:  0xf7abb382c02c87e6667c7f6e862f99d8ff41d23ea0106fccdc7374b8f6f2ba0c
//end 4th


//by using create2 Only the deployer has all thetokens now I am minting some for me aswell

//start 5th and last step

Transfer Transaction Hash: 0x38c6efbfdd05e2d21f08ac4fb9d9f305dfd25828c1f8ef74fd8b81fa303cd2c8

//TX on axelarscan to shows complete transfer of tokens to base-sepolia 

https://testnet.axelarscan.io/gmp/0x00eeac0a2c388cf5bdd9f195fa50ea0942d79641c141cdab7df41a0727c902d5:106










some token resources used:

https://github.com/axelarnetwork/interchain-token-service/blob/main/contracts/TokenHandler.sol
https://github.com/axelarnetwork/interchain-token-service/blob/main/contracts/token-manager/TokenManager.sol
https://github.com/axelarnetwork/interchain-token-service/blob/main/contracts/InterchainTokenFactory.sol
https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/scripts/create2Deployer.js
https://github.com/axelarnetwork/interchain-token-service/blob/9edc4318ac1c17231e65886eea72c0f55469d7e5/contracts/InterchainTokenService.sol#L276























