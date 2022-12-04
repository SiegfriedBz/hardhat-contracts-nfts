const networkConfig = {
  31337: {
    name: "localhost",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    //vrfCoordinatorV2: use Mock on local blockchain
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    // subscriptionId: done programmatically on local blockchain
    link_baseFee: ethers.utils.parseEther("0.25"), //it costs 0.25LINK per rdom number request// uint96 _baseFee : "Premium" value, network-specific at https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#goerli-testnet
    link_gasPriceLink: 10e9, // ~ LINK per GAS
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    subscriptionId: "5772",
    link_baseFee: ethers.utils.parseEther("0.25"),
    link_gasPriceLink: 10e9,
  },
}

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"
const developmentChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
}
