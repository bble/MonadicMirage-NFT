/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
  }
};

module.exports = nextConfig;
