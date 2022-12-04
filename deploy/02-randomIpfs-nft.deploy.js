const { config, network } = require("hardhat")
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  console.log("chainId", chainId)

  //* Constructor args
  const mintFee = networkConfig[chainId].mintFee
  const tokenURIs = []
  const vrfCoordinatorV2 = networkConfig[chainId].vrfCoordinatorV2
  const gasLane = networkConfig[chainId].gasLane
  const subscriptionId = networkConfig[chainId].subscriptionId
  const callbackGasLimit = networkConfig[chainId].callbackGasLimit

  const args = [
    mintFee,
    tokenURIs,
    vrfCoordinatorV2,
    gasLane,
    subscriptionId,
    callbackGasLimit,
  ]

  console.log("---------")
  console.log("Deploying RandomIpfsNFT...")

  const randomIpfsNft = await deploy("RandomIpfsNFT", {
    contract: "RandomIpfsNFT",
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  console.log("Deploying RandomIpfsNFT...DONE")
  console.log(`Contract deployed to ${randomIpfsNft.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log(`Contract EtherScan Verification...`)
    await verify(randomIpfsNft.address, args)
  }

  console.log("---------")
}

module.exports.tags = ["all", "randomIpfsNft"]
