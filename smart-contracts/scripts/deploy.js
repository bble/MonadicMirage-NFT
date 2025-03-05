const hre = require("hardhat");

async function main() {
    const NFTContract = await hre.ethers.getContractFactory("MonadicMirageNFT");
    const nft = await NFTContract.deploy();
    await nft.deployed();
    console.log("NFT Contract deployed to:", nft.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
