// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    address public owner;
    uint private totalTokenSupply;
    uint8 private tokenNrDecimals;
    string private tokenSymbol;
    string private tokenName;
    mapping(address => uint) private balances;
    mapping(address => bool) private isInWhiteList;
    mapping(address => mapping(address => uint)) private allowed;



    //**************************EXTRA-EVENTS**************************
    event AddWhitelist(address indexed updatedBy, address newAddress);
    event RemoveWhitelist(address indexed updatedBy, address removedAddress);



    //**************************MODIFIERS**************************
    modifier onlyOwner() {
        require(msg.sender == owner, "ERC20: you're not an owner");
        _;
    }

    modifier enoughTokens(address _owner, uint amount) {
        require(balances[_owner] >= amount, "ERC20: not enough tokens");
        _;
    }

    modifier onlyWhitelist(address _address) {
        require(isInWhiteList[_address], "ERC20: you're not in whitelist");
        _;
    }



    //**************************CONSTRUCTOR**************************
    constructor(
        string memory _tokenSymbol, 
        string memory _tokenName,
        uint8 _tokenNrDecimals,
        address _owner
    ) 
    {
        owner = _owner;
        tokenNrDecimals = _tokenNrDecimals;
        tokenSymbol = _tokenSymbol;
        tokenName = _tokenName;
        isInWhiteList[_owner] = true;
    }
    



    //**************************FUNCTIONS**************************
    function name() external view override returns (string memory) {
        return tokenName;
    }

    function symbol() external view override returns (string memory) {
        return tokenSymbol;
    }

    function decimals() external view override returns (uint8) {
        return tokenNrDecimals;
    }

    /// @dev Mints an amount of token and assigns it to an account (minter).
    /// @param _amount The amount of tokens to be minted
    /// @param minter The account that will receive the created tokens, i.e minter
    function mint(uint _amount, address minter) public onlyWhitelist(minter) {
        require(minter != address(0), "ERC20: mint by zero address");
        totalTokenSupply += _amount;
        balances[minter] += _amount;
        emit Transfer(address(0), minter, _amount);
    }

    /// @dev Burns an amount of the token of a specific account.
    /// @param _amount The amount of tokens to be burnt
    /// @param account The account whose tokens will be burnt
    function burn(uint _amount, address account) 
        external
        onlyWhitelist(account)
        enoughTokens(account, _amount)
    {
        require(account != address(0), "ERC20: burn by zero address");
        totalTokenSupply -= _amount;
        balances[account] -= _amount;
        emit Transfer(account, address(0), _amount);
    }

    function totalSupply() external view override returns (uint) {
        return totalTokenSupply;
    }

    function balanceOf(address _owner) external view override returns (uint) {
        return balances[_owner];
    }

    function transfer(address _to, uint _amount) 
        public 
        enoughTokens(msg.sender, _amount)
        override 
        returns (bool) 
    {
        require(_to != address(0), "ERC20: transfer to zero address");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint _amount) 
        public
        enoughTokens(_from, _amount)
        override
        returns (bool)
    {
        require(_from != address(0), "ERC20: transfer from zero address");
        require(_to != address(0), "ERC20: transfer to zero address");
        require(allowed[_from][msg.sender] >= _amount, "ERC20: not enough allowance");
        balances[_from] -= _amount;
        balances[_to] += _amount;
        allowed[_from][msg.sender] -= _amount;
        emit Transfer(_from, _to, _amount);
        return true;
    }

    function approve(address _spender, uint _value) public returns (bool) {
        require(_spender != address(0), "ERC20: _spender is zero address");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) external view returns (uint) {
        return allowed[_owner][_spender];
    }

    function addAddressWhitelist(address _toBeAdded) 
        public 
        onlyWhitelist(msg.sender)
    {
        require(_toBeAdded != address(0), "ERC20: adding zero address");
        require(!isInWhiteList[_toBeAdded], "ERC20: address already in whitelist");
        isInWhiteList[_toBeAdded] = true;
        emit AddWhitelist(msg.sender, _toBeAdded);
    }

    function removeAddressWhitelist(address _toBeRemoved)
        public
        onlyWhitelist(msg.sender)
    {
        require(_toBeRemoved != owner, "ERC20: owner can't be removed from whitelist");
        require(isInWhiteList[_toBeRemoved], "ERC20: address is already not in whitelist");
        isInWhiteList[_toBeRemoved] = false;
        emit RemoveWhitelist(msg.sender, _toBeRemoved);
    }

    function checkAddressInWhitelist(address _address) external view returns(bool) {
        return isInWhiteList[_address];
    } 

}


