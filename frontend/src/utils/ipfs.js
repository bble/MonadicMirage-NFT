import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.error("ERROR: Missing Pinata credentials in .env file!");
}

export async function uploadFileToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);
     const response = await axios.post("/.netlify/functions/uploadFile", formData);
    return response.data.ipfsUrl;
}

export async function uploadMetadataToIPFS(name, description, imageUrl) {
    const metadata = { name, description, image: imageUrl };
    const response = await axios.post("/.netlify/functions/uploadMetadata", metadata);
    return response.data.ipfsUrl;
}
