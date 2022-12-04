const { config, network, ethers } = require("hardhat")
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

  //* Constructor args
  const mintFee = networkConfig[chainId].mintFee
  const tokenURIs = []
  const gasLane = networkConfig[chainId].gasLane
  const callbackGasLimit = networkConfig[chainId].callbackGasLimit
  let vrfCoordinatorV2
  let subscriptionId

  if (developmentChains.includes(network.name)) {
    const VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    )
    vrfCoordinatorV2 = VRFCoordinatorV2Mock.address
    const transactionResponse = await VRFCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transactionResponse.wait(1)
    // get subscriptionId from event RandomWordsRequested emitted by VRFCoordinatorV2Mock
    subscriptionId = transactionReceipt.events[0].args.subId
    // fund the subscription (done with LINK on real networks)
    await VRFCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      ethers.utils.parseEther("2")
    )
  } else {
    vrfCoordinatorV2 = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }

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
