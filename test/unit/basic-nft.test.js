const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config")
const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { expect } = require("chai")
const { solidity } = require("ethereum-waffle")
require("hardhat-gas-reporter")
const { constants, expectRevert } = require("@openzeppelin/test-helpers")

const TOKEN_URI =
  "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT", function () {
      let accounts, deployer
      let basicNft
      // const chainId = network.config.chainId

      beforeEach(async function () {
        accounts = await ethers.getSigners()
        ;[deployer, user01] = accounts
        await deployments.fixture(["all"])
        basicNft = await ethers.getContract("BasicNFT")
      })

      describe("constructor", function () {
        it("initializes the contract correctly", async function () {
          expect(await basicNft.name()).to.equal("Dogie")
          expect(await basicNft.symbol()).to.equal("DOG")
        })
      })

      describe("mint", function () {
        it("transfers 1 NFT to the user", async function () {
          const user_Balance_Init = await basicNft.balanceOf(deployer.address)
          // mint
          let trx = await basicNft.mint()
          await trx.wait(1)
          // assert
          const user_Balance_After = await basicNft.balanceOf(deployer.address)
          expect(user_Balance_After).to.equal(user_Balance_Init.add(1))
        })

        it("increments the token counter", async function () {
          const tokenCounter_Init = await basicNft.getNexttTokenId()
          // mint
          let trx = await basicNft.mint()
          await trx.wait(1)
          // assert
          const tokenCounter_After = await basicNft.getNexttTokenId()
          expect(tokenCounter_After).to.equal(tokenCounter_Init.add(1))
        })

        it("emits the correct Transfer event", async function () {
          const tokenCounter = await basicNft.getNexttTokenId()
          // assert
          await expect(basicNft.mint())
            .to.emit(basicNft, "Transfer")
            .withArgs(constants.ZERO_ADDRESS, deployer.address, tokenCounter)
        })
      })

      describe("tokenURI", function () {
        it("returns the correct TokenURI", async function () {
          const TOKEN_URI = await basicNft.TOKEN_URI()
          expect(await basicNft.tokenURI(0)).to.equal(TOKEN_URI)
        })
      })
    })
