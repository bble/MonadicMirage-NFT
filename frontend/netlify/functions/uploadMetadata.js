import fetch from 'node-fetch';

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

        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
            },
            body: JSON.stringify(metadata)
        });

        if (!response.ok) {
            throw new Error(`Failed to upload metadata: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ ipfsUrl: `ipfs://${data.IpfsHash}` }),
        };
    } catch (error) {
        console.error("IPFS Metadata Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Metadata Upload Failed" }),
        };
    }
}
