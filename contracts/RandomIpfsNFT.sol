// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

error RandomIpfsNFT__MustCoverMintFee();
error RandomIpfsNFT__RangeOutOfBounds();

// import "hardhat/console.sol";
// ERC721
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Chainlink VRF v2
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract RandomIpfsNFT is ERC721URIStorage, VRFConsumerBaseV2 {
    /* Type Declaration */
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    /* State Variables */
    address private immutable i_owner;
    uint256 private s_mintFee;
    uint256 private s_tokenCounter;
    mapping(uint256 => address) private s_requestIdToUser;
    uint256 private constant MAX_CHANCE_VALUE = 100;
    string[] private s_tokenURIs;
    // VRF variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; // https://docs.chain.link/docs/vrf/v2/subscription/examples/get-a-random-number/
    bytes32 private immutable i_gasLane; // eg goerli "30 gwei Key Hash" https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    uint64 private immutable i_subscriptionId; // goerli https://vrf.chain.link/goerli
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUMWORDS = 1;

    /* Events */
    event RandomNumberRequested(
        address indexed user,
        uint256 indexed requestId
    );
    event NFTMinted(
        address indexed nftOwner,
        uint256 indexed newTokendId,
        Breed indexed breed
    );

    /* Functions */
    constructor(
        uint256 _mintFee,
        string[] memory _tokenURIs,
        address _vrfCoordinator,
        bytes32 _gasLane,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit
    ) ERC721("Random IPFS NFT", "RIN") VRFConsumerBaseV2(_vrfCoordinator) {
        i_owner = msg.sender;
        s_tokenURIs = _tokenURIs;
        s_tokenCounter = 0;
        s_mintFee = _mintFee;
        /* ChainLink */
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        i_gasLane = _gasLane;
        i_subscriptionId = _subscriptionId;
        i_callbackGasLimit = _callbackGasLimit;
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value != s_mintFee) {
            revert RandomIpfsNFT__MustCoverMintFee();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUMWORDS
        );
        s_requestIdToUser[requestId] = msg.sender;
        emit RandomNumberRequested(msg.sender, requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 newTokendId = s_tokenCounter;
        s_tokenCounter++;
        address nftOwner = s_requestIdToUser[requestId];
        // getBreedIndex from random number
        uint256 rdmNumber = randomWords[0] % MAX_CHANCE_VALUE; // 0-99
        uint8 breedIndex = getBreedIndex(rdmNumber);
        Breed breed = Breed(breedIndex);
        // mint
        _safeMint(nftOwner, newTokendId);
        // setTokenURI
        string memory _tokenURI = s_tokenURIs[breedIndex];
        _setTokenURI(newTokendId, _tokenURI);
        emit NFTMinted(nftOwner, newTokendId, breed);
    }

    function getBreedIndex(uint256 _rdmNumber) internal view returns (uint8) {
        uint256[3] memory chanceArray = getChanceArray();
        uint256 limit = 0;
        for (uint8 i = 0; i < chanceArray.length; i++) {
            if (limit <= _rdmNumber && _rdmNumber < chanceArray[i]) {
                return i;
            }
            limit = chanceArray[i];
        }
        revert RandomIpfsNFT__RangeOutOfBounds();
    }

    //* Getters */
    function getChanceArray() public view returns (uint[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getMintFee() public view returns (uint256) {
        return s_mintFee;
    }

    function getNextTokenId() public view returns (uint256) {
        return s_tokenCounter;
    }

    //* Fallbacks */
    receive() external payable {
        requestNft();
    }

    fallback() external payable {
        requestNft();
    }
}
