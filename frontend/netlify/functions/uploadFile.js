import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        // 解析 multipart/form-data 请求
        const form = new IncomingForm({ multiples: false });

        const data = await new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const file = data.files.file;
        if (!file) {
            return { statusCode: 400, body: JSON.stringify({ message: "No file uploaded" }) };
        }

        // 解码 base64 为二进制数据
        const fileBuffer = Buffer.from(file, 'base64');
        
        // 使用 fetch 上传文件到 Pinata
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
                "Content-Type": "multipart/form-data",
            },
            body: fileBuffer, // 上传解码后的二进制数据
        });
        console.log("response:",response);
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
