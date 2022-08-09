const { expect } = require("chai");
const { ethers } = require("hardhat");


describe ("INTToken", function () {
  let owner
  let account1
  let account2
  let account3
  let token

  beforeEach(async function() {
    [owner, account1, account2, account3] = await ethers.getSigners()

    const INTToken = await ethers.getContractFactory("INTToken", owner)
    token = await INTToken.deploy(1000000)
    await token.deployed()
  })


  // Test nr.1
  it("should have an owner", async function() {
    expect(await token.owner()).to.equal(owner.address)
  })

  // Test nr.2
  it("should have the owner's address properly formed", async function() {
    expect(await token.owner()).to.be.properAddress
  })


  describe("name", function() {
    // Test nr.3
    it("should return the correct token name", async function() {
      expect(await token.name()).to.equal("INTToken")
    })
  })

  describe("symbol", function() {
    // Test nr.4
    it("should return the correct token symbol", async function() {
      expect(await token.symbol()).to.equal("INT")
    })
  })

  describe("decimals", function() {
    // Test nr.5
    it("should return the correct number of decimals", async function() {
      expect(await token.decimals()).to.equal(18)
    })
  })

  describe ("mint", function() {
    // Test nr 6.1
    it("should revert if minter is not in whitelist", async function() {
      await expect(token.mint(13, account1.address))
        .to.be.revertedWith("ERC20: you're not in whitelist")
    })

    // Test nr 6.2
    it("should not accept minter to be zero address", async function() {      
      await expect(token.mint(1234, ethers.constants.AddressZero))
        .to.be.revertedWith("ERC20: you're not in whitelist")
    })

    // Test nr 6.3
    it("should increase the total token supply", async function() {
      await expect(() => token.mint(111, owner.address))
        .to.changeTokenBalance(token, owner, 111);

      expect(await token.totalSupply()).to.equal(1000111)
    })

    // Test nr 6.4
    it("should emit Transfer event", async function() {
      await expect(await token.mint(131, owner.address))
        .to.emit(token, 'Transfer')
        .withArgs(ethers.constants.AddressZero, owner.address, 131)
    })
  })

  describe ("burn", function() {
    // Test nr 7.1
    it("should revert if account is not in whitelist", async function() {
      await expect(token.burn(20, account2.address))
        .to.be.revertedWith("ERC20: you're not in whitelist")
    })

    // Test nr 7.2
    it("should revert if account has not enough tokens to burn", async function() {
      await expect(token.burn(1000001, owner.address))
        .to.be.revertedWith('ERC20: not enough tokens')
    })

    // Test nr 7.3
    it("should not accept account to be zero address", async function() {
      await expect(token.burn(4321, ethers.constants.AddressZero))
        .to.be.revertedWith("ERC20: you're not in whitelist")
    })

    // Test nr 7.4
    it("should decrease the total token supply", async function() {
      await expect(() => token.burn(1, owner.address))
        .to.changeTokenBalance(token, owner, -1);
      
      expect(await token.totalSupply()).to.equal(999999)
    })

    // Test nr 7.5
    it("should emit Transfer event", async function() {
      await expect(await token.burn(332, owner.address))
        .to.emit(token, 'Transfer')
        .withArgs(owner.address, ethers.constants.AddressZero, 332)
    })
  })

  describe("totalSupply", function() {
    // Test nr.8
    it("should show correctly the total token supply", async function() {
      expect(await token.totalSupply()).to.equal(1000000)
    })
  })

  describe("balanceOf", function() {
    // Test nr.9
    it("should show correctly the balance of specific account", async function() {
      expect(await token.balanceOf(owner.address)).to.equal(1000000)
      expect(await token.balanceOf(account1.address)).to.equal(0)
    })
  })

  describe("transfer", function() {
    // Test nr 10.1
    it("should revert if msg.sender doesn't have enough tokens", async function() {
      await expect(token.transfer(account1.address, 1000001))
        .to.be.revertedWith('ERC20: not enough tokens')
    })

    // Test nr 10.2
    it("should revert if transfer is accomplished to zero address", async function() {
      await expect(token.transfer(ethers.constants.AddressZero, 99))
        .to.be.revertedWith('ERC20: transfer to zero address')
    })  
    
    // Test nr 10.3
    it("should change balance for msg.sender(-) and _to(+) accounts", async function() {
      await expect(() => token.transfer(account2.address, 999))
        .to.changeTokenBalances(token, [owner, account2], [-999, 999]);
    })

    // Test nr 10.4
    it("should emit Transfer event", async function() {
      await expect(await token.transfer(account1.address, 239910))
        .to.emit(token, 'Transfer')
        .withArgs(owner.address, account1.address, 239910)
    })
  })

  describe("allowance", function() {
    // Test nr 11
    it("should return the amount which _spender is still allowed to withdraw from _owner", async function() {
      await token.approve(account2.address, 10)
      expect(
        await token.allowance(owner.address, account2.address)
      ).to.equal(10)
    })
  })

  describe("approve", function() {
    // Test nr 12.1
    it("should not admit _spender to be zero address", async function() {
      await expect(
        token.approve(ethers.constants.AddressZero, 10)
      ).to.be.revertedWith('ERC20: _spender is zero address')
    })

    // Test nr 12.2
    it("should set the value for allowance for _spender to _value", async function() {
      await token.approve(account3.address, 12092)
      expect(
        await token.allowance(owner.address, account3.address)
      ).to.equal(12092)
    })

    // Test nr 12.3
    it("should emit Approval event", async function() {
      await expect(
        await token.approve(account2.address, 3333)
      ).to.emit(token, 'Approval')
       .withArgs(owner.address, account2.address, 3333)
    })

  })


  describe("transferFrom", function () {
    // Test nr 13.1
    it("should revert if _from account doesn't have enough tokens", async function() {
      await token.connect(account1).approve(account3.address, 1017)
      await expect(
        token.connect(account3)
        .transferFrom(account1.address, account2.address, 1010)
      )
        .to.be.revertedWith('ERC20: not enough tokens')
    })

    // Test nr 13.2
    it("should not allow to transfer from/to zero address", async function() {
      await expect(token.transferFrom(ethers.constants.AddressZero, account2.address, 0))
        .to.be.revertedWith('ERC20: transfer from zero address')
      await expect(token.transferFrom(account1.address, ethers.constants.AddressZero, 0))
        .to.be.revertedWith('ERC20: transfer to zero address')
    })

    // Test nr 13.3
    it("should not allow the transfer if spender doesn't have enough allowance", async function() {
      await token.transfer(account1.address, 102)
      await token.connect(account1).approve(account3.address, 100)
      await expect(token.connect(account3).transferFrom(account1.address, account2.address, 101))
        .to.be.revertedWith('ERC20: not enough allowance')
    })

    // Test nr 13.4
    it("should change balance for _from(-) and _to(+) accounts", async function() {
      // owner transfers to account1 1k tokens
      await token.transfer(account1.address, 1000)

      // account1 approves to account3 to spend 104 tokens on its behalf
      await token.connect(account1).approve(account3.address, 104)
      const tx = await token.connect(account3).transferFrom(account1.address, account2.address, 97)
      await tx.wait()

      // change in both balances
      await expect(() => tx).to.changeTokenBalances(token, [account1, account2], [-97, 97])

      // change in allowance
      expect(await token.allowance(account1.address, account3.address)).to.equal(7)
    })

    // Test nr 13.5
    it("should emit Transfer event", async function() {
      // owner transfers to account1 1989 tokens
      await token.transfer(account1.address, 1989)

      // account1 approves to account3 to spend 1988 tokens on its behalf
      await token.connect(account1).approve(account3.address, 1988)


      await expect(
        await token.connect(account3).transferFrom(account1.address, account2.address, 1088)
        ).to.emit(token, 'Transfer')
         .withArgs(account1.address, account2.address, 1088)
    })
  })

  describe("addAddressWhitelist", function () {
    // Test nr 14.1
    it("should not add the zero address", async function() {
      await expect(
        token.addAddressWhitelist(ethers.constants.AddressZero)
      ).to.be.revertedWith('ERC20: adding zero address')
    })

    // Test nr 14.2
    it("should not override addresses already present in whitelist", async function() {
      await token.addAddressWhitelist(account1.address)
      await expect(
        token.addAddressWhitelist(account1.address)
      ).to.be.revertedWith("ERC20: address already in whitelist")
    })

    // Test nr 14.3 
    it("should allow adding new address only by whitelisted addresses", async function() {
      await expect(
        token.connect(account2).addAddressWhitelist(account1.address)
      ).to.be.revertedWith("ERC20: you're not in whitelist")

      await token.addAddressWhitelist(account1.address)
      const isThere = await token.checkAddressInWhitelist(account1.address)
      expect(isThere).to.be.true
    })

    // Test nr 14.4
    it("should emit AddWhitelist event", async function() {
      await expect(
        await token.addAddressWhitelist(account1.address)
      ).to.emit(token, 'AddWhitelist')
       .withArgs(owner.address, account1.address)
    })
  })

  describe("removeAddressWhitelist", function () {
    // Test nr 15.1 
    it("should allow removing one address only by whitelisted addresses", async function() {
      await expect(
        token.connect(account1).removeAddressWhitelist(account3.address)
      ).to.be.revertedWith("ERC20: you're not in whitelist")

      await token.addAddressWhitelist(account2.address)
      await token.removeAddressWhitelist(account2.address)

      const isThere = await token.checkAddressInWhitelist(account2.address)
      expect(isThere).to.be.false
    })

    // Test nr 15.2
    it("should not override addresses already deleted/not included in whitelist", async function() {
      await expect(
        token.removeAddressWhitelist(account2.address)
      ).to.be.revertedWith("ERC20: address is already not in whitelist")
    })

    // Test nr 15.3
    it("should not allow owner removal from whitelist", async function() {
      await token.addAddressWhitelist(account1.address)
      await expect(
        token.connect(account1).removeAddressWhitelist(owner.address)
      ).to.be.revertedWith("ERC20: owner can't be removed from whitelist")
    })

    // Test nr 15.4
    it("should emit removeWhitelist event", async function() {
      await token.addAddressWhitelist(account2.address)
      await expect(
        await token.removeAddressWhitelist(account2.address)
      ).to.emit(token, 'RemoveWhitelist')
       .withArgs(owner.address, account2.address)
    })
  })

  describe("checkAddressInWhitelist", function() {
    // Test nr 16
    it("should return if address is in whitelist or not", async function() {
      await token.addAddressWhitelist(account1.address)
      expect(
        await token.checkAddressInWhitelist(account1.address)
      ).to.be.true

      expect(
        await token.checkAddressInWhitelist(ethers.constants.AddressZero)
      ).to.be.false
    })
  })
})
