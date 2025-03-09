import axios from "axios";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const formData = new FormData();
        formData.append("file", event.body.file);

        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ ipfsUrl: `ipfs://${response.data.IpfsHash}` }),
        };
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "IPFS Upload Failed" }),
        };
    }
}