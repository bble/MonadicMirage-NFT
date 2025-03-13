import fetch from 'node-fetch';
import { Buffer } from 'buffer'; 
import FormData from 'form-data';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    console.error("ERROR: Missing Pinata credentials in .env file!");
}

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No file uploaded" }),
            };
        }
        const fileBuffer = Buffer.from(event.body, 'base64');  
        const formData = new FormData();
        formData.append("file", fileBuffer, { filename: 'file' });
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "pinata_api_key": PINATA_API_KEY,
                "pinata_secret_api_key": PINATA_SECRET_API_KEY,
                "Content-Type": "multipart/form-data"
            },
            body: formData,
        });
        const result = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ ipfsUrl: `ipfs://${result.IpfsHash}` }),
        };
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "IPFS Upload Failed" }),
        };
    }
}
