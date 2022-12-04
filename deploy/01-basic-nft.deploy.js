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
  const args = []

  console.log("---------")
  console.log("Deploying BasicNFT...")

  const basicNft = await deploy("BasicNFT", {
    contract: "BasicNFT",
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  console.log("Deploying BasicNFT...DONE")

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log(`Contract EtherScan Verification...`)
    await verify(basicNft.address, args)
  }

  console.log("---------")
}

module.exports.tags = ["all", "basicNft"]
