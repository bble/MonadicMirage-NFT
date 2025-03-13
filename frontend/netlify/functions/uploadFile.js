import fs from 'fs';
import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {

        const form = new IncomingForm({ multiples: false });

        const data = await new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const file = data.files.file; 
        console.log("data:",data);
        console.log("data.files:",data.files);
        console.log("data.files.file:",data.files.file);
        if (!file) {
            return { statusCode: 400, body: JSON.stringify({ message: "No file uploaded" }) };
        }

        const fileStream = fs.createReadStream(file.filepath);

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
            },
            body: fileStream,
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
