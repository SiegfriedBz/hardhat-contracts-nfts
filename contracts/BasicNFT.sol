// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNFT is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 private s_nextTokenId;

    constructor() ERC721("Dogie", "DOG") {
        s_nextTokenId = 0;
    }

    function mint() public returns (uint256) {
        _safeMint(msg.sender, s_nextTokenId);
        s_nextTokenId++;
        return s_nextTokenId;
    }

    function tokenURI(
        uint256 /* _tokenId */
    ) public pure override returns (string memory) {
        return TOKEN_URI;
    }

    //* getters */
    function getNexttTokenId() public view returns (uint256) {
        return s_nextTokenId;
    }
}
