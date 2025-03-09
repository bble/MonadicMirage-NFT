import { create } from "ipfs-http-client";


const client = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization: "5a9ebf3fdfe04611b50e9fd157be0a00" 
  }
});

export async function uploadFileToIPFS(file) {
    try {
        const added = await client.add(file);
        return `ipfs://${added.path}`;
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        return null;
    }
}

export async function uploadMetadataToIPFS(name, description, imageUrl) {
    const metadata = { name, description, image: imageUrl };
    try {
        const added = await client.add(JSON.stringify(metadata));
        return `ipfs://${added.path}`;
    } catch (error) {
        console.error("IPFS Metadata Upload Error:", error);
        return null;
    }
}
