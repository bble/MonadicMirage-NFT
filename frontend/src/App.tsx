import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractData from "@/contracts/NFTContract.json";  // ✅ 确保正确导入
import { uploadFileToIPFS, uploadMetadataToIPFS } from "@/utils/ipfs";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "0xYourSmartContractAddress";
const contractABI = contractData.abi;  // ✅ 确保正确获取 ABI

export default function NFTMinting() {
    const [account, setAccount] = useState(null);
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contract, setContract] = useState(null);

useEffect(() => {
    async function loadContract() {
        if (typeof window !== "undefined" && window.ethereum) {  // 确保 window.ethereum 存在
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
                setContract(contractInstance);
            } catch (error) {
                console.error("Error loading contract:", error);
            }
        } else {
            console.warn("MetaMask not detected!");
        }
    }
    loadContract();
}, []);

import { ethers } from "ethers";

async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum); // v6 语法
            const signer = await provider.getSigner();
            setAccount(await signer.getAddress());
        } catch (error) {
            if (error.code === "ACTION_REJECTED") {
                alert("用户拒绝了连接钱包请求，请重新尝试！");
            } else {
                console.error("连接钱包时发生错误:", error);
            }
        }
    } else {
        alert("请安装 MetaMask 扩展！");
    }
}

    async function mintNFT() {
        if (!contract || !file) return alert("Please upload an image and connect wallet!");

        // 1️⃣ 上传图片到 IPFS
        const imageUrl = await uploadFileToIPFS(file);
        if (!imageUrl) return alert("Image upload failed!");

        // 2️⃣ 上传 NFT 元数据到 IPFS
        const metadataUrl = await uploadMetadataToIPFS(name, description, imageUrl);
        if (!metadataUrl) return alert("Metadata upload failed!");

        // 3️⃣ 调用智能合约铸造 NFT
        const tx = await contract.mintNFT(metadataUrl);
        await tx.wait();
        alert("NFT Minted Successfully!");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-4xl font-bold mb-6">Monadic Mirage NFT</h1>
            {account ? (
                <>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
                    <input type="text" placeholder="NFT Name" onChange={(e) => setName(e.target.value)} className="mb-4 p-2 text-black" />
                    <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="mb-4 p-2 text-black" />
                    <Button onClick={mintNFT} className="bg-blue-500">Mint NFT</Button>
                </>
            ) : (
                <Button onClick={connectWallet} className="bg-gray-500">Connect Wallet</Button>
            )}
        </div>
    );
}
