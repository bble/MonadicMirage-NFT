import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.error("ERROR: Missing Pinata credentials in .env file!");
}

export async function uploadFileToIPFS(file) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const formData = new FormData();
  formData.append("file", file);

  const options = JSON.stringify({
    cidVersion: 1,
  });

  formData.append("pinataOptions", options);

  try {
    const response = await axios.post(url, formData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
}


export async function uploadMetadataToIPFS(name, description, imageUrl) {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  const metadata = {
    name,
    description,
    image: imageUrl,
  };

  try {
    const response = await axios.post(url, metadata, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error("IPFS Metadata Upload Error:", error);
    return null;
  }
}
