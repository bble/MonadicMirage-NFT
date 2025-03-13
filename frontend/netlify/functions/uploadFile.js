import fetch from 'node-fetch';

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
                body: JSON.stringify({ message: "Invalid file encoding" }),
            };
        }

        // 解码 base64 为二进制 Buffer
        const fileBuffer = Buffer.from(event.body, 'base64');

        // 创建 FormData
        const formData = new FormData();
        formData.append("file", fileBuffer, { filename: "uploaded_file" });

        // 发送文件到 Pinata
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
            },
            body: formData,
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
