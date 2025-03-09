import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    return res.status(500).json({ error: "Missing Pinata API keys" });
  }

  try {
    const metadata = req.body; // 前端传递的 NFT metadata

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    return res.status(200).json({ ipfsUrl: `ipfs://${response.data.IpfsHash}` });
  } catch (error) {
    console.error("IPFS Metadata Upload Error:", error);
    return res.status(500).json({ error: "Metadata upload failed" });
  }
}
