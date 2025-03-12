import fetch from 'node-fetch'; // 使用 node-fetch

export async function handler(event) {
    // 确保是 POST 请求
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        // 确保收到的文件是二进制数据
        const fileBuffer = Buffer.from(event.body.file, 'binary'); // 读取二进制数据

        // 创建 FormData 来发送
        const formData = new FormData();
        formData.append('file', fileBuffer, 'file');

        // 调用 Pinata API 上传文件
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                "pinata_api_key": process.env.PINATA_API_KEY,
                "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
                ...formData.getHeaders(), // 自动处理头部
            },
            body: formData,
        });

        const data = await response.json(); // 获取 Pinata 的响应

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
