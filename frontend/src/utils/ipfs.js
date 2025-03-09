import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.error("ERROR: Missing Pinata credentials in .env file!");
}

export async function uploadFileToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // **请求 Next.js API 代理，而不是直接请求 Pinata**
    const response = await axios.post("/api/uploadFile", formData);

    return response.data.ipfsUrl; // 返回安全的 IPFS 地址
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
}

export async function uploadMetadataToIPFS(name, description, imageUrl) {
  try {
    const metadata = {
      name,
      description,
      image: imageUrl.replace("https://gateway.pinata.cloud/ipfs/", "ipfs://"),
    };

    const response = await axios.post("/api/uploadMetadata", metadata);

    return response.data.ipfsUrl; 
  } catch (error) {
    console.error("IPFS Metadata Upload Error:", error);
    return null;
  }
}
