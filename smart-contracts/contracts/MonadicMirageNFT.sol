// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonadicMirageNFT is ERC721URIStorage, Ownable {
    uint256 private nextTokenId;

    constructor() ERC721("Monadic Mirage NFT", "MMNFT") Ownable(msg.sender) {
        nextTokenId = 1; // 初始化 tokenId
    }

    function mintNFT(string memory metadataURI) public {
        require(balanceOf(msg.sender) == 0, "You already own an NFT");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI); // 使用 `metadataURI` 避免和 `tokenURI` 方法冲突

        nextTokenId++;
    }

    // 仅继承 ERC721URIStorage 进行 override
    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
