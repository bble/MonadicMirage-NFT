const fetch = require('node-fetch');

export async function handler(event) {
  const formData = new FormData();
  formData.append("file", event.body.file);

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "pinata_api_key": process.env.PINATA_API_KEY,
        "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
      },
      body: formData
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ ipfsUrl: `ipfs://${data.IpfsHash}` })
    };
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "IPFS Upload Failed" })
    };
  }
}
