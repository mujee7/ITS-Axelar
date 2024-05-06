
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin contracts for ERC20 standard token implementations,
// burnable tokens, access control mechanisms, and permit functionality
import "./ERC20.sol";
import "./ERC20Burnable.sol";
import "./AccessControl.sol";
import "./ERC20Permit.sol";

contract SimpleCustomToken is ERC20, ERC20Burnable, AccessControl, ERC20Permit {

// Define a constant for the minter role using keccak256 to generate a unique hash
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin, address minter)
        ERC20("SimpleCustomToken", "SCT") // Set token name and symbol
        ERC20Permit("SimpleCustomToken") // Initialize ERC20Permit with the token name
    {
        // Mint an initial supply of tokens to the message sender
        _mint(msg.sender, 10000 * 10 ** decimals());


        // Grant the DEFAULT_ADMIN_ROLE to the specified defaultAdmin address
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);


        // Grant the MINTER_ROLE to the specified minter address
        // Addresses with the minter role are allowed to mint new tokens
        _grantRole(MINTER_ROLE, minter);
    }

    // Mint new tokens. Only addresses with the MINTER_ROLE can call this function
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // Burn tokens from a specified account
    function burn(address account, uint256 amount) public onlyRole(MINTER_ROLE) {
        _burn(account, amount);
    }
}
