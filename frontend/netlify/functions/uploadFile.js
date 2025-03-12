import fetch from 'node-fetch'; 
import FormData from 'form-data'; 

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

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to upload: ${data.error}`);
        }

        // 返回成功的响应
        return {
            statusCode: 200,
            body: JSON.stringify({ ipfsUrl: `ipfs://${data.IpfsHash}` }),
        };
    } catch (error) {
        // 如果出错，打印错误并返回 500 状态
        console.error("IPFS Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "IPFS Upload Failed" }),
        };
    }
}
