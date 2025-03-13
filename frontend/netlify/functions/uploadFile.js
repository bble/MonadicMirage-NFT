import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        if (!event.isBase64Encoded) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: " file is not Base64 Encoded." }),
            };
        }

        // 将 Base64 解码为 Buffer
        const fileBuffer = Buffer.from(event.body, "base64");

        // 使用 form-data 处理 Buffer
        const formData = new FormData();
        formData.append("file", fileBuffer, { filename: "uploaded_file.txt", contentType: "application/octet-stream" });

        // 发送到 Pinata
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
                ...formData.getHeaders(), 
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
