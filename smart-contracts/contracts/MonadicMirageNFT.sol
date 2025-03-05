// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonadicMirageNFT is ERC721URIStorage, Ownable {
    uint256 private nextTokenId;

    constructor() ERC721("MonadicMirageNFT", "MMNFT") {}

    function mintNFT(string memory tokenURI) public {
        require(balanceOf(msg.sender) == 0, "You already own an NFT");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);  // 存储 IPFS 地址

        nextTokenId++;
    }
}
