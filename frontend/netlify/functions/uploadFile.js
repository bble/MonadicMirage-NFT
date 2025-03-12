import fetch from 'node-fetch'; 

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
    try {
        const fileBuffer = Buffer.from(event.body.file, 'binary'); 
        const formData = new FormData();
        formData.append('file', fileBuffer, 'file');
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
                ...formData.getHeaders(), // 自动处理 Content-Type 头
            },
            body: formData,
        });
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ ipfsUrl: `ipfs://${data.IpfsHash}` }),
        };
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "IPFS Upload Failed" }),
        };
    }
}
