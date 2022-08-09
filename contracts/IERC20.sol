// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/// @title ERC-20 Fungible Token Interface
interface IERC20 {

    /// @dev Returns the full name of ERC-20 token.
    /// @return The full name of token
    function name() external view returns (string memory);


    /// @dev Returns the token's symbol, e.g "INT".
    /// @return The token's symbol
    function symbol() external view returns (string memory);
    

    /// @dev Returns the number of decimals the token uses.
    /// @return The token's number of decimals
    function decimals() external view returns (uint8);


    /// @dev Returns the total suply of the corresponding token.
    /// @return Total amount of tokens
    function totalSupply() external view returns (uint);


    /// @dev Returns the account balance of specific account with address _owner.
    /// @param _owner The address from which the balance will be retrieved
    /// @return balance The balance of the account with address _owner
    function balanceOf(address _owner) external view returns (uint balance);


    /// @dev Transfers _value amount of tokens to the address _to.
    /// It MUST fire the Transfer event.
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transfered
    /// @return success The bool variable that shows whether the transfer was successful or not.
    function transfer(address _to, uint _value) external returns (bool success);


    /// @dev Transfers _value amount of tokens from address _from to address _to.
    /// It MUST fire the Transfer event.
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transfered
    /// @return success The bool variable that shows whether the transfer was successful or not.
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);


    /// @dev Allows _spender to withdraw from a particular account multiple times,
    /// up to the _value amount. If this function is called again it overwrites the current allowance with _value.
    /// @param _spender The address of the account able to transfer tokens
    /// @param _value The amount of tokens to be approved for transfer
    /// @return success The bool variable that shows whether the approval was successful or not.
    function approve(address _spender, uint _value) external returns (bool success);


    /// @dev Returns the amount which _spender is still allowed to withdraw from _owner
    /// @param _owner The address of the current owner of tokens
    /// @param _spender The address of the account able to transfer tokens
    /// @return remaining The remaning amount of tokens which _spender is allowed
    /// to spend from _owner
    function allowance(address _owner, address _spender) external view returns (uint remaining);




    /// @dev This emits when _value amount of tokens are transfered from address _from
    /// to address _to.
    event Transfer(address indexed _from, address indexed _to, uint _value);


    /// @dev This emits when _owner allows _spender to withdraw from its account
    /// _value amount of tokens.
    event Approval(address indexed _owner, address indexed _spender, uint _value);

}
