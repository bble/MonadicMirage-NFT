import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractData from "@/contracts/NFTContract.json";  
import { uploadFileToIPFS, uploadMetadataToIPFS } from "@/utils/ipfs";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "0xCffA7CC35c7E5a01Fca5659D275d18214F638fab";
const contractABI = contractData.abi;  

export default function NFTMinting() {
    const [account, setAccount] = useState(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("请选择文件"); // **优化文件名显示**
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contract, setContract] = useState(null);

    useEffect(() => {
        async function loadContract() {
            if (typeof window !== "undefined" && window.ethereum) {  
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

    async function switchToMonadNetwork() {
        const EXPECTED_CHAIN_ID = "0x279f"; // 10143 转换为 0x279F
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            if (network.chainId !== parseInt(EXPECTED_CHAIN_ID, 16)) { 
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: EXPECTED_CHAIN_ID }]
                });
                return true;
            }
            return true; 
        } catch (error) {
            console.error("Network switch failed:", error);
            alert("Please manually switch to Monad Testnet in MetaMask.");
            return false;
        }
    }

    async function connectWallet() {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                await switchToMonadNetwork(); // 先切换到 Monad Testnet
                await window.ethereum.request({ method: "eth_requestAccounts" }); // 确保触发 UI
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setAccount(await signer.getAddress());
            } catch (error) {
                console.error("Wallet connection error:", error);
            }
        } else {
            alert("请安装 MetaMask!");
        }
    }

    async function mintNFT() {
        if (!contract || !file) return alert("请先上传文件并连接钱包!");

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" }); // **触发 MetaMask UI**
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

            // 1️⃣ 上传图片到 IPFS
            const imageUrl = await uploadFileToIPFS(file);
            if (!imageUrl) return alert("文件上传失败!");

            // 2️⃣ 上传 NFT 元数据到 IPFS
            const metadataUrl = await uploadMetadataToIPFS(name, description, imageUrl);
            console.log("Metadata URI to be minted:", metadataUrl);
            if (!metadataUrl) return alert("元数据上传失败!");

            // 3️⃣ **触发 NFT 铸造交易**
            console.log("Minting NFT with metadata:", metadataUrl);
            const tx = await contractWithSigner.mintNFT(metadataUrl);
            console.log("交易发送成功:", tx.hash);

            await tx.wait();
            alert("NFT 铸造成功!");
        } catch (error) {
            console.error("交易失败:", error);
            alert("交易失败! 请检查控制台获取详细信息.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-4xl font-bold mb-6">Monadic Mirage NFT</h1>

            {account ? (
                <>
                    {/* ✅ **优化文件选择按钮** */}
                    <label className="flex items-center cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                        📁 {fileName}
                        <input 
                            type="file" 
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                                setFileName(e.target.files[0] ? e.target.files[0].name : "请选择文件");
                            }} 
                            className="hidden"
                        />
                    </label>

                    <input 
                        type="text" 
                        placeholder="NFT 名称" 
                        onChange={(e) => setName(e.target.value)} 
                        className="mb-4 p-2 mt-4 text-black w-64 rounded-lg" 
                    />
                    <input 
                        type="text" 
                        placeholder="描述信息" 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="mb-4 p-2 text-black w-64 rounded-lg" 
                    />

                    <Button onClick={mintNFT} className="bg-blue-500 mt-4">铸造 NFT</Button>
                </>
            ) : (
                <Button onClick={connectWallet} className="bg-gray-500">连接钱包</Button>
            )}
        </div>
    );
}
