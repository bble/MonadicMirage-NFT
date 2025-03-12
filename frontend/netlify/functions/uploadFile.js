import axios from "axios";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const metadata = JSON.parse(event.body);
        metadata.image = metadata.image.replace("https://gateway.pinata.cloud/ipfs/", "ipfs://");

        const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ ipfsUrl: `ipfs://${response.data.IpfsHash}` }),
        };
    } catch (error) {
        console.error("IPFS Metadata Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Metadata Upload Failed" }),
        };
    }
}
