// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./ERC20.sol";

contract INTToken is ERC20 {
    constructor(uint totalBalance) ERC20("INT", "INTToken", 18, msg.sender) {
        mint(totalBalance, msg.sender);
    }
}